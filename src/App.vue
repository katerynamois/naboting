<script>
import Home from "@/components/Home.vue";
import MyItems from "@/components/MyItems.vue";
import AddDetails from "@/components/AddDetails.vue";
import PageOne from "@/components/PageOne.vue";
import ConfirmItemScreen from "./components/ConfirmItemScreen.vue";
import GenstandPage from "./components/Genstand/GenstandPage.vue";
import RedigerGenstand from "./components/Genstand/RedigerGenstand.vue";
import Stepper from "@/components/Stepper.vue";

export default {
  components: {
    Home,
    MyItems,
    AddDetails,
    PageOne,
    ConfirmItemScreen,
    GenstandPage,
    RedigerGenstand,
    Stepper,
  },
  data() {
    return {
      currentPage: "home",
      currentStep: 1,
      pageOneData: null,
      addDetailsData: null,
      items: [],
      itemToEdit: null,
    };
  },
  methods: {
    goHome() {
      this.currentPage = "home";
    },
    goToItems() {
      this.currentPage = "genstandPage";
    },
    goToPageOne() {
      this.currentPage = "pageOne";
      this.currentStep = 1;
      this.pageOneData = null;
      this.addDetailsData = null;
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
    handleRedigerGenstand(item) {
      this.itemToEdit = item;
      this.currentPage = "redigerGenstand";
    },
    handleSaveItem(updatedItem) {
      const index = this.items.findIndex(i => i.id === updatedItem.id);
      if (index !== -1) {
        this.items.splice(index, 1, updatedItem);
      }
      this.itemToEdit = null;
      this.currentPage = "genstandPage";
    },
    goToGenstandPage() {
      if (this.pageOneData && this.addDetailsData) {
        const d1 = this.pageOneData;
        const d2 = this.addDetailsData;
        const newItem = {
          id: Date.now(),
          title: d1.name,
          category: d1.category,
          brand: d1.brand || null,
          status: 'Tilgængelig',
          image: d1.images.length ? d1.images[0] : 'https://placehold.co/64x64',
          condition: d2.condition,
          maxDays: d2.maxLoanPeriod,
          accessories: d2.extras && d2.extras.length ? d2.extras.join(', ') : null,
          totalLoans: 0,
          activeLoans: 0,
          rating: null,
        };
        this.items.push(newItem);
        this.pageOneData = null;
        this.addDetailsData = null;
      }
      this.currentPage = "genstandPage";
    },
  },
};
</script>

<template>
  <v-app>

    <!-- Topbar — vises kun på sider uden egen toolbar -->
    <v-app-bar
      v-if="currentPage === 'home' || currentPage === 'genstandPage'"
      flat
      class="naboting-bar"
    >
      <span class="naboting-logo" @click="goHome">NABOTING</span>
      <v-spacer />
      <v-btn icon variant="text" class="naboting-menu-icon">
        <v-icon color="white">mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <!-- Page navigation -->
      <Home v-if="currentPage === 'home'" @go-to-items="goToItems" />

      <MyItems
        v-if="currentPage === 'items'"
        @go-to-home="goHome"
        @go-to-page-one="goToPageOne"
      />

      <PageOne
        v-if="currentPage === 'pageOne'"
        :currentStep="currentStep"
        @go-to-add-details="goToAddDetails"
        @go-to-items="goToItems"
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
        @goBack="goToAddDetails"
        @createItem="goToItems"
        @goToGenstandPage="goToGenstandPage"
      />

      <GenstandPage
        v-if="currentPage === 'genstandPage'"
        :items="items"
        @go-to-page-one="goToPageOne"
        @rediger-genstand="handleRedigerGenstand"
      />

      <RedigerGenstand
        v-if="currentPage === 'redigerGenstand' && itemToEdit"
        :item="itemToEdit"
        @save-item="handleSaveItem"
        @go-back="currentPage = 'genstandPage'"
      />
    </v-main>

  </v-app>
</template>

<style>
.naboting-bar {
  background-color: rgba(81, 120, 73, 1);
  padding: 0 16px;
}

.naboting-logo {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #ffffff;
  cursor: pointer;
  user-select: none;
}

.naboting-menu-icon {
  color: #ffffff !important;
  background: transparent !important;
  box-shadow: none !important;
}
</style>
