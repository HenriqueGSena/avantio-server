<template>
  <div>
    <login />
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import Login from '../components/login/login.vue';

@Options({
  components: {
    Login,
  }
})
export default class LoginView extends Vue {}
</script>
