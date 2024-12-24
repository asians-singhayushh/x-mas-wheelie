<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { cn } from '@/lib/utils'
import { ref } from 'vue'
import api from '@/lib/api';

const users = [
  { value: 'ion', label: 'Ion' },
  { value: 'ludwig', label: 'Ludwig' },
  { value: 'win', label: 'Win' },
  { value: 'sophie', label: 'Sophie' },
]

const open = ref(false)
const value = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

async function onSubmit(event: Event) {
  event.preventDefault()
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api.post('/login', {
      username: value.value,
      password: password.value,
    })

    if (response.data.success) {
      localStorage.setItem('auth_token', response.data.token)

      window.location.href = '/';
    } else {
      errorMessage.value = response.data.message || 'Unknown error occurred'
    }
  } catch (error) {
    errorMessage.value = 'Error occurred while logging in. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-2">
        <div class="grid gap-2">
          <Popover v-model:open="open">
            <PopoverTrigger as-child>
              <Button variant="outline" role="combobox" :aria-expanded="open" class="w-full justify-between">
                {{ value
                  ? users.find((user) => user.value === value)?.label
                  : "Choose username..." }}
                <icon-lucide-chevrons-up-down class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-full p-0">
              <Command>
                <CommandInput class="h-9" placeholder="Search users..." />
                <CommandEmpty>No user found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <CommandItem v-for="user in users" :key="user.value" :value="user.value" :disabled="isLoading"
                      @select="(ev: any) => {
                        if (typeof ev.detail.value === 'string') {
                          value = ev.detail.value
                        }
                        open = false
                      }">
                      {{ user.label }}
                      <icon-lucide-check :class="cn(
                        'ml-auto h-4 w-4',
                        value === user.value ? 'opacity-100' : 'opacity-0',
                      )" />
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Input type="password" v-model="password"
          :disabled="isLoading"
          placeholder="Enter your password here..."
          />
        </div>
        <Button :disabled="isLoading">
          <icon-lucide-candy-cane v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Sign In
        </Button>
        <div v-if="errorMessage" class="text-red-600 text-sm mt-2">
          {{ errorMessage }}
        </div>
      </div>
    </form>
  </div>
</template>
