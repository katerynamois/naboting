<script>
export default {
  name: "Profile",
  props: {
    editRequest: {
      type: Number,
      default: 0,
    },
    viewRequest: {
      type: Number,
      default: 0,
    },
  },
  emits: ["go-to-page-one", "go-to-items"],
  data() {
    return {
      showLoans: false,
      isEditingProfile: false,
      profile: {
        name: "Din profil",
        postalCode: "",
        city: "",
        bio: "Her kan du oprette genstande, se dine ting og f\u00f8lge dine l\u00e5n.",
        password: "",
      },
      profileDraft: {
        name: "",
        postalCode: "",
        city: "",
        bio: "",
        currentPassword: "",
        newPassword: "",
        repeatNewPassword: "",
      },
      profileMessage: "",
      profileError: "",
    };
  },
  computed: {
    profileInitials() {
      return this.profile.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "DP";
    },
    locationText() {
      return [this.profile.postalCode, this.profile.city].filter(Boolean).join(" ");
    },
  },
  methods: {
    startProfileEdit() {
      this.profileDraft = {
        name: this.profile.name,
        postalCode: this.profile.postalCode,
        city: this.profile.city,
        bio: this.profile.bio,
        currentPassword: "",
        newPassword: "",
        repeatNewPassword: "",
      };
      this.profileMessage = "";
      this.profileError = "";
      this.isEditingProfile = true;
    },
    cancelProfileEdit() {
      this.isEditingProfile = false;
      this.profileError = "";
    },
    showProfileView() {
      this.isEditingProfile = false;
      this.profileError = "";
      this.profileMessage = "";
    },
    saveProfileEdit() {
      if (this.profileDraft.newPassword || this.profileDraft.repeatNewPassword) {
        if (this.profileDraft.newPassword !== this.profileDraft.repeatNewPassword) {
          this.profileError = "De nye adgangskoder matcher ikke.";
          return;
        }

        if (this.profileDraft.newPassword.length < 6) {
          this.profileError = "Den nye adgangskode skal vaere mindst 6 tegn.";
          return;
        }
      }

      this.profile = {
        ...this.profile,
        name: this.profileDraft.name,
        postalCode: this.profileDraft.postalCode,
        city: this.profileDraft.city,
        bio: this.profileDraft.bio,
        password: this.profileDraft.newPassword || this.profile.password,
      };
      this.profileMessage = this.profileDraft.newPassword
        ? "Profil og adgangskode er gemt."
        : "Profilen er gemt.";
      this.profileError = "";
      this.isEditingProfile = false;
    },
  },
  mounted() {
    if (this.editRequest > 0) {
      this.startProfileEdit();
    }
  },
  watch: {
    editRequest(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.startProfileEdit();
      }
    },
    viewRequest(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.showProfileView();
      }
    },
  },
};
</script>

<template>
  <div class="profile-page">
    <v-container class="profile-container">
      <section class="profile-header">
        <div class="avatar" aria-hidden="true">{{ profileInitials }}</div>
        <div>
          <p class="eyebrow">Din profil</p>
          <h1>{{ profile.name }}</h1>
          <p v-if="locationText" class="profile-location">{{ locationText }}</p>
          <p class="profile-text">{{ profile.bio }}</p>
        </div>
      </section>

      <section v-if="isEditingProfile" class="edit-profile-section" aria-label="Rediger profil">
        <input
          v-model="profileDraft.name"
          class="profile-input"
          type="text"
          placeholder="Navn"
        />

        <div class="profile-input-grid">
          <input
            v-model="profileDraft.postalCode"
            class="profile-input"
            type="text"
            inputmode="numeric"
            placeholder="Postnummer"
          />

          <input
            v-model="profileDraft.city"
            class="profile-input"
            type="text"
            placeholder="By"
          />
        </div>

        <textarea
          v-model="profileDraft.bio"
          class="profile-textarea"
          rows="4"
          placeholder="Kort om dig"
        ></textarea>

        <div class="password-edit-group">
          <p class="edit-section-title">Skift adgangskode</p>

          <input
            v-model="profileDraft.currentPassword"
            class="profile-input"
            type="password"
            placeholder="Nuv&aelig;rende adgangskode"
            autocomplete="current-password"
          />

          <input
            v-model="profileDraft.newPassword"
            class="profile-input"
            type="password"
            placeholder="Ny adgangskode"
            autocomplete="new-password"
          />

          <input
            v-model="profileDraft.repeatNewPassword"
            class="profile-input"
            type="password"
            placeholder="Gentag ny adgangskode"
            autocomplete="new-password"
          />
        </div>

        <p v-if="profileError" class="profile-error">{{ profileError }}</p>

        <div class="edit-profile-actions">
          <button class="secondary-profile-button" type="button" @click="cancelProfileEdit">
            Annuller
          </button>

          <button class="primary-profile-button" type="button" @click="saveProfileEdit">
            Gem
          </button>
        </div>
      </section>

      <p v-if="profileMessage" class="profile-message">{{ profileMessage }}</p>

      <section v-if="!isEditingProfile" class="profile-actions" aria-label="Profil handlinger">
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
          Dine l&aring;n
        </v-btn>
      </section>

      <section v-if="showLoans" class="loan-section" aria-live="polite">
        <h2>Dine l&aring;n</h2>
        <p>Du har ingen aktive l&aring;n endnu.</p>
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

.profile-location {
  margin: 0 0 6px;
  color: var(--color-accent);
  font-family: var(--font-body);
  font-size: var(--text-label);
  font-weight: 700;
}

.profile-text {
  margin: 0;
  color: var(--color-secondary);
  font-family: var(--font-body);
  font-size: var(--text-body);
}

.edit-profile-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.profile-input,
.profile-textarea {
  width: 100%;
  border: none;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-neutral);
  font-family: var(--font-body);
  font-size: var(--text-body);
  outline: none;
  padding: 0 var(--space-4);
}

.profile-input {
  min-height: 46px;
}

.profile-textarea {
  min-height: 112px;
  padding-top: var(--space-3);
  resize: vertical;
}

.profile-input-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: var(--space-3);
}

.password-edit-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.edit-section-title {
  margin: 0;
  color: var(--color-neutral);
  font-family: var(--font-body);
  font-size: var(--text-label);
  font-weight: 800;
}

.profile-error,
.profile-message {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--text-label);
  font-weight: 700;
}

.profile-error {
  color: var(--color-accent);
}

.profile-message {
  margin-bottom: var(--space-4);
  color: var(--color-primary);
}

.edit-profile-actions {
  display: flex;
  gap: var(--space-3);
}

.primary-profile-button,
.secondary-profile-button {
  flex: 1;
  min-height: 42px;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-label);
  font-weight: 800;
  cursor: pointer;
}

.primary-profile-button {
  background: var(--color-primary);
  color: var(--color-surface);
}

.secondary-profile-button {
  background: var(--color-surface);
  color: var(--color-neutral);
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

@media (max-width: 520px) {
  .profile-input-grid {
    grid-template-columns: 1fr;
  }
}
</style>
