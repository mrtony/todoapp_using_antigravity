<script setup lang="ts">
import AppLayout from './components/layout/AppLayout.vue'
import { useTodoReminder } from './composables/useTodoReminder'

useTodoReminder()
</script>

<template>
  <AppLayout>
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </AppLayout>
</template>
