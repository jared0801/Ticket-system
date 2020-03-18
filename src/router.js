import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import store from './store';
import UserService from './api/UserService';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: { public: true } // Logging in is not required
        },
        {
            path: '/register',
            name: 'register',
            // route level code-splitting
            // this generates a separate chunk (ticket.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "auth" */ './views/Register.vue'),
            meta: { public: true }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "auth" */ './views/Login.vue'),
            meta: { public: true }
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import(/* webpackChunkName: "profile" */ './views/Profile.vue')
        },
        {
            path: '/tickets',
            name: 'tickets',
            component: () => import(/* webpackChunkName: "ticket" */ './views/Tickets.vue'),
        },
        {
            path: '/tickets/create',
            name: 'create-ticket',
            component: () => import(/* webpackChunkName: "ticket" */ './views/CreateTicket.vue'),
        },
        {
            path: '/tickets/:id',
            name: 'view-ticket',
            component: () => import(/* webpackChunkName: "ticket" */ './views/ViewTicket.vue')
        }
    ],
});

// Checks that the user is logged in on all routes
// except those with `meta: { public: true }`
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.public) || store.state.isLoggedIn === true) {
        // This route doesn't require auth
        next();
    } else {
        UserService.getUser().then(res => {
            const user = res.data;
            if(user) {
                // User session is recognized
                store.commit('storeUser', user);
                next();
            }
            else next({ path: '/login' });
        }).catch(() => {
            next({ path: '/login' });
        });
    }
    
    
});

export default router;