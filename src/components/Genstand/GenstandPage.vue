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
            // Mock-data - falske genstande til at teste kortet med
            items: [
                {
                    id: 1,
                    title: 'Boremaskine',
                    category: 'Elektronik',
                    brand: 'Bosch',
                    status: 'Tilgængelig',
                    image: 'https://placehold.co/64x64',
                    condition: 'Ny',
                    maxDays: 7,
                    accessories: 'Extra batteri, bits sæt, oplader',
                    totalLoans: 12,
                    activeLoans: 1,
                    rating: 4.9
                },
                {
                    id: 2,
                    title: 'Cykel',
                    category: 'Sport',
                    brand: null,
                    status: 'Udlånt',
                    image: 'https://placehold.co/64x64',
                    condition: 'Brugt',
                    maxDays: 3,
                    accessories: null,
                    totalLoans: 5,
                    activeLoans: 1,
                    rating: 4.2
                },
                {
                    id: 3,
                    title: 'Hammer',
                    category: 'Værktøj',
                    brand: 'Stanley',
                    status: 'Inaktiv',
                    image: 'https://placehold.co/64x64',
                    condition: 'Slidt',
                    maxDays: 1,
                    accessories: null,
                    totalLoans: 8,
                    activeLoans: 0,
                    rating: 3.8
                }
            ]
        }
    },
    props: {
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
        }
    },
    watch: {
    },
    emits: []
}
</script>

<template>
    <main class="page">

        <!-- Vis detaljesiden når en genstand er valgt -->
        <GenstandDetail
            v-if="selectedItem"
            :title="selectedItem.title"
            :category="selectedItem.category"
            :brand="selectedItem.brand"
            :status="selectedItem.status"
            :image="selectedItem.image"
            :condition="selectedItem.condition"
            :maxDays="selectedItem.maxDays"
            :accessories="selectedItem.accessories"
            :totalLoans="selectedItem.totalLoans"
            :activeLoans="selectedItem.activeLoans"
            :rating="selectedItem.rating"
            @gåTilbage="selectedItem = null"
        />

        <!-- Liste visning - skjules når en genstand er valgt -->
        <div v-else>

            <!-- Sidetitel -->
            <h1 class="page-title">Dine genstande</h1>

            <!-- Filter tabs - activeFilter opdateres når brugeren klikker -->
            <GenstandFilter
                :activeFilter="activeFilter"
                @filterChanged="activeFilter = $event"
            />

            <!-- Liste af filtrerede kort -->
            <div class="card-list">
                <!-- Loop gennem filtrerede genstande og vis et kort for hver -->
                <GenstandCard
                    v-for="item in filteredItems"
                    :key="item.id"
                    :id="item.id"
                    :title="item.title"
                    :category="item.category"
                    :brand="item.brand"
                    :status="item.status"
                    :image="item.image"
                    @cardClicked="visDetaljer"
                />
            </div>

            <!-- Vises når ingen genstande matcher det valgte filter -->
            <p
                v-if="filteredItems.length === 0"
                class="ingen-resultater"
                role="status"
                aria-live="polite"
            >
                Ingen genstande matcher det valgte filter
            </p>

        </div>

        <div class="opret-knap-wrapper">
            <v-btn
                color="primary"
                rounded="lg"
                class="opret-knap"
                @click="$emit('go-to-page-one')"
            >
                Opret ny genstand
            </v-btn>
        </div>

    </main>
</template>

<style scoped>

/* Sidebaggrund - varm off-white som fylder hele skærmen */
.page {
    background: var(--color-bg);
    min-height: 100vh;
    padding: var(--space-6) var(--space-4);
}

/* Sidetitel */
.page-title {
    font-family: var(--font-display);
    font-size: var(--text-h1);
    font-weight: 600;
    color: var(--color-neutral);
    margin-bottom: var(--space-4);
    text-align: center;
}

/* Kort stablet lodret med mellemrum imellem */
.card-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}

/* Besked når ingen genstande matcher filteret */
.ingen-resultater {
    font-family: var(--font-body);
    font-size: var(--text-label);
    color: var(--color-secondary);
    text-align: center;
    margin-top: var(--space-8);
}
.opret-knap-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: white;
  border-top: 1px solid var(--color-border);
}

.opret-knap {
  width: 100%;
  height: 48px !important;
  text-transform: none;
}

.page {
  background: var(--color-bg);
  min-height: 100vh;
  padding: var(--space-6) var(--space-4);
  padding-bottom: 90px;
}
</style>