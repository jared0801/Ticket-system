import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import vuetify from './plugins/vuetify';

//require('./assets/styles/styles.scss');

Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
