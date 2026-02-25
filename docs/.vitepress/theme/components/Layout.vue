<script setup>
import DefaultTheme from 'vitepress/theme'
// import Snow from './Snow.vue'
// import SnowControls from './SnowControls.vue'
import { ref } from 'vue'

const { Layout } = DefaultTheme

const snowSettings = ref({
  enabled: true,
  count: 100,
  speed: 1,
  height: 20
})
</script>

<template>
  <Layout>
    <!-- Здесь слоты -->
  </Layout>

<!--  <Snow-->
<!--      :enabled="snowSettings.enabled"-->
<!--      :count="snowSettings.count"-->
<!--      :speed="snowSettings.speed"-->
<!--      :height="snowSettings.height"-->
<!--  />-->

<!--  <SnowControls v-model="snowSettings" />-->
</template>