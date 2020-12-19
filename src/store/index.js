import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import tickets from './modules/tickets';

Vue.use(Vuex);
Vue.config.devtools = true;

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        name: '',
    },
    modules: {
        user,
        tickets
    },
    mutations: {
    }
  });