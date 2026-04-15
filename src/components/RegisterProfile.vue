<script>
export default {
  name: "RegisterProfile",
  emits: ["show-login", "profile-created"],
  data() {
    return {
      email: "",
      phone: "",
      password: "",
      repeatPassword: "",
      acceptedTerms: false,
    };
  },
};
</script>

<template>
  <div class="register-page">
    <v-container class="register-container">
      <header class="register-header">
        <p class="step-label">STEP 1 AF 5</p>
        <h1>Opret bruger</h1>
        <p class="login-text">
          Allerede medlem?
          <button type="button" class="text-button" @click="$emit('show-login')">
            Log ind
          </button>
        </p>
      </header>

      <form class="register-form" @submit.prevent="$emit('profile-created')">
        <input
          v-model="email"
          class="register-input"
          type="email"
          placeholder="Din email adresse"
          autocomplete="email"
        />

        <div class="phone-field">
          <div class="country-code" aria-label="Landekode Danmark">
            <span class="flag" aria-hidden="true">
              <span class="flag-cross flag-cross--vertical"></span>
              <span class="flag-cross flag-cross--horizontal"></span>
            </span>
            <span>+45</span>
          </div>

          <input
            v-model="phone"
            class="phone-input"
            type="tel"
            placeholder="Dit telefonnummer"
            autocomplete="tel"
          />
        </div>

        <input
          v-model="password"
          class="register-input"
          type="password"
          placeholder="Dit password"
          autocomplete="new-password"
        />

        <input
          v-model="repeatPassword"
          class="register-input"
          type="password"
          placeholder="Gentag password"
          autocomplete="new-password"
        />

        <label class="terms-row">
          <input v-model="acceptedTerms" type="checkbox" />
          <span>
            Ved at checke denne boks accepterer du vores
            <button type="button" class="text-button">Brugsvilkår</button>
            og
            <button type="button" class="text-button">Privatlivspolitik</button>
          </span>
        </label>

        <button class="continue-button" type="submit">
          Forsæt
        </button>
      </form>
    </v-container>
  </div>
</template>

<style scoped>
.register-page {
  background: var(--color-bg);
  min-height: 100vh;
  padding: var(--space-4) 0 var(--space-8);
}

.register-container {
  max-width: 620px;
}

.register-header {
  text-align: center;
  margin-bottom: var(--space-4);
}

.step-label {
  margin: 0 0 var(--space-2);
  color: var(--color-accent);
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 800;
}

h1 {
  margin: 0 0 var(--space-2);
  color: var(--color-neutral);
  font-family: var(--font-display);
  font-size: var(--text-h1);
  font-weight: 700;
}

.login-text {
  margin: 0;
  color: var(--color-secondary);
  font-family: var(--font-body);
  font-size: var(--text-label);
}

.text-button {
  border: none;
  background: transparent;
  color: var(--color-accent);
  font: inherit;
  cursor: pointer;
  padding: 0;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.register-input,
.phone-field {
  width: 100%;
  min-height: 44px;
  border: none;
  border-radius: var(--radius-full);
  background: var(--color-surface);
  color: var(--color-neutral);
  font-family: var(--font-body);
  font-size: var(--text-label);
}

.register-input {
  padding: 0 var(--space-4);
  outline: none;
}

.phone-field {
  display: flex;
  overflow: hidden;
}

.country-code {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 136px;
  padding: 0 var(--space-4);
  border-right: 1px solid var(--color-input-border);
  color: var(--color-neutral);
  font-family: var(--font-body);
  font-size: var(--text-label);
}

.flag {
  position: relative;
  width: 26px;
  height: 18px;
  background: var(--color-accent);
  flex-shrink: 0;
}

.flag-cross {
  position: absolute;
  background: var(--color-surface);
}

.flag-cross--vertical {
  top: 0;
  bottom: 0;
  left: 9px;
  width: 4px;
}

.flag-cross--horizontal {
  left: 0;
  right: 0;
  top: 7px;
  height: 4px;
}

.phone-input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--color-neutral);
  font-family: var(--font-body);
  font-size: var(--text-label);
  outline: none;
  padding: 0 var(--space-4);
}

.terms-row {
  display: grid;
  grid-template-columns: 32px 1fr;
  align-items: start;
  gap: var(--space-3);
  color: var(--color-neutral);
  font-family: var(--font-body);
  font-size: var(--text-label);
  line-height: 1.2;
  margin-top: var(--space-1);
}

.terms-row input {
  width: 28px;
  height: 28px;
  accent-color: var(--color-primary);
}

.continue-button {
  align-self: center;
  min-width: 108px;
  min-height: 38px;
  margin-top: var(--space-3);
  border: none;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: var(--color-surface);
  font-family: var(--font-body);
  font-size: var(--text-label);
  font-weight: 800;
  cursor: pointer;
}
</style>
