<script setup lang="ts">
import NewPreset from "@renderer/components/NewPreset.vue";
import NewProject from "@renderer/components/NewProject.vue";
import { Toaster } from "@renderer/components/ui/toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@renderer/components/ui/tabs";
</script>

<template>
  <Toaster />

  <div class="container mx-auto">
    <h1 class="mt-8 text-3xl font-bold">Laravel Quick</h1>

    <p class="max-w-lg leading-relaxed text-muted-foreground text-balance">
      A quick and easy way to get started with Laravel.
    </p>

    <Tabs default-value="new-project">
      <TabsList class="grid w-full grid-cols-2 mt-12">
        <TabsTrigger value="new-project">
          New Project
        </TabsTrigger>

        <TabsTrigger value="new-preset">
          New Preset
        </TabsTrigger>
      </TabsList>

      <TabsContent value="new-project">
        <NewProject />
      </TabsContent>

      <TabsContent value="new-preset">
        <NewPreset />
      </TabsContent>
    </Tabs>
  </div>
</template>
