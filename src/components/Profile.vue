<script>
import toolsImage from "@/assets/tools.png";

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
    welcomeRequest: {
      type: Number,
      default: 0,
    },
    profileData: {
      type: Object,
      default: null,
    },
  },
  emits: ["go-to-page-one", "go-to-items", "update-profile"],
  data() {
    return {
      toolsImage,
      showLoans: false,
      showProfileDetails: false,
      showCreatedWelcome: false,
      welcomeTimer: null,
      isEditingProfile: false,
      profile: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        postalCode: "",
        city: "",
        password: "",
      },
      profileDraft: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        postalCode: "",
        city: "",
        currentPassword: "",
        newPassword: "",
        repeatNewPassword: "",
      },
      profileMessage: "",
      profileError: "",
    };
  },
  computed: {
    locationText() {
      return [this.profile.postalCode, this.profile.city].filter(Boolean).join(" ");
    },
    profileName() {
      return [this.profile.firstName, this.profile.lastName].filter(Boolean).join(" ") || "Din profil";
    },
  },
  methods: {
    applyProfileData(data) {
      if (!data) return;

      const cityParts = (data.citySearch || "").trim().split(/\s+/);
      const postalCode = cityParts.find(part => /^\d{4}$/.test(part)) || "";
      const city = cityParts.filter(part => part !== postalCode).join(" ");

      this.profile = {
        ...this.profile,
        firstName: data.userType === "business" ? data.contactPerson || "" : data.firstName || "",
        lastName: data.userType === "business" ? data.companyName || "" : data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        postalCode: data.postalCode || postalCode || data.citySearch || "",
        city: data.city || city,
        password: data.password || this.profile.password,
      };
    },
    showTemporaryWelcome() {
      window.clearTimeout(this.welcomeTimer);
      this.showCreatedWelcome = true;
      this.welcomeTimer = window.setTimeout(() => {
        this.showCreatedWelcome = false;
      }, 4000);
    },
    startProfileEdit() {
      window.clearTimeout(this.welcomeTimer);
      this.showCreatedWelcome = false;
      this.profileDraft = {
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        email: this.profile.email,
        phone: this.profile.phone,
        postalCode: this.profile.postalCode,
        city: this.profile.city,
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
      this.showProfileDetails = false;
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
        firstName: this.profileDraft.firstName,
        lastName: this.profileDraft.lastName,
        email: this.profileDraft.email,
        phone: this.profileDraft.phone,
        postalCode: this.profileDraft.postalCode,
        city: this.profileDraft.city,
        password: this.profileDraft.newPassword || this.profile.password,
      };
      this.profileMessage = this.profileDraft.newPassword
        ? "Profil og adgangskode er gemt."
        : "Profilen er gemt.";
      this.profileError = "";
      this.isEditingProfile = false;
      this.$emit("update-profile", { ...this.profile });
    },
    toggleProfileDetails() {
      this.showProfileDetails = !this.showProfileDetails;
    },
  },
  mounted() {
    this.applyProfileData(this.profileData);
    if (this.editRequest > 0) {
      this.startProfileEdit();
    } else if (this.welcomeRequest > 0) {
      this.showTemporaryWelcome();
    }
  },
  beforeUnmount() {
    window.clearTimeout(this.welcomeTimer);
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
    welcomeRequest(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.showTemporaryWelcome();
      }
    },
    profileData: {
      handler(newValue) {
        this.applyProfileData(newValue);
      },
      deep: true,
    },
  },
};
</script>

<template>
  <div class="profile-page">
    <v-container class="profile-container">
      <section v-if="isEditingProfile" class="edit-profile-section" aria-label="Rediger profil">
        <input
          v-model="profileDraft.firstName"
          class="profile-input"
          type="text"
          placeholder="Fornavn"
        />

        <input
          v-model="profileDraft.lastName"
          class="profile-input"
          type="text"
          placeholder="Efternavn"
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

        <input
          v-model="profileDraft.email"
          class="profile-input"
          type="email"
          placeholder="Email"
          autocomplete="email"
        />

        <input
          v-model="profileDraft.phone"
          class="profile-input"
          type="tel"
          placeholder="Telefonnummer"
          autocomplete="tel"
        />

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
        <img
          :src="toolsImage"
          alt="V&aelig;rkt&oslash;j til at oprette genstande"
          class="profile-tools-image"
        />

        <v-btn
          color="primary"
          rounded="lg"
          size="large"
          elevation="0"
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
          elevation="0"
          class="profile-button"
          @click="$emit('go-to-items')"
        >
          Mine genstande
        </v-btn>

        <v-btn
          variant="outlined"
          color="primary"
          rounded="lg"
          size="large"
          elevation="0"
          class="profile-button"
          @click="showLoans = true"
        >
          Mine l&aring;n
        </v-btn>
     </section>

      <section v-if="!isEditingProfile && showProfileDetails" class="profile-detail-section" aria-live="polite">
        <h2>Min profil</h2>
        <p><strong>Navn:</strong> {{ profileName }}</p>
        <p v-if="profile.email"><strong>Email:</strong> {{ profile.email }}</p>
        <p v-if="profile.phone"><strong>Telefon:</strong> {{ profile.phone }}</p>
        <p v-if="locationText"><strong>Adresse:</strong> {{ locationText }}</p>
      </section>

      <section v-if="!isEditingProfile && showLoans" class="loan-section" aria-live="polite">
        <h2>Mine l&aring;n</h2>
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

.edit-profile-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.profile-input {
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

.profile-tools-image {
  display: block;
  width: min(320px, 90%);
  height: auto;
  margin: 0 auto var(--space-3);
}

.profile-button {
  min-height: 52px;
  text-transform: none;
  font-weight: 700;
  box-shadow: none !important;
}

.profile-link-button {
  min-height: 42px;
  background: transparent !important;
}

.profile-detail-section,
.loan-section {
  margin-top: var(--space-6);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.profile-detail-section h2,
.loan-section h2 {
  margin: 0 0 6px;
  font-family: var(--font-display);
  font-size: var(--text-h2);
  color: var(--color-neutral);
}

.profile-detail-section p,
.loan-section p {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--color-secondary);
}

.profile-detail-section p + p {
  margin-top: var(--space-2);
}

@media (max-width: 520px) {
  .profile-input-grid {
    grid-template-columns: 1fr;
  }
}
</style>
