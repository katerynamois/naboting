import { Router } from "express";
import {
  createItem,
  deleteItem,
  getItemById,
  getItems,
  updateItem,
  updateItemStatus,
} from "../controllers/item.controller.js";

const router = Router();

router.get("/", getItems);
router.get("/:id", getItemById);
router.post("/", createItem);
router.put("/:id", updateItem);
router.patch("/:id/status", updateItemStatus);
router.delete("/:id", deleteItem);

export default router;
