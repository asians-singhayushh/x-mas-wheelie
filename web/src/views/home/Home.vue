<script setup lang="ts">
import { confetti, getRandomBgClass } from "@/utils/helper";
import RouletteWheel from "@/components/Roulette.vue";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import people from "./people.json";
import { ref, onMounted, onBeforeUnmount, provide, computed } from "vue";
import { io } from "socket.io-client";

const token = localStorage.getItem('auth_token');

const spinResults = ref<Record<string, string>>({});
const cursorPositions = ref<Record<string, { x: number; y: number }>>({});

const socket = io(import.meta.env.VITE_SOCKET_URL || "ws://localhost:3000", {
    auth: {
        token: token
    }
});

provide('socket', socket);

onMounted(() => {
    const spinResultsInterval = setInterval(() => {
        socket.emit('fetchSpinResult');
    }, 5000);

    socket.on('spinResults', (results: Record<string, string>) => {
        spinResults.value = results;
    });

    socket.on('updateCursorPositions', (positions: Record<string, { x: number; y: number }>) => {
        cursorPositions.value = positions;
    });

    socket.on('connect_error', (err) => {
        console.log(err)
        localStorage.removeItem('auth_token');
        window.location.reload();
    });

    onBeforeUnmount(() => {
        clearInterval(spinResultsInterval);
        socket.off('spinResults');
        socket.off('updateCursorPositions');
    });
});

const sortedPeople = computed(() => {
    return [...people].sort((a, b) => {
        const aHighlighted = spinResults.value['ion'] === a.username || spinResults.value['ludwig'] === a.username;
        const bHighlighted = spinResults.value['ion'] === b.username || spinResults.value['ludwig'] === b.username;

        return Number(bHighlighted) - Number(aHighlighted);
    });
});

const isHighlighted = (username: string): boolean => {
    return spinResults.value['ion'] === username || spinResults.value['ludwig'] === username;
};

</script>

<template>
    <div class="flex-1 space-y-4 p-8 pt-6 bg-secondary min-h-screen">
        <!-- Header -->
        <div class="flex items-center justify-between space-y-2">
            <h2 class="text-3xl font-bold tracking-tight" @click="confetti">
                Scrum Team Annual Event'24
            </h2>
            <div class="flex items-center space-x-2">
                <Select>
                    <SelectTrigger class="w-[180px]">
                        <SelectValue placeholder="Who spins now?..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="ion">
                                Ion
                            </SelectItem>
                            <SelectItem value="ludwig">
                                Ludwig
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button>Current Spin</Button>
            </div>
        </div>

        <!-- Podium Section -->
        <div class="grid gap-4 md:grid-cols-2">
            <Card class="podium">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">
                        Ion's Draw
                    </CardTitle>
                    <icon-lucide-sparkles class="h-5 w-5 text-amber-500" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold text-rose-500">
                        {{ spinResults['ion'] ? people.find(member => member.username == spinResults['ion'])?.name ||
                        'No result yet' : 'No result yet' }}
                    </div>
                    <p class="text-xs text-muted-foreground mt-2">
                        1st lucky draw winner
                    </p>
                </CardContent>
            </Card>

            <Card class="podium">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">
                        Ludwig's Draw
                    </CardTitle>
                    <icon-lucide-party-popper class="h-5 w-5 text-violet-500" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold text-emerald-500">
                        {{ spinResults['ludwig'] ? people.find(member => member.username == spinResults['ludwig'])?.name
                            || 'No result yet' : 'No result yet' }}
                    </div>
                    <p class="text-xs text-muted-foreground mt-2">
                        2nd lucky draw winner
                    </p>
                </CardContent>
            </Card>
        </div>

        <!-- Wheel and Members -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
            <!-- Wheel Section -->
            <Card class="col-span-5 flex flex-col">
                <CardHeader>
                    <CardTitle>Spin the Wheelie!</CardTitle>
                </CardHeader>
                <CardContent class="grow">
                    <RouletteWheel :people="people" />
                </CardContent>
            </Card>

            <!-- Members Section -->
            <Card class="col-span-3">
                <CardHeader>
                    <CardTitle>Team members</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="space-y-4">
                        <div v-for="person in sortedPeople" :key="person.id"
                            class="flex items-center gap-4 relative">
                            <Avatar :class="`hidden h-9 w-9 sm:flex ${getRandomBgClass()}`">
                                <AvatarImage :src="person.image" :alt="person.name" />
                                <AvatarFallback>{{ person.name.substring(0, 2).toUpperCase() }}</AvatarFallback>
                            </Avatar>
                            <div class="grid gap-1">
                                <p class="text-sm font-medium leading-none">
                                    {{ person.name }}
                                </p>
                                <p class="text-sm text-muted-foreground">
                                    {{ person.email }}
                                </p>
                            </div>
                            <div class="ml-auto font-medium">
                                <Button size="icon" v-if="isHighlighted(person.username)" class="rounded-full" variant="secondary">
                                    <icon-lucide-trophy class="h-6 w-6 text-amber-500"  />
                                </Button>
                                <span v-else>...</span>
                            </div>

                            <!-- Highlight cursor position for each user -->
                            <div v-if="cursorPositions[person.name.toLowerCase()]"
                                class="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2" :style="{
                                    left: `${cursorPositions[person.name.toLowerCase()]?.x}px`,
                                    top: `${cursorPositions[person.name.toLowerCase()]?.y}px`,
                                    borderRadius: '50%',
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: 'red',
                                    boxShadow: '0 0 10px rgba(255, 0, 0, 0.7)'
                                }"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
