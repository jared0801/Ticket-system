<template>
  <v-app>
    <GlobalHeader />

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import GlobalHeader from '@/components/GlobalHeader';
export default {
  name: 'App',
  components: {
    GlobalHeader,
  },
  data: () => ({
    //
  }),
};
</script>
