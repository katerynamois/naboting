import { pool } from "../db.config.js";

const itemSelect = `
  SELECT
    i.item_id,
    i.owner_id,
    i.title,
    i.brand,
    i.category,
    i.item_condition,
    i.quantity,
    i.minimum_loan_period,
    i.status,
    i.created_at,
    img.image_url,
    GROUP_CONCAT(DISTINCT a.name ORDER BY a.accessory_id SEPARATOR '||') AS accessories
  FROM items i
  LEFT JOIN item_images img ON img.item_id = i.item_id AND img.is_primary = 1
  LEFT JOIN accessories a ON a.item_id = i.item_id
`;

function mapItem(row) {
  if (!row) return null;

  return {
    item_id: row.item_id,
    owner_id: row.owner_id,
    title: row.title,
    brand: row.brand,
    category: row.category,
    item_condition: row.item_condition,
    quantity: row.quantity,
    minimum_loan_period: row.minimum_loan_period,
    status: row.status,
    created_at: row.created_at,
    image_url: row.image_url,
    accessories: row.accessories ? row.accessories.split("||") : [],
  };
}

async function findAll() {
  const [rows] = await pool.query(`
    ${itemSelect}
    GROUP BY i.item_id, img.image_url
    ORDER BY i.item_id DESC
  `);
  return rows.map(mapItem);
}

async function findById(id) {
  const [rows] = await pool.execute(`
    ${itemSelect}
    WHERE i.item_id = ?
    GROUP BY i.item_id, img.image_url
  `, [id]);
  return mapItem(rows[0]);
}

async function create(item) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO items
        (owner_id, title, brand, category, item_condition, quantity, minimum_loan_period, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.owner_id,
        item.title,
        item.brand || null,
        item.category || null,
        item.item_condition || item.condition || null,
        item.quantity || 1,
        item.minimum_loan_period || item.minimumLoanPeriod || null,
        item.status || "available",
      ],
    );

    const itemId = result.insertId;
    const images = item.images || [];
    const accessories = item.accessories || [];

    for (const [index, imageUrl] of images.entries()) {
      await connection.execute(
        "INSERT INTO item_images (item_id, image_url, is_primary) VALUES (?, ?, ?)",
        [itemId, imageUrl, index === 0 ? 1 : 0],
      );
    }

    for (const accessory of accessories) {
      await connection.execute(
        "INSERT INTO accessories (item_id, name) VALUES (?, ?)",
        [itemId, accessory],
      );
    }

    await connection.commit();
    return findById(itemId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function update(id, item) {
  await pool.execute(
    `UPDATE items
     SET owner_id = ?, title = ?, brand = ?, category = ?, item_condition = ?,
         quantity = ?, minimum_loan_period = ?, status = ?
     WHERE item_id = ?`,
    [
      item.owner_id,
      item.title,
      item.brand || null,
      item.category || null,
      item.item_condition || item.condition || null,
      item.quantity || 1,
      item.minimum_loan_period || item.minimumLoanPeriod || null,
      item.status || "available",
      id,
    ],
  );

  return findById(id);
}

async function updateStatus(id, status) {
  await pool.execute("UPDATE items SET status = ? WHERE item_id = ?", [status, id]);
  return findById(id);
}

async function remove(id) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.execute("DELETE FROM accessories WHERE item_id = ?", [id]);
    await connection.execute("DELETE FROM item_images WHERE item_id = ?", [id]);
    await connection.execute("DELETE FROM loans WHERE item_id = ?", [id]);
    const [result] = await connection.execute("DELETE FROM items WHERE item_id = ?", [id]);
    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export default {
  findAll,
  findById,
  create,
  update,
  updateStatus,
  remove,
};

