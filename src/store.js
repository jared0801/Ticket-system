import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
Vue.config.devtools = true;

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        id: '',
        username: '',
        email: '',
        isLoggedIn: false,
    },
    getters: {
        getUser(state) {
            return { 
                id: state.id,
                username: state.username,
                email: state.email
             };
        }
    },
    mutations: {
        storeUser(state, user) {
            state.id = user.id;
            state.username = user.username;
            state.email = user.email;
            state.isLoggedIn = true;
        },
        removeUser(state) {
            state.id = '';
            state.username = '';
            state.email = '';
            state.isLoggedIn = false;
        },
        updateUser(state, user) {
            if(user.email) state.email = user.email;
            if(user.username) state.username = user.username;
        }
    },
    actions: {

    }
  });