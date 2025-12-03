<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar />
  <main class="app-main">
    <RouterView />
  </main>
</template>

<style scoped>
.app-main {
  min-height: calc(100vh - 70px);
  padding-top: 70px;
  width: 100%;
  margin: 0;
  padding-left: 0;
  padding-right: 0;
}
</style>
