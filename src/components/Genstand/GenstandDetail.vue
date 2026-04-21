<script>
import GenstandEditModal from './GenstandEditModal.vue'

export default {
    name: 'GenstandDetail',
    components: {
        GenstandEditModal,
    },
    data() {
        return {
            showEditModal: false,
        }
    },
    props: {
        // Alle oplysninger om den valgte genstand
        id: {
            type: [Number, String],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            default: null
        },
        status: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        // Genstandens stand - viser hvor god stand genstanden er i
        condition: {
            type: String,
            default: null
        },
        // Minimum låneperiode for genstanden
        minimumLoanPeriod: {
            type: [Number, String],
            default: null
        },
        quantity: {
            type: [Number, String],
            default: 1
        },
        // Tilbehør til genstanden - kun vist hvis der er noget
        accessories: {
            type: Array,
            default: () => [],
        },
        // Statistik - kun synlig for ejeren
        totalLoans: {
            type: Number,
            default: 0
        },
        activeLoans: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: String,
            default: null
        },
    },
    computed: {
        // Returnerer den korrekte CSS-klasse baseret på status
        statusClass() {
            if (this.status === 'Tilgængelig') return 'status-tilgaengelig'
            if (this.status === 'Udlånt') return 'status-udlaant'
            if (this.status === 'Inaktiv') return 'status-inaktiv'
        },
        accessoriesList() {
            return this.accessories || []
        },
        minLoanPeriodText() {
            if (this.minimumLoanPeriod === null || this.minimumLoanPeriod === undefined || this.minimumLoanPeriod === '') {
                return 'Ikke angivet'
            }
            return typeof this.minimumLoanPeriod === 'number' ? `${this.minimumLoanPeriod} dage` : this.minimumLoanPeriod
        },
        createdAtText() {
            if (!this.createdAt) return ''
            const date = new Date(this.createdAt)
            return `Oprettet ${date.toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })}`
        }

    },
    methods: {
        updateStatus(newStatus) {
            this.$emit('update-status', {
                id: this.id,
                status: newStatus
            })
        },
        deleteItem() {
            if (window.confirm('Vil du slette denne genstand?')) {
                this.$emit('delete-item', this.id)
            }
        },
        handleSaveEdit(updatedFields) {
            this.$emit('edit-item', { id: this.id, ...updatedFields })
            this.showEditModal = false
        },
    },
    watch: {
    },
    emits: ['gåTilbage', 'update-status', 'delete-item', 'edit-item']
}
</script>

<template>
    <div class="detalje-side">

        <!-- Topbar med tilbage-knap -->
        <header class="detalje-header">
            <!-- Tilbage-knap - sender gåTilbage event op til forælderen -->
            <button class="tilbage-knap" @click="$emit('gåTilbage')">
                Tilbage
            </button>
        </header>

        <!-- Stort billede med status tag i hjørnet -->
        <figure class="detalje-billede-wrapper">
            <img
                :src="image"
                :alt="`Billede af ${title}`"
                class="detalje-billede"
            />
            <!-- Status tag oven på billedet i nederste højre hjørne -->
            <span class="detalje-status" :class="statusClass">
                <span class="detalje-status-prik" aria-hidden="true"></span>
                {{ status }}
            </span>
        </figure>

        <!-- Genstandens informationer -->
        <section class="detalje-info">
            <!-- Titel på genstanden -->
            <h1 class="detalje-titel">{{ title }}</h1>
            <!-- Kategori, mærke og stand på samme linje -->
            <p class="detalje-meta">
                {{ category }}
                <span v-if="brand"> · {{ brand }}</span>
                <span v-if="condition"> · {{ condition }}</span>
            </p>
        </section>

        <!-- To informationsbokse - max låneperiode og tilbehør -->
        <section class="detalje-bokse" aria-label="Genstandsdetaljer">

            <!-- Min. låneperiode boks -->
            <div class="detalje-boks">
                <span class="detalje-boks-label-top">Min. lån</span>
                <span class="detalje-boks-tal detalje-boks-tal--periode">
                    {{ minLoanPeriodText }}
                </span>
            </div>

            <!-- Tilbehør boks - vises kun hvis der er tilbehør -->
            <div v-if="accessories && accessories.length" class="detalje-boks detalje-boks-tilbehoer">
                <!-- Ikon og overskrift side om side øverst i boksen -->
                <div class="detalje-boks-top">
                    <h3 class="detalje-boks-overskrift">Tilbehør</h3>
                </div>
                <!-- Hvert tilbehør vises som en chip -->
                <div class="detalje-chips">
                    <span
                        v-for="item in accessoriesList"
                        :key="item"
                        class="detalje-chip"
                    >
                        {{ item }}
                    </span>
                </div>
            </div>

        </section>

        <!-- Ejer sektion - viser hvem der ejer genstanden -->
        <section class="detalje-ejer" aria-label="Ejeroplysninger">
            <!-- Avatar cirkel med initialer - erstattes med rigtigt billede når login tilføjes -->
            <div class="detalje-ejer-avatar" aria-hidden="true">DG</div>
            <div class="detalje-ejer-info">
                <p class="detalje-ejer-navn">Din genstand</p>
                <p class="detalje-ejer-dato">{{ createdAtText }}</p>
            </div>
            <div class="detalje-status-actions">
                <button
                    v-for="option in ['Tilgængelig', 'Udlånt', 'Inaktiv']"
                    :key="option"
                    class="status-option"
                    :class="[
                        `status-option--${option.toLowerCase().replace('æ', 'ae').replace('å', 'aa')}`,
                        { 'status-option--active': status === option }
                    ]"
                    type="button"
                    @click="updateStatus(option)"
                >
                    {{ option }}
                </button>
            </div>
            <button
                class="rediger-knap"
                type="button"
                @click="showEditModal = true"
            >
                Rediger genstand
            </button>
            <button
                class="delete-item-button"
                type="button"
                @click="deleteItem"
            >
                Slet genstand
            </button>
        </section>

        <GenstandEditModal
            v-if="showEditModal"
            :title="title"
            :category="category"
            :brand="brand"
            :condition="condition"
            :minimumLoanPeriod="minimumLoanPeriod"
            :quantity="quantity"
            @save="handleSaveEdit"
            @close="showEditModal = false"
        />

        <!-- Statistik sektion - kun synlig for ejeren -->
        <section class="detalje-stats" aria-label="Statistik for din genstand">
            <!-- Lån i alt -->
            <div class="detalje-stat-boks">
                <span class="detalje-stat-tal">{{ totalLoans }}</span>
                <span class="detalje-stat-label">Lån i alt</span>
            </div>
            <!-- Aktive lån -->
            <div class="detalje-stat-boks">
                <span class="detalje-stat-tal">{{ activeLoans }}</span>
                <span class="detalje-stat-label">Aktive lån</span>
            </div>
        </section>

    </div>
</template>

<style scoped>

/* Hele detaljesiden - varm baggrund som fylder hele skærmen */
.detalje-side {
    background: var(--color-bg);
    min-height: 100vh;
    padding: var(--space-4);
    box-sizing: border-box;
}

/* Topbar */
.detalje-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
}

/* Tilbage-knap - gennemsigtig baggrund */
.tilbage-knap {
    background: transparent;
    color: #111111;
    border: none;
    font-family: var(--font-body);
    font-size: var(--text-body);
    font-weight: 500;
    cursor: pointer;
    padding: var(--space-3) 0;
    min-height: 44px;
}

/* Billedwrapper - position relative så status tag kan placeres i hjørnet */
.detalje-billede-wrapper {
    position: relative;
    margin: 0 0 20px 0;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: #ffffff;
}

/* Billedet fylder hele bredden */
.detalje-billede {
    width: 100%;
    height: 220px;
    object-fit: contain;
    display: block;
}

/* Status tag placeret i nederste højre hjørne af billedet */
.detalje-status {
    position: absolute;
    bottom: 12px;
    right: 12px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 600;
    padding: 5px 11px;
    border-radius: var(--radius-full);
    min-height: 32px;
}

/* Lille farvet prik ved siden af status teksten */
.detalje-status-prik {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
}

/* Tilgængelig - grøn */
.status-tilgaengelig {
    background: var(--color-tilgaengelig-bg);
    color: var(--color-tilgaengelig-text);
}
.status-tilgaengelig .detalje-status-prik {
    background: var(--color-tilgaengelig-dot);
}

/* Udlånt - orange */
.status-udlaant {
    background: var(--color-udlaant-bg);
    color: var(--color-udlaant-text);
}
.status-udlaant .detalje-status-prik {
    background: var(--color-udlaant-dot);
}

/* Inaktiv - grå */
.status-inaktiv {
    background: var(--color-inaktiv-bg);
    color: var(--color-inaktiv-text);
}
.status-inaktiv .detalje-status-prik {
    background: var(--color-inaktiv-dot);
}

/* Genstandens titel */
.detalje-titel {
    font-family: var(--font-display);
    font-size: var(--text-h1);
    font-weight: 600;
    color: var(--color-neutral);
    margin: 0 0 6px 0;
}

/* Kategori, mærke og stand tekst */
.detalje-meta {
    font-family: var(--font-body);
    font-size: var(--text-label);
    color: var(--color-secondary);
    margin: 0 0 20px 0;
}

/* To bokse side om side */
.detalje-bokse {
    display: flex;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
    align-items: stretch;
}

/* Basis boks styling - centreret indhold */
.detalje-boks {
    flex: 1;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    text-align: center;
}

/* Tilbehør boksen er dobbelt så bred og venstrestillet */
.detalje-boks-tilbehoer {
    flex: 2;
    align-items: flex-start;
    text-align: left;
    justify-content: flex-start;
}

/* Ikon og overskrift side om side øverst i boksen */
.detalje-boks-top {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
}

/* Overskrift i boksen */
.detalje-boks-overskrift {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 600;
    color: var(--color-secondary);
    margin: 0;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Lille grå label øverst i max lån boksen */
.detalje-boks-label-top {
    font-family: var(--font-body);
    font-size: var(--text-meta);
    font-weight: 500;
    color: var(--color-secondary);
}

/* Stort tal i midten af max lån boksen */
.detalje-boks-tal {
    font-family: var(--font-body);
    font-size: 32px;
    font-weight: 700;
    color: var(--color-neutral);
    line-height: 1;
}

.detalje-boks-tal--periode {
    font-size: 24px;
    line-height: 1.2;
}

/* Lille enhed under tallet - fx "dage" */
.detalje-boks-enhed {
    font-family: var(--font-body);
    font-size: var(--text-meta);
    font-weight: 500;
    color: var(--color-secondary);
}

/* Chips wrapper - viser chips på samme linje */
.detalje-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

/* Hver chip - lille afrundet tag */
.detalje-chip {
    font-family: var(--font-body);
    font-size: var(--text-meta);
    font-weight: 500;
    color: var(--color-neutral);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    padding: 4px 10px;
}

/* Ejer sektion - hvid boks med avatar */
.detalje-ejer {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
    margin-top: 4px;
}

/* Ejer avatar - grøn cirkel med initialer */
.detalje-ejer-avatar {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
    background: var(--color-primary);
    color: #ffffff;
    font-family: var(--font-body);
    font-size: var(--text-label);
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

/* Ejer navn og dato fylder den resterende plads */
.detalje-ejer-info {
    flex: 1;
    min-width: 0;
}

/* Ejer navn */
.detalje-ejer-navn {
    font-family: var(--font-body);
    font-size: var(--text-label);
    font-weight: 600;
    color: var(--color-neutral);
    margin: 0 0 2px 0;
}

/* Oprettelsesdato */
.detalje-ejer-dato {
    font-family: var(--font-body);
    font-size: var(--text-meta);
    color: var(--color-secondary);
    margin: 0;
    white-space: nowrap;
}

.detalje-status-actions {
    flex: 0 0 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2);
}

.status-option {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: #ffffff;
    color: var(--color-neutral);
    cursor: pointer;
    font-family: var(--font-body);
    font-size: var(--text-meta);
    font-weight: 600;
    min-height: 40px;
    padding: 0 var(--space-2);
}

.status-option--active {
    border-color: transparent;
}

.status-option--tilgaengelig.status-option--active {
    background: var(--color-tilgaengelig-bg);
    color: var(--color-tilgaengelig-text);
}

.status-option--udlaant.status-option--active {
    background: var(--color-udlaant-bg);
    color: var(--color-udlaant-text);
}

.status-option--inaktiv.status-option--active {
    background: var(--color-inaktiv-bg);
    color: var(--color-inaktiv-text);
}

.rediger-knap {
    flex: 0 0 100%;
    min-height: 42px;
    border: 1px solid var(--color-primary);
    border-radius: var(--radius-md);
    background: var(--color-primary);
    color: #ffffff;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: var(--text-label);
    font-weight: 700;
}

.delete-item-button {
    flex: 0 0 100%;
    min-height: 42px;
    border: 1px solid var(--color-accent);
    border-radius: var(--radius-md);
    background: #ffffff;
    color: var(--color-accent);
    cursor: pointer;
    font-family: var(--font-body);
    font-size: var(--text-label);
    font-weight: 700;
}

/* Statistik sektion - tre bokse side om side */
.detalje-stats {
    display: flex;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
}

/* Hver statistik boks */
.detalje-stat-boks {
    flex: 1;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-4) var(--space-3);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-align: center;
}

/* Stort tal i statistik boksen */
.detalje-stat-tal {
    font-family: var(--font-body);
    font-size: 22px;
    font-weight: 600;
    color: var(--color-neutral);
}

/* Label under tallet */
.detalje-stat-label {
    font-family: var(--font-body);
    font-size: var(--text-meta);
    color: var(--color-secondary);
}

</style>
