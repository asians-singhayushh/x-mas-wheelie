<script setup lang="ts">
import { ref, computed, nextTick, inject, onMounted } from 'vue';
import { confetti, getRandomBgClass } from '@/utils/helper';
import { Roulette } from 'vue3-roulette';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Socket } from 'socket.io-client';

type People = { username: string; id: number; name: string; email: string; image: string };

const props = defineProps({
    people: {
        type: Array as () => People[],
        required: true,
    },
});

const socket = inject<Socket>('socket');

const wheelRef = ref();
const wheelResult = ref<any | null>(null);
const wheelActive = ref(true);
const result = ref<any | null>(null);

const shuffleArray = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
};

const randomizedPeople = ref(shuffleArray([...props.people]));

const wheelItems = computed(() =>
    randomizedPeople.value.map((person) => ({
        ...person,
        backgroundImg: `/people/${person.name.toLowerCase()}-bg.png`,
        htmlContent: `<strong>${person.name}</strong>`,
        textColor: 'white',
        background: getRandomBgClass(),
    }))
);

const launchWheel = () => {
    nextTick(() => {
        if (wheelRef.value && typeof wheelRef.value.launchWheel === 'function') {
            console.log('Launching the wheel...');
            wheelRef.value.launchWheel();
        } else {
            console.error('Roulette instance is not ready.');
        }
    });
};

const wheelData = {
    firstItemIndex: { value: 0 },
    wheelSettings: {
        centeredIndicator: true,
        indicatorPosition: 'top',
        size: 400,
        displayShadow: false,
        duration: 8,
        resultVariation: 100,
        easing: 'bounce',
        counterClockwise: false,
        horizontalContent: false,
        displayBorder: true,
        displayIndicator: true,
        baseDisplay: true,
        baseSize: 100,
        baseDisplayShadow: true,
        baseDisplayIndicator: true,
        baseBackground: 'rgb(255 69 69)',
        baseHtmlContent: '<strong class="text-white">Spin!</strong>',
    },
};

const wheelStartedCallback = (resultItem: any) => {
    socket?.emit('spinStart', resultItem.username);
};

const wheelEndedCallback = (resultItem: any) => {
    if (!wheelResult.value)
        socket?.emit('setSpinResult', resultItem.username);
    result.value = resultItem;
    celebrate();
};

const celebrate = () => {
    confetti();
    wheelActive.value = false;
};

const reset = () => {
    socket?.emit('resetWheel');
    wheelActive.value = true;
    wheelResult.value = null;
    randomizedPeople.value = shuffleArray([...props.people]);
};

onMounted(() => {
    socket?.on('spinStart', (winner: string) => {
        wheelActive.value = true;
        const index = wheelItems.value.findIndex(item => item.username === winner);
        wheelResult.value = index >= 0 ? { value: index } : null;
        launchWheel();
    });
    socket?.on('resetWheel', () => {
        wheelActive.value = true;
        wheelResult.value = null;
        randomizedPeople.value = shuffleArray([...props.people]);
    })
});

</script>

<template>
    <div id="confetti" class="flex items-center justify-center relative h-full">
        <Roulette v-if="wheelActive" ref="wheelRef" :items="wheelItems"
            :centered-indicator="wheelData.wheelSettings.centeredIndicator"
            :indicator-position="wheelData.wheelSettings.indicatorPosition" :size="wheelData.wheelSettings.size"
            :display-shadow="wheelData.wheelSettings.displayShadow"
            :display-border="wheelData.wheelSettings.displayBorder"
            :display-indicator="wheelData.wheelSettings.displayIndicator" :duration="wheelData.wheelSettings.duration"
            :result-variation="wheelData.wheelSettings.resultVariation" :easing="wheelData.wheelSettings.easing"
            :counter-clockwise="wheelData.wheelSettings.counterClockwise"
            :horizontal-content="wheelData.wheelSettings.horizontalContent"
            :base-display="wheelData.wheelSettings.baseDisplay" :base-size="wheelData.wheelSettings.baseSize"
            :base-display-indicator="wheelData.wheelSettings.baseDisplayIndicator"
            :base-display-shadow="wheelData.wheelSettings.baseDisplayShadow"
            v-bind="wheelResult !== null ? { 'wheel-result-index': wheelResult } : {}"
            :base-background="wheelData.wheelSettings.baseBackground" @click="launchWheel"
            v-on="wheelResult === null ? { 'wheel-start': wheelStartedCallback } : {}"
            @wheel-end="wheelEndedCallback">
            <template #baseContent>
                <strong class="text-white">Spin!</strong>
            </template>
        </Roulette>
        <div v-else-if="result">
            <div class="absolute inset-0 h-full w-full animate-boounce">
                <!-- Using the img as a background, scaled down and repeated -->
                <div class="absolute inset-0 bg-repeat"
                    :style="`background-image: url(${result.backgroundImg}); background-size: 50%; opacity: 0.25;`">
                </div>
            </div>

            <Card
                class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg rounded-lg px-8 transform transition-all hover:scale-105 hover:shadow-2xl relative z-10 animate-float">
                <CardHeader>
                    <CardTitle class="text-xl font-bold text-center text-white">And the Winner Is...</CardTitle>
                </CardHeader>
                <CardContent>
                    <Separator class="mb-4 bg-white opacity-30" />
                    <div class="space-y-6 text-center">
                        <!-- Winner Image with Hover Transition -->
                        <img :src="result.image" alt="winner image"
                            class="h-48 w-48 rounded-full border-4 border-white object-cover transition-transform duration-300 transform hover:scale-110 mx-auto" />
                        <!-- Winner Name -->
                        <h4 class="text-2xl font-bold mt-4 animate-pulse">{{ result.name }}</h4>
                        <!-- Winner Message -->
                        <p class="text-md mt-2">Congratulations! 🎉</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        class="w-full py-3 font-bold bg-white text-indigo-600 hover:bg-indigo-200 hover:text-indigo-900 transition-all duration-300"
                        @click="reset()">
                        Open Wheel Again
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
</template>

<style>
.wheel-base-container .wheel-base-indicator::before {
    transform: translateX(65%) !important;
}
</style>
