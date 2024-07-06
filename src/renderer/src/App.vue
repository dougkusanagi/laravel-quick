<script setup lang="ts">
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Button } from "@renderer/components/ui/button";
import { useToast } from "@renderer/components/ui/toast/use-toast";
import { Toaster } from "@renderer/components/ui/toast";
import { reactive } from "vue";

const { toast } = useToast();

interface LaravelProject {
	name: string;
	stack: string;
}

const laravel_config: LaravelProject = reactive({});

const ipcLaravel = () => {
	window.electron.ipcRenderer.send("teste-laravel", "abc");
	toast({ title: "Laravel", description: "Teste Laravel" });
};
</script>

<template>
  <Toaster />
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold mt-8">Hello World</h1>

    <div class="grid w-full max-w-sm items-center gap-1.5 my-6">
      <Label for="email">Email</Label>
      <Input id="email" type="email" placeholder="Email" />
    </div>

    <Button @click="ipcLaravel">Teste Laravel</Button>
  </div>
</template>
