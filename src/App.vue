<template>
  <div id="app">
    <GlobalHeader/>
    <div class="page-content">
      <router-view />
    </div>
  </div>
</template>

<script>

import GlobalHeader from '@/components/GlobalHeader';
export default {
  name: 'App',
  components: {
    GlobalHeader,
  }
}
</script>

<style lang="scss">
#app {
  font-family: Arial Rounded Mt, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding-bottom: 2em;
}

.page-content {
    position: relative;
}
</style>
