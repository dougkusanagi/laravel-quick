<script setup lang="ts">
import type { Preset } from "../../../../types/preset"
import { onMounted, reactive, ref, toRaw } from "vue";
import { Switch } from "@renderer/components/ui/switch";
import { Button } from "@renderer/components/ui/button";
import { Label } from "@renderer/components/ui/label";
import { Input } from "@renderer/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@renderer/components/ui/radio-group";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@renderer/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@renderer/components/ui/table";

// const presets = [
//     { id: 0, name: "Empty" },
//     { id: 1, name: "Breeze Livewire" },
//     { id: 2, name: "Breeze Git Pest SQlite" },
// ] as const;

const presets = ref<Preset[]>([]);

const form_new_preset = reactive<Preset>({
    name: "abc",
    cwp: "D:/laragon/www",
    test: "pest",
    git: false,
    dark_mode: false,
    database: "sqlite",
    scaffolding: "",
    breeze_stack: "blade",
    jetstream_stack: "livewire",
    jetstream_optionals: [],
})

function storePreset() {
    const rawPreset = toRaw(form_new_preset);
    window.Electron.ipcRenderer.send("store-preset", rawPreset);
}

const loadPresets = async () => {
    try {
        const data = await window.electron.ipcRenderer.invoke("get-presets");
        console.log(data);
        presets.value = data;
    } catch (error) {
        console.error('Error loading presets:', error);
    }
};

onMounted(() => {
    loadPresets();
});
</script>

<template>
    <div class="flex items-start gap-6 mt-6">
        <Card class="w-1/2">
            <CardHeader>
                <CardTitle>Preset List ({{ presets.length }})</CardTitle>

                <CardDescription>
                    A list of your presets
                </CardDescription>
            </CardHeader>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <TableRow v-for="preset in presets" :key="preset.id">
                        <TableCell class="font-medium">
                            <Button variant="link" size="xs">{{ preset.name }}</Button>
                        </TableCell>
                        <TableCell>
                            <Button variant="destructive" size="xs">Delete</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Card>

        <Card class="w-1/2">
            <form @submit.prevent="storePreset">
                <CardHeader>
                    <CardTitle>New Preset</CardTitle>

                    <CardDescription class="flex items-center justify-between">
                        <span>Create a laravel project preset.</span>

                        <Button>Save Preset</Button>
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div class="space-y-1">
                        <Label for="test">Name</Label>
                        <Input v-model="form_new_preset.name" id="test" type="text" />
                    </div>

                    <div class="mt-6 space-y-1">
                        <Label for="cwp">Directory</Label>
                        <Input v-model="form_new_preset.cwp" id="cwp" type="text" />
                    </div>

                    <div class="flex mt-6">
                        <div class="flex items-center w-full space-x-2 space-y-2">
                            <Switch v-model:checked="form_new_preset.git" id="git" />
                            <Label for="git">Initialize Git</Label>
                        </div>

                        <div class="flex items-center w-full space-x-2 space-y-2">
                            <Switch v-model:checked="form_new_preset.dark_mode" id="git" />
                            <Label for="git">Dark Mode</Label>
                        </div>
                    </div>

                    <div class="flex">
                        <div class="flex w-full space-x-4">
                            <div class="w-full mt-6">
                                <h3
                                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Test Framework
                                </h3>

                                <RadioGroup v-model="form_new_preset.test" class="mt-2" default-value="pest">
                                    <div class="flex items-center space-x-2">
                                        <RadioGroupItem id="test-r1" value="pest" />
                                        <Label for="test-r1">Pest</Label>
                                    </div>

                                    <div class="flex items-center space-x-2">
                                        <RadioGroupItem id="test-r2" value="php-unit" />
                                        <Label for="test-r2">PHP Unit</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        <div class="w-full mt-6">
                            <h3
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Database
                            </h3>

                            <RadioGroup v-model="form_new_preset.database" class="mt-2">
                                <div class="flex items-center space-x-2">
                                    <RadioGroupItem id="database-r1" value="sqlite" />
                                    <Label for="database-r1">SQLite</Label>
                                </div>

                                <div class="flex items-center space-x-2">
                                    <RadioGroupItem id="database-r2" value="mysql" />
                                    <Label for="database-r2">MySQL</Label>
                                </div>

                                <div class="flex items-center space-x-2">
                                    <RadioGroupItem id="database-r3" value="mariadb" />
                                    <Label for="database-r3">MariaDB</Label>
                                </div>

                                <div class="flex items-center space-x-2">
                                    <RadioGroupItem id="database-r4" value="pgsql" />
                                    <Label for="database-r4">PostgreSQL</Label>
                                </div>

                                <div class="flex items-center space-x-2">
                                    <RadioGroupItem id="database-r5" value="sqlsrv" />
                                    <Label for="database-r5">SQL Server</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div class="w-full mt-6">
                            <h3
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Scaffolding
                            </h3>

                            <RadioGroup v-model="form_new_preset.scaffolding" class="mt-2">
                                <div class="flex items-center space-x-2">
                                    <RadioGroupItem id="scaffolding-r1" value="" />
                                    <Label for="scaffolding-r1">Nenhum</Label>
                                </div>

                                <div class="flex items-center space-x-2">
                                    <RadioGroupItem id="scaffolding-r2" value="breeze" />
                                    <Label for="scaffolding-r2">Breeze</Label>
                                </div>

                                <div class="flex items-center space-x-2">
                                    <RadioGroupItem id="scaffolding-r3" value="jet" />
                                    <Label for="scaffolding-r3">Jetstream</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <div v-if="form_new_preset.scaffolding === 'breeze'" class="w-full mt-6">
                        <h3
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Breeze Stack
                        </h3>

                        <RadioGroup v-model="form_new_preset.breeze_stack" class="mt-2">
                            <div class="flex items-center space-x-2">
                                <RadioGroupItem id="breeze-stack-r1" value="blade" />
                                <Label for="breeze-stack-r1">Blade with Alpine</Label>
                            </div>

                            <div class="flex items-center space-x-2">
                                <RadioGroupItem id="breeze-stack-r2" value="livewire" />
                                <Label for="breeze-stack-r2">Livewire (Volt Class API) with Alpine</Label>
                            </div>

                            <div class="flex items-center space-x-2">
                                <RadioGroupItem id="breeze-stack-r3" value="livewire-functional" />
                                <Label for="breeze-stack-r3">Livewire (Volt Functional API) with Alpine</Label>
                            </div>

                            <div class="flex items-center space-x-2">
                                <RadioGroupItem id="breeze-stack-r4" value="vue" />
                                <Label for="breeze-stack-r4">Vue with Inertia</Label>
                            </div>

                            <div class="flex items-center space-x-2">
                                <RadioGroupItem id="breeze-stack-r5" value="api" />
                                <Label for="breeze-stack-r5">API only</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div v-if="form_new_preset.scaffolding === 'jet'" class="w-full mt-6">
                        <h3
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Jetstream Stack
                        </h3>

                        <RadioGroup v-model="form_new_preset.jetstream_stack" class="mt-2">
                            <div class="flex items-center space-x-2">
                                <RadioGroupItem id="jetstream-stack-r2" value="livewire" />
                                <Label for="jetstream-stack-r2">Livewire</Label>
                            </div>

                            <div class="flex items-center space-x-2">
                                <RadioGroupItem id="jetstream-stack-r3" value="vue" />
                                <Label for="jetstream-stack-r3">Vue with Inertia</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div v-if="form_new_preset.scaffolding === 'jet'" class="w-full mt-6">
                        <h3
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Jetstream Optionals Features
                        </h3>

                        <div class="flex items-center mt-2 space-x-2">
                            <input type="checkbox" v-model="form_new_preset.jetstream_optionals"
                                id="jetstream-optiona-r1" value="api" />

                            <label for="jetstream-optiona-r1"
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                API support
                            </label>
                        </div>

                        <div class="flex items-center mt-2 space-x-2">
                            <input type="checkbox" v-model="form_new_preset.jetstream_optionals"
                                id="jetstream-optiona-r2" value="dark" />

                            <label for="jetstream-optiona-r2"
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Dark mode
                            </label>
                        </div>

                        <div class="flex items-center mt-2 space-x-2">
                            <input type="checkbox" v-model="form_new_preset.jetstream_optionals"
                                id="jetstream-optiona-r3" value="verification" />

                            <label for="jetstream-optiona-r3"
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Email verification
                            </label>
                        </div>

                        <div class="flex items-center mt-2 space-x-2">
                            <input type="checkbox" v-model="form_new_preset.jetstream_optionals"
                                id="jetstream-optiona-r4" value="teams" />

                            <label for="jetstream-optiona-r4"
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Team support
                            </label>
                        </div>

                        <div class="flex items-center mt-2 space-x-2">
                            <input type="checkbox" v-model="form_new_preset.jetstream_optionals"
                                id="jetstream-optiona-r5" value="ssr" />

                            <label for="jetstream-optiona-r5"
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Inertia SSR
                            </label>
                        </div>
                    </div>
                </CardContent>
            </form>
        </Card>
    </div>
</template>
