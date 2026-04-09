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
      itemDetails: null,
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
    },
    goToAddDetails(data) {
      this.currentPage = "addDetails";
      this.currentStep = 2;
    },
    handleSaveDetails(details) {
      this.itemDetails = details;
      this.currentPage = "items"; //Change to next page when implemented
    },
    goToConfirmItem() {
      this.currentPage = "confirmItem";
      this.currentStep = 3;
    },
    goToGenstandPage() {
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
        @goBack="goToAddDetails"
        @createItem="goToItems"
        @goToGenstandPage="goToGenstandPage"
      />

      <GenstandPage
        v-if="currentPage === 'genstandPage'"
        @go-to-page-one="goToPageOne"
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
