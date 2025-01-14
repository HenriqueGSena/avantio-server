<template>
  <Dashboard />
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Dashboard from '../components/dash/dash.vue';

@Options({
  components: {
    Dashboard,
  }
})
export default class HomeView extends Vue {}

</script>
