<script>
export default {
  name: "Profile",
  emits: ["go-to-page-one", "go-to-items"],
  data() {
    return {
      showLoans: false,
    };
  },
};
</script>

<template>
  <div class="profile-page">
    <v-container class="profile-container">
      <section class="profile-header">
        <div class="avatar" aria-hidden="true">DG</div>
        <div>
          <p class="eyebrow">Min profil</p>
          <h1>Velkommen tilbage</h1>
          <p class="profile-text">
            Her kan du oprette genstande, se dine ting og følge dine lån.
          </p>
        </div>
      </section>

      <section class="profile-actions" aria-label="Profil handlinger">
        <v-btn
          color="primary"
          rounded="lg"
          size="large"
          class="profile-button"
          @click="$emit('go-to-page-one')"
        >
          Opret genstand
        </v-btn>

        <v-btn
          variant="tonal"
          color="primary"
          rounded="lg"
          size="large"
          class="profile-button"
          @click="$emit('go-to-items')"
        >
          Dine genstande
        </v-btn>

        <v-btn
          variant="outlined"
          color="primary"
          rounded="lg"
          size="large"
          class="profile-button"
          @click="showLoans = true"
        >
          Dine lån
        </v-btn>
      </section>

      <section v-if="showLoans" class="loan-section" aria-live="polite">
        <h2>Dine lån</h2>
        <p>Du har ingen aktive lån endnu.</p>
      </section>
    </v-container>
  </div>
</template>

<style scoped>
.profile-page {
  background: var(--color-bg);
  min-height: 100vh;
  padding: var(--space-6) var(--space-4);
}

.profile-container {
  max-width: 620px;
}

.profile-header {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  margin-bottom: var(--space-8);
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 700;
  flex-shrink: 0;
}

.eyebrow {
  margin: 0 0 4px;
  color: var(--color-secondary);
  font-family: var(--font-body);
  font-size: var(--text-meta);
  font-weight: 700;
  text-transform: uppercase;
}

h1 {
  margin: 0 0 6px;
  color: var(--color-neutral);
  font-family: var(--font-display);
  font-size: var(--text-h1);
}

.profile-text {
  margin: 0;
  color: var(--color-secondary);
  font-family: var(--font-body);
  font-size: var(--text-body);
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.profile-button {
  min-height: 52px;
  text-transform: none;
  font-weight: 700;
}

.loan-section {
  margin-top: var(--space-6);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.loan-section h2 {
  margin: 0 0 6px;
  font-family: var(--font-display);
  font-size: var(--text-h2);
  color: var(--color-neutral);
}

.loan-section p {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--color-secondary);
}
</style>
