<script>
export default {
    name: 'RedigerGenstand',
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isActive: this.item.status !== 'Inaktiv',
            isUdlånt: this.item.status === 'Udlånt',
        }
    },
    computed: {
        computedStatus() {
            if (this.isUdlånt) return 'Udlånt'
            return this.isActive ? 'Tilgængelig' : 'Inaktiv'
        },
        accessoriesList() {
            return this.item.accessories || []
        }
    },
    methods: {
        save() {
            this.$emit('save-item', { ...this.item, status: this.computedStatus })
        }
    },
    emits: ['save-item', 'go-back']
}
</script>

<template>
    <div class="rediger-side">

        <!-- Topbar -->
        <header class="rediger-header">
            <button class="tilbage-knap" @click="$emit('go-back')">
                ← Tilbage
            </button>
            <span class="rediger-titel">Rediger genstand</span>
            <div style="width: 80px"></div>
        </header>

        <!-- Billede -->
        <figure class="billede-wrapper">
            <img
                :src="item.images && item.images[0]"
                :alt="`Billede af ${item.title}`"
                class="billede"
            />
        </figure>

        <!-- Navn og meta -->
        <section class="info-sektion">
            <h1 class="item-titel">{{ item.title }}</h1>
            <p class="item-meta">
                {{ item.category }}
                <span v-if="item.brand"> · {{ item.brand }}</span>
                <span v-if="item.condition"> · {{ item.condition }}</span>
            </p>
        </section>

        <!-- Detaljer -->
        <section class="detaljer-sektion">
            <div class="detalje-rad" v-if="item.minimumLoanPeriod">
                <span class="detalje-label">Min. låneperiode</span>
                <span class="detalje-vaerdi">{{ item.minimumLoanPeriod }} dage</span>
            </div>
            <div class="detalje-rad" v-if="item.accessories">
                <span class="detalje-label">Tilbehør</span>
                <div class="chips">
                    <span class="chip" v-for="a in accessoriesList" :key="a">{{ a }}</span>
                </div>
            </div>
        </section>

        <!-- Status toggles -->
        <section class="toggle-sektion">
            <h2 class="toggle-overskrift">Status</h2>

            <!-- Aktiv/Inaktiv toggle -->
            <div class="toggle-rad" :class="{ disabled: isUdlånt }">
                <div class="toggle-tekst">
                    <span class="toggle-navn">Aktiv</span>
                    <span class="toggle-beskrivelse">
                        Genstanden er synlig og kan lånes
                    </span>
                </div>
                <label class="switch" :class="{ 'switch--off': isUdlånt }">
                    <input
                        type="checkbox"
                        v-model="isActive"
                        :disabled="isUdlånt"
                    />
                    <span class="slider"></span>
                </label>
            </div>

            <div class="divider"></div>

            <!-- Udlånt toggle -->
            <div class="toggle-rad">
                <div class="toggle-tekst">
                    <span class="toggle-navn">Udlånt</span>
                    <span class="toggle-beskrivelse">
                        Marker genstanden som i øjeblikket udlånt
                    </span>
                </div>
                <label class="switch">
                    <input type="checkbox" v-model="isUdlånt" />
                    <span class="slider"></span>
                </label>
            </div>

            <!-- Status preview -->
            <div class="status-preview">
                <span class="status-label">Aktuel status:</span>
                <span
                    class="status-badge"
                    :class="{
                        'badge-tilgaengelig': computedStatus === 'Tilgængelig',
                        'badge-udlaant': computedStatus === 'Udlånt',
                        'badge-inaktiv': computedStatus === 'Inaktiv',
                    }"
                >
                    {{ computedStatus }}
                </span>
            </div>
        </section>

        <!-- Bottom bar -->
        <div class="bottom-bar">
            <button class="back-button" @click="$emit('go-back')">
                Tilbage
            </button>
            <button class="save-button" @click="save">
                Gem ændringer
            </button>
        </div>

    </div>
</template>

<style scoped>
.rediger-side {
    background: var(--color-bg);
    min-height: 100vh;
    padding: var(--space-4);
    padding-bottom: 90px;
    box-sizing: border-box;
}

.rediger-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
}

.tilbage-knap {
    background: transparent;
    color: var(--color-neutral);
    border: none;
    font-family: var(--font-body);
    font-size: var(--text-body);
    font-weight: 500;
    cursor: pointer;
    padding: var(--space-3) 0;
    min-height: 44px;
}

.rediger-titel {
    font-family: var(--font-display);
    font-size: var(--text-label);
    font-weight: 600;
    color: var(--color-neutral);
}

.billede-wrapper {
    margin: 0 0 20px 0;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--color-image-bg);
}

.billede {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
}

.info-sektion {
    margin-bottom: var(--space-4);
}

.item-titel {
    font-family: var(--font-display);
    font-size: var(--text-h1);
    font-weight: 600;
    color: var(--color-neutral);
    margin: 0 0 4px 0;
}

.item-meta {
    font-family: var(--font-body);
    font-size: var(--text-label);
    color: var(--color-secondary);
    margin: 0;
}

/* Detaljer */
.detaljer-sektion {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    margin-bottom: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}

.detalje-rad {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-3);
}

.detalje-label {
    font-family: var(--font-body);
    font-size: var(--text-meta);
    color: var(--color-secondary);
    font-weight: 500;
    flex-shrink: 0;
}

.detalje-vaerdi {
    font-family: var(--font-body);
    font-size: var(--text-label);
    color: var(--color-neutral);
    font-weight: 500;
    text-align: right;
}

.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: flex-end;
}

.chip {
    font-family: var(--font-body);
    font-size: var(--text-meta);
    color: var(--color-neutral);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    padding: 3px 8px;
}

/* Toggles */
.toggle-sektion {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    margin-bottom: var(--space-4);
}

.toggle-overskrift {
    font-family: var(--font-body);
    font-size: var(--text-label);
    font-weight: 600;
    color: var(--color-neutral);
    margin: 0 0 var(--space-4) 0;
}

.toggle-rad {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-2) 0;
}

.toggle-rad.disabled {
    opacity: 0.4;
}

.toggle-tekst {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.toggle-navn {
    font-family: var(--font-body);
    font-size: var(--text-body);
    font-weight: 500;
    color: var(--color-neutral);
}

.toggle-beskrivelse {
    font-family: var(--font-body);
    font-size: var(--text-meta);
    color: var(--color-secondary);
}

.divider {
    height: 1px;
    background: var(--color-border);
    margin: var(--space-3) 0;
}

/* Custom toggle switch */
.switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 28px;
    flex-shrink: 0;
    cursor: pointer;
}

.switch--off {
    cursor: not-allowed;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    inset: 0;
    background: #d1d5db;
    border-radius: 28px;
    transition: background 0.2s;
}

.slider::before {
    content: '';
    position: absolute;
    width: 22px;
    height: 22px;
    left: 3px;
    top: 3px;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

input:checked + .slider {
    background: var(--color-primary);
}

input:checked + .slider::before {
    transform: translateX(20px);
}

/* Status preview */
.status-preview {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-top: var(--space-4);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border);
}

.status-label {
    font-family: var(--font-body);
    font-size: var(--text-meta);
    color: var(--color-secondary);
    font-weight: 500;
}

.status-badge {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: var(--radius-full);
}

.badge-tilgaengelig {
    background: var(--color-tilgaengelig-bg);
    color: var(--color-tilgaengelig-text);
}

.badge-udlaant {
    background: var(--color-udlaant-bg);
    color: var(--color-udlaant-text);
}

.badge-inaktiv {
    background: var(--color-inaktiv-bg);
    color: var(--color-inaktiv-text);
}

/* Bottom bar */
.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #e5e7eb;
    padding: 16px;
    display: flex;
    gap: 12px;
}

.back-button {
    flex: 1;
    height: 48px;
    border: 2px solid #d1d5db;
    border-radius: var(--radius-md);
    background: transparent;
    font-family: var(--font-body);
    font-size: var(--text-body);
    font-weight: 500;
    color: var(--color-neutral);
    cursor: pointer;
}

.save-button {
    flex: 3;
    height: 48px;
    border: none;
    border-radius: var(--radius-md);
    background: var(--color-primary);
    font-family: var(--font-body);
    font-size: var(--text-body);
    font-weight: 600;
    color: white;
    cursor: pointer;
}
</style>
