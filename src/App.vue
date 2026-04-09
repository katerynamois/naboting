<script>
import Home from "@/components/Home.vue";
import MyItems from "@/components/MyItems.vue";
import AddDetails from "@/components/AddDetails.vue";
import PageOne from "@/components/PageOne.vue";
import ConfirmItemScreen from "./components/ConfirmItemScreen.vue";
import GenstandPage from "./components/Genstand/GenstandPage.vue";
import Stepper from "@/components/Stepper.vue";

export default {
  components: {
    Home,
    MyItems,
    AddDetails,
    PageOne,
    ConfirmItemScreen,
    GenstandPage,
    Stepper,
  },
  data() {
    return {
      currentPage: "home",
      currentStep: 1,
      pageOneData: null,
      addDetailsData: null,
      pendingItem: null,
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
      this.pendingItem = null;
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
      // Placeholder — navigate to edit flow when implemented
      console.log('Rediger genstand:', item);
    },
    goToGenstandPage() {
      if (this.pageOneData && this.addDetailsData) {
        const d1 = this.pageOneData;
        const d2 = this.addDetailsData;
        this.pendingItem = {
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
      }
      this.currentPage = "genstandPage";
    },
  },
};
</script>

<template>
  <v-app>
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
        :newItem="pendingItem"
        @go-to-page-one="goToPageOne"
        @rediger-genstand="handleRedigerGenstand"
      />
    </v-main>

    <v-btn
      class="ma-2"
      icon="mdi-home"
      location="top left"
      position="absolute"
      color="primary"
      @click="goHome"
    />

    <!-- <v-btn
      class="ma-2"
      icon="mdi-theme-light-dark"
      location="top right"
      position="absolute"
      @click="$vuetify.theme.cycle()" 
    />-->
  </v-app>
</template>
