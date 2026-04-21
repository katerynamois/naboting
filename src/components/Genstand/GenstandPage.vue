<script>
import GenstandCard from './GenstandCard.vue'
import GenstandDetail from './GenstandDetail.vue'
import GenstandFilter from './GenstandFilter.vue'

export default {
    name: 'GenstandPage',
    components: {
        GenstandCard,
        GenstandDetail,
        GenstandFilter
    },
    data() {
        return {
            // Holder styr på hvilken genstand der er valgt
            selectedItem: null,
            // Holder styr på det aktive filter - Alle betyder alle vises som standard
            activeFilter: 'Alle',
        }
    },
    props: {
        items: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        // Filtrerer genstande baseret på aktivt filter
        // Hvis Alle er valgt vises alle genstande
        filteredItems() {
            if (this.activeFilter === 'Alle') return this.items
            return this.items.filter(item =>
                item.status === this.activeFilter
            )
        }
    },
    methods: {
        // Kaldes når et kort klikkes - finder den valgte genstand ud fra id
        visDetaljer(id) {
            this.selectedItem = this.items.find(item => item.id === id)
        },
        updateItemStatus(payload) {
            if (this.selectedItem && this.selectedItem.id === payload.id) {
                this.selectedItem = {
                    ...this.selectedItem,
                    status: payload.status
                }
            }
            this.$emit('update-status', payload)
        },
        deleteItem(id) {
            this.selectedItem = null
            this.$emit('delete-item', id)
        },
        editItem(payload) {
            this.$emit('edit-item', payload)
        },
    },
    watch: {
        // Reset selected item when items prop changes (e.g. after an edit)
        items() {
            if (this.selectedItem) {
                this.selectedItem = this.items.find(i => i.id === this.selectedItem.id) || null
            }
        }
    },
    emits: ['go-to-page-one', 'update-status', 'delete-item', 'edit-item']
}
</script>

<template>
    <main class="page">

        <!-- Vis detaljesiden når en genstand er valgt -->
        <GenstandDetail
            v-if="selectedItem"
            :id="selectedItem.id"
            :title="selectedItem.title"
            :category="selectedItem.category"
            :brand="selectedItem.brand"
            :status="selectedItem.status"
            :image="selectedItem.images[0]"
            :condition="selectedItem.condition"
            :minimumLoanPeriod="selectedItem.minimumLoanPeriod"
            :quantity="selectedItem.quantity"
            :accessories="selectedItem.accessories"
            :totalLoans="selectedItem.totalLoans"
            :activeLoans="selectedItem.activeLoans"
            :createdAt="selectedItem.createdAt"
            :user="null"
            @gåTilbage="selectedItem = null"
            @update-status="updateItemStatus"
            @delete-item="deleteItem"
            @edit-item="editItem"
        />

        <!-- Liste visning - skjules når en genstand er valgt -->
        <div v-else>

            <!-- Sidetitel -->
            <h1 class="items-title">Mine genstande</h1>

            <!-- Filter tabs - activeFilter opdateres når brugeren klikker -->
            <GenstandFilter
                :activeFilter="activeFilter"
                @filterChanged="activeFilter = $event"
            />

            <!-- Liste af filtrerede kort -->
            <div class="items-list">
                <!-- Loop gennem filtrerede genstande og vis et kort for hver -->
                <GenstandCard
                    v-for="item in filteredItems"
                    :key="item.id"
                    :id="item.id"
                    :title="item.title"
                    :category="item.category"
                    :brand="item.brand"
                    :status="item.status"
                    :image="item.images[0]"
                    @cardClicked="visDetaljer"
                />
            </div>

            <!-- Vises når ingen genstande matcher det valgte filter -->
            <p
                v-if="filteredItems.length === 0"
                class="no-results"
                role="status"
                aria-live="polite"
            >
                Ingen genstande matcher det valgte filter
            </p>

            <div class="create-btn-wrapper">
                <v-btn
                    color="primary"
                    rounded="lg"
                    class="create-btn"
                    @click="$emit('go-to-page-one')"
                >
                    Opret ny genstand
                </v-btn>
            </div>

        </div>

    </main>
</template>

<style scoped>

/* Sidetitel */
.items-title {
    font-family: var(--font-display);
    font-size: var(--text-h1);
    font-weight: 600;
    color: var(--color-neutral);
    margin-bottom: var(--space-4);
    text-align: center;
}

.items-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}

.no-results {
    font-family: var(--font-body);
    font-size: var(--text-label);
    color: var(--color-secondary);
    text-align: center;
    margin-top: var(--space-8);
}

.create-btn-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: white;
  border-top: 1px solid var(--color-border);
}

.create-btn {
  width: 100%;
  height: 48px !important;
  text-transform: none;
}

.page {
  background: var(--color-bg);
  min-height: 100vh;
  padding: var(--space-4) var(--space-4);
  padding-bottom: 90px;
}
</style>
