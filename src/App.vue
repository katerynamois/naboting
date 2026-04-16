<script>
import Home from "@/components/Home.vue";
import AddDetails from "@/components/AddDetails.vue";
import PageOne from "@/components/PageOne.vue";
import ConfirmItemScreen from "./components/ConfirmItemScreen.vue";
import GenstandPage from "./components/Genstand/GenstandPage.vue";
import Profile from "@/components/Profile.vue";
import LoginModal from "@/components/LoginModal.vue";
import RegisterProfile from "@/components/RegisterProfile.vue";

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
    handleUpdateStatus({ id, status }) {
      const index = this.items.findIndex(i => i.id === id);
      if (index !== -1) {
        this.items[index].status = status;
      }
    },
    handleUpdateProfile(profileData) {
      this.profileData = profileData;
    },
    goToGenstandPage() {
      if (this.pageOneData && this.addDetailsData) {
        const d1 = this.pageOneData;
        const d2 = this.addDetailsData;
        const newItem = {
          id: Date.now(),
          userId: this.currentUserId,
          title: d1.name,
          category: d1.category,
          brand: d1.brand || null,
          status: 'Tilgængelig',
          images: d1.images.length ? d1.images : ['https://placehold.co/64x64'],
          condition: d2.condition,
          quantity: d2.quantity,
          minimumLoanPeriod: d2.minimumLoanPeriod,
          accessories: d2.extras || [],
          totalLoans: 0,
          activeLoans: 0,
          createdAt: new Date().toISOString(),
        };
        this.items.push(newItem);
        this.pageOneData = null;
        this.addDetailsData = null;
      }
      this.currentPage = "genstandPage";
      this.drawer = false;
    },
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
