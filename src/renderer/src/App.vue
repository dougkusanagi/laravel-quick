<script setup lang="ts">
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
</script>

<template>
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold mt-8">Hello World</h1>

    <div class="grid w-full max-w-sm items-center gap-1.5 my-6">
      <Label for="email">Email</Label>
      <Input id="email" type="email" placeholder="Email" />
    </div>
  </div>
</template>
