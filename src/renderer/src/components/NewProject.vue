<script setup lang="ts">
import type { Preset } from "../../../../types/preset"
import { onBeforeMount, reactive, ref, toRaw } from "vue";
import { useToast } from "@renderer/components/ui/toast/use-toast";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@renderer/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@renderer/components/ui/card";

const { toast } = useToast();
const presets = ref<Preset[]>([]);
const log = ref("");
const log_ref = ref(null);
const laravel_project = reactive({
    name: "",
    preset: "",
    cwp: "",
});

const createProject = () => {
    const raw_project = toRaw(laravel_project);
    window.electron.ipcRenderer.send("create-project", raw_project);
    // toast({ title: "Laravel", description: "Teste Laravel" });
};

const loadPresets = async () => {
    try {
        const data = await window.electron.ipcRenderer.invoke("get-presets");
        presets.value = data;
    } catch (error) {
        console.error('Error loading presets:', error);
    }
};

const scrollToEnd = () => {
    if (log_ref.value) {
        log_ref.value.scrollTop = log_ref.value.scrollHeight;
    }
};

window.electron.ipcRenderer.on("append-log", (_, message) => {
    log.value += `${message}\n`;
    scrollToEnd();
})

window.electron.ipcRenderer.on("preset-selected", (_, preset) => {
    console.log("preset-selected", preset);
    laravel_project.preset = preset.id;
})

onBeforeMount(() => {
    loadPresets();
});
</script>

<template>
    <div class="flex flex-col items-start gap-6 mt-6">
        <Card class="w-full">
            <form @submit.prevent="createProject">
                <CardHeader>
                    <CardTitle>New Laravel Project</CardTitle>

                    <CardDescription>
                        Create a new Laravel project based on the selected preset
                    </CardDescription>
                </CardHeader>

                <CardContent class="space-y-2">
                    <div class="space-y-1">
                        <Label for="name">Project Name</Label>
                        <Input v-model="laravel_project.name" id="name" type="search" placeholder="default: example-app"
                            autocomplete="off" autofocus />
                    </div>

                    <div class="space-y-1">
                        <Label for="preset">Preset</Label>

                        <Select v-model="laravel_project.preset" id="preset">
                            <SelectTrigger>
                                <SelectValue placeholder="Select the preset" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="0">
                                        Empty
                                    </SelectItem>

                                    <SelectItem v-for="preset in presets" :value="preset.id">
                                        {{ preset.name }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div v-if="false" class="space-y-1">
                        <Label for="cwp">Change Path</Label>
                        <Input v-model="laravel_project.cwp" id="cwp"
                            placeholder="default is configured in the preset" />
                    </div>
                </CardContent>

                <CardFooter>
                    <Button>Create Project</Button>
                </CardFooter>
            </form>
        </Card>

        <Card class="flex flex-col w-full gap-4">
            <CardHeader>
                <CardTitle>Log:</CardTitle>

                <CardDescription>
                    Look what is going on
                </CardDescription>
            </CardHeader>

            <ScrollArea ref="log_ref" class=" bg-[hsl(222.2,47.4%,11.2%)] p-4 text-white/80 h-96 rounded-b-lg">
                <pre class="text-sm">{{ log }}</pre>
            </ScrollArea>
        </Card>
    </div>
</template>
