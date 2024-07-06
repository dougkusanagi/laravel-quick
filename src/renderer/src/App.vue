<script setup lang="ts">
const ipcHandle = () => window.electron.ipcRenderer.send("ping");
</script>

<template>
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold mt-8">Hello World</h1>
  </div>
</template>
