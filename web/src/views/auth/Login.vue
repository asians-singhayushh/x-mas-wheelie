<script setup lang="ts">
import UserAuthForm from './AuthForm.vue'
</script>

<template>
  <div class="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            Join the Party &amp; Login!
          </h1>
          <p class="text-sm text-muted-foreground">
            Login below and let’s get this show on the road!
          </p>
        </div>
        <UserAuthForm />
      </div>
    </div>
    <div class="relative h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div class="absolute inset-0 bg-zinc-900" />
      <div class="relative z-20 flex items-center">
        <icon-lucide-party-popper class="h-6 w-6 mr-2" />
        <h1 class="text-xl font-medium">
            Scrum Team'24: The Lucky Draw is Here!
        </h1>
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            &ldquo;Only the founders and event leaders get to join the Lucky Draw console. Everyone else, hang tight—your for your lucky draws!&rdquo;
          </p>
          <footer class="text-sm">
            Scrum Team Event 2024 – Get Ready for the Magic!
          </footer>
        </blockquote>
      </div>
    </div>
  </div>
</template>
