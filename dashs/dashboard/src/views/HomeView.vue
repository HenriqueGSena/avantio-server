<template>
  <Dashboard />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Dashboard from '../components/dash/dash.vue';

export default defineComponent({
  name: "HomeView",
  components: {
    Dashboard,
  },
});
</script>
