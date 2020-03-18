import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
Vue.config.devtools = true;

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        user_id: '',
        username: '',
        email: '',
        isLoggedIn: false,
    },
    getters: {
        getUser(state) {
            return { 
                user_id: state.user_id,
                username: state.username,
                email: state.email
             };
        }
    },
    mutations: {
        storeUser(state, user) {
            state.user_id = user.user_id;
            state.username = user.username;
            state.email = user.email;
            state.isLoggedIn = true;
        },
        removeUser(state) {
            state.user_id = '';
            state.username = '';
            state.email = '';
            state.isLoggedIn = false;
        }
    },
    actions: {

    }
  });