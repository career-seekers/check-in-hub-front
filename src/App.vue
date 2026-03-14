<script setup lang="ts">

import { onBeforeUnmount, onMounted } from "vue";

import apiConf from "@/api/api.conf";
import { socketService } from "@/utils/websocket-resolver.util";

function log(msg: string): void {
  console.log(msg);
}

onMounted(() => {
  socketService.connect("notifications", apiConf.socketNotificationsEndpoint, log);
})

onBeforeUnmount(() => {
  socketService.disconnect("notifications");
})

</script>

<template>
  <div class="app-container">
    <router-link
      class="logo"
      to="/"
    >
      <img
        src="./assets/logo.png"
        alt="Логотип"
      >
    </router-link>
    <router-view />
  </div>
</template>

<style scoped>
  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 2rem 0;
  }

  .logo, .logo > img {
    height: 7rem;
    margin-bottom: 2rem;
  }

  .logo:hover {
    cursor: pointer;
  }
</style>
