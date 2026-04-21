<script>
import Home from "@/components/Home.vue";
import AddDetails from "@/components/AddDetails.vue";
import PageOne from "@/components/PageOne.vue";
import ConfirmItemScreen from "./components/ConfirmItemScreen.vue";
import GenstandPage from "./components/Genstand/GenstandPage.vue";
import Profile from "@/components/Profile.vue";
import LoginModal from "@/components/LoginModal.vue";
import RegisterProfile from "@/components/RegisterProfile.vue";

const API_BASE_URL = "http://localhost:3001/api";

const STATUS_LABELS = {
  available: "Tilg\u00e6ngelig",
  loaned: "Udl\u00e5nt",
  inactive: "Inaktiv",
};

function toUiStatus(status) {
  return STATUS_LABELS[status] || status;
}

function toApiStatus(status) {
  if (status === STATUS_LABELS.available || status === "available") return "available";
  if (status === STATUS_LABELS.loaned || status === "loaned") return "loaned";
  if (status === STATUS_LABELS.inactive || status === "inactive") return "inactive";
  return status;
}

function mapApiItem(item) {
  return {
    id: item.item_id,
    userId: item.owner_id,
    title: item.title,
    category: item.category,
    brand: item.brand,
    status: toUiStatus(item.status),
    images: [item.image_url || "https://placehold.co/64x64"],
    condition: item.item_condition,
    quantity: item.quantity,
    minimumLoanPeriod: item.minimum_loan_period,
    accessories: item.accessories || [],
    totalLoans: 0,
    activeLoans: 0,
    createdAt: item.created_at,
  };
}

function toApiItem(item) {
  return {
    owner_id: item.userId,
    title: item.title,
    brand: item.brand || null,
    category: item.category || null,
    item_condition: item.condition || null,
    quantity: item.quantity || 1,
    minimum_loan_period: item.minimumLoanPeriod || null,
    status: toApiStatus(item.status),
    images: item.images || [],
    accessories: item.accessories || [],
  };
}

export default {
  components: {
    Home,
    AddDetails,
    PageOne,
    ConfirmItemScreen,
    GenstandPage,
    Profile,
    LoginModal,
    RegisterProfile,
  },
  data() {
    return {
      currentPage: "home",
      currentStep: 1,
      pageOneData: null,
      addDetailsData: null,
      createFlowReturnPage: "profile",
      items: [],
      drawer: false,
      showLogin: false,
      profileCreated: false,
      profileEditRequest: 0,
      profileViewRequest: 0,
      profileWelcomeRequest: 0,
      profileData: null,
      currentUserId: null,
    };
  },
  mounted() {
    this.loadItems();
  },
  computed: {
    showNabotingBar() {
      return [
        "home",
        "profile",
        "pageOne",
        "addDetails",
        "confirmItem",
        "genstandPage",
      ].includes(this.currentPage);
    },
  },
  methods: {
    goHome() {
      this.currentPage = this.profileCreated ? "profile" : "home";
    },
    goToItems() {
      this.currentPage = "genstandPage";
      this.drawer = false;
    },
    goToProfile(profileData = null) {
      this.profileCreated = true;
      if (profileData) {
        if (!this.currentUserId) {
          this.currentUserId = Date.now();
        }
        this.profileData = { ...profileData, userId: this.currentUserId };
      }
      this.profileEditRequest = 0;
      this.profileViewRequest += 1;
      this.profileWelcomeRequest += 1;
      this.currentPage = "profile";
      this.showLogin = false;
      this.drawer = false;
    },
    goToProfileEdit() {
      this.profileCreated = true;
      this.currentPage = "profile";
      this.profileEditRequest += 1;
      this.showLogin = false;
      this.drawer = false;
    },
    goToRegisterProfile() {
      this.currentPage = "registerProfile";
      this.showLogin = false;
      this.drawer = false;
    },
    openLogin() {
      this.showLogin = true;
      this.drawer = false;
    },
    closeLogin() {
      this.showLogin = false;
    },
    handleLogin() {
      this.profileCreated = true;
      this.profileEditRequest = 0;
      this.profileViewRequest += 1;
      this.showLogin = false;
      this.currentPage = "profile";
    },
    logout() {
      this.profileCreated = false;
      this.profileEditRequest = 0;
      this.profileViewRequest = 0;
      this.profileWelcomeRequest = 0;
      this.profileData = null;
      this.currentPage = "home";
      this.showLogin = false;
      this.drawer = false;
    },
    goBackFromConfirm() {
      this.currentPage = "addDetails";
      this.currentStep = 2;
      this.drawer = false;
    },
    goToPageOne() {
      if (this.currentPage !== "addDetails") {
        this.createFlowReturnPage = this.currentPage;
      }
      this.drawer = false;
      this.currentPage = "pageOne";
      this.currentStep = 1;
      this.pageOneData = null;
      this.addDetailsData = null;
    },
    goBackFromPageOne() {
      this.currentPage = this.createFlowReturnPage || (this.profileCreated ? "profile" : "home");
      this.drawer = false;
    },
    goToAddDetails(data) {
      this.pageOneData = data;
      this.currentPage = "addDetails";
      this.currentStep = 2;
    },
    handleSaveDetails(details) {
      this.addDetailsData = details;
    },
    goToConfirmItem() {
      this.currentPage = "confirmItem";
      this.currentStep = 3;
    },
    getOwnerId() {
      const existingOwner = this.items.find((item) => item.userId)?.userId;
      return existingOwner || this.currentUserId || 1;
    },
    async handleUpdateStatus({ id, status }) {
      const index = this.items.findIndex(i => i.id === id);
      if (index !== -1) {
        const previousStatus = this.items[index].status;
        this.items[index].status = status;

        try {
          const response = await fetch(`${API_BASE_URL}/items/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(toApiItem(this.items[index])),
          });

          if (!response.ok) {
            throw new Error("Could not update item status");
          }

          await this.loadItems();
        } catch (error) {
          this.items[index].status = previousStatus;
          console.error(error);
        }
      }
    },
    async handleDeleteItem(id) {
      try {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Could not delete item");
        }

        this.items = this.items.filter((item) => item.id !== id);
        await this.loadItems();
      } catch (error) {
        console.error(error);
      }
    },
    handleUpdateProfile(profileData) {
      this.profileData = profileData;
    },
    async goToGenstandPage() {
      if (this.pageOneData && this.addDetailsData) {
        const d1 = this.pageOneData;
        const d2 = this.addDetailsData;
        const newItem = {
          userId: this.getOwnerId(),
          title: d1.name,
          category: d1.category,
          brand: d1.brand || null,
          status: STATUS_LABELS.available,
          images: d1.images.length ? d1.images : ['https://placehold.co/64x64'],
          condition: d2.condition,
          quantity: d2.quantity,
          minimumLoanPeriod: d2.minimumLoanPeriod,
          accessories: d2.extras || [],
        };

        try {
          const response = await fetch(`${API_BASE_URL}/items`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(toApiItem(newItem)),
          });

          if (!response.ok) {
            throw new Error("Could not create item");
          }

          this.pageOneData = null;
          this.addDetailsData = null;
          await this.loadItems();
        } catch (error) {
          console.error(error);
          return;
        }
      }
      this.currentPage = "genstandPage";
      this.drawer = false;
    },
   async loadItems() {
      try {
        const response = await fetch(`${API_BASE_URL}/items`);

        if (!response.ok) {
          throw new Error("Could not load items");
        }

        const items = await response.json();
        this.items = items.map(mapApiItem);
      } catch (error) {
        console.error(error);
      }
    }

  },
};
</script>

<template>
  <v-app>

    <!-- Topbar — vises kun på sider uden egen toolbar -->
    <v-app-bar
      v-if="showNabotingBar"
      flat
      class="naboting-bar"
    >
      <span class="naboting-logo" @click="goHome">NABOTING</span>
      <v-spacer />
      <v-btn icon variant="text" class="naboting-menu-icon" @click="drawer = true">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Burger menu drawer -->
    <v-navigation-drawer v-model="drawer" location="right" temporary width="280">
      <v-list class="pa-0">
        <template v-if="profileCreated">
          <v-list-item class="menu-item" @click="goToProfileEdit">Min profil</v-list-item>
          <v-list-item class="menu-item" @click="goToPageOne">Opret genstand</v-list-item>
          <v-list-item class="menu-item" @click="goToItems">Mine genstande</v-list-item>
          <v-list-item class="menu-item" @click="logout">Log ud</v-list-item>
        </template>

        <template v-else>
          <v-list-item class="menu-item" @click="goToRegisterProfile">Opret profil</v-list-item>
          <v-list-item class="menu-item" @click="openLogin">Log ind</v-list-item>
        </template>
      </v-list>

      <v-divider />

      <v-list class="pa-0">
        <v-list-item class="menu-item" @click="drawer = false">Om Naboting</v-list-item>
        <v-list-item class="menu-item" @click="drawer = false">Sådan virker det</v-list-item>
        <v-list-item class="menu-item" @click="drawer = false">Blog</v-list-item>
        <v-list-item class="menu-item" @click="drawer = false">FAQ</v-list-item>
        <v-list-item class="menu-item" @click="drawer = false">Cookiepolitik</v-list-item>
        <v-list-item class="menu-item" @click="drawer = false">Brugervilkår</v-list-item>
      </v-list>

      <template #append>
        <div class="support-box ma-4">
          <v-icon class="mr-3 support-icon">mdi-send-outline</v-icon>
          <span class="font-weight-bold">Kontakt support</span>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <!-- Page navigation -->
      <Home
        v-if="currentPage === 'home'"
        @go-to-profile="goToRegisterProfile"
        @show-login="openLogin"
      />

      <RegisterProfile
        v-if="currentPage === 'registerProfile'"
        @show-login="openLogin"
        @profile-created="goToProfile"
        @go-back="goHome"
      />

      <Profile
        v-if="currentPage === 'profile'"
        :profile-data="profileData"
        :edit-request="profileEditRequest"
        :view-request="profileViewRequest"
        :welcome-request="profileWelcomeRequest"
        @update-profile="handleUpdateProfile"
        @go-to-page-one="goToPageOne"
        @go-to-items="goToItems"
      />

      <PageOne
        v-if="currentPage === 'pageOne'"
        :currentStep="currentStep"
        @go-to-add-details="goToAddDetails"
        @go-back="goBackFromPageOne"
      />

      <AddDetails
        v-if="currentPage === 'addDetails'"
        :currentStep="currentStep"
        @go-to-home="goHome"
        @go-to-page-one="goToPageOne"
        @save-details="handleSaveDetails"
        @go-to-confirm-item="goToConfirmItem"
      />

      <ConfirmItemScreen
        v-if="currentPage === 'confirmItem'"
        :currentStep="currentStep"
        :itemData="{ ...pageOneData, ...addDetailsData }"
        @goBack="goBackFromConfirm"
        @createItem="goToItems"
        @goToGenstandPage="goToGenstandPage"
      />

      <GenstandPage
        v-if="currentPage === 'genstandPage'"
        :items="items"
        @go-to-page-one="goToPageOne"
        @update-status="handleUpdateStatus"
        @delete-item="handleDeleteItem"
      />

      <LoginModal
        v-if="showLogin"
        @close="closeLogin"
        @create-profile="goToRegisterProfile"
        @login="handleLogin"
      />
    </v-main>

  </v-app>
</template>

<style>
.naboting-bar {
  background-color: var(--color-primary);
  padding: 0 16px;
}

.naboting-logo {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--color-surface);
  cursor: pointer;
  user-select: none;
}

.naboting-menu-icon {
  color: var(--color-surface) !important;
  background: transparent !important;
  box-shadow: none !important;
}

.menu-item {
  font-size: 16px;
  font-weight: 500;
  padding: 14px 20px;
  cursor: pointer;
}

.support-box {
  display: flex;
  align-items: center;
  background-color: var(--color-image-bg);
  border-radius: 12px;
  padding: 16px;
  font-size: 15px;
}

.support-icon {
  color: var(--color-accent);
}
</style>
