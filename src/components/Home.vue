<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
  watch: {},
};
</script>

<template>
  <div class="page-bg">
    <v-container fluid class="text-center mx-auto">
      <h1 class="justify-content-center">Velkommen til dit lokale fællesskab</h1>
       <v-img
        src="@/assets/images/community.jpg"
        alt="Velkomstbillede"
        class="welcome-image mb-4 mx-auto"
        max-width="500"
        contain
      />

      <div class="flex-grow-1"></div>

      <v-row>
        <v-col cols="12">
          <v-btn
            class="items_button mt-10"
            size="large"
            @click="$emit('go-to-profile')"
          >
            Opret profil
          </v-btn>
        </v-col>

        <v-col cols="12">
          <v-btn
            class="loans_button"
            size="large"
            @click="$emit('go-to-profile')"
          >
            Log ind
          </v-btn>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<style scoped>
.items_button,
.loans_button {
  background-color: rgba(81, 120, 73, 1);
  color: #ffffff;
  font-weight: 700;
  min-width: 200px;
  border-radius: var(--radius-md);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6) !important;
  transition: background-color 0.2s ease;
}

.items_button:hover,
.loans_button:hover {
  background-color: #374151 !important;
}


.page-bg {
  background-color: var(--color-bg);
  min-height: 100vh;
}
</style>
