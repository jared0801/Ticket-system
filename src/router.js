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
            component: () => import(/* webpackChunkName: "auth" */ './views/Auth/Register.vue'),
            meta: { public: true }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "auth" */ './views/Auth/Login.vue'),
            meta: { public: true }
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import(/* webpackChunkName: "profile" */ './views/User/Profile.vue')
        },
        {
            path: '/projects',
            name: 'projects',
            component: () => import(/* webpackChunkName: "project" */ './views/Projects/Projects.vue')
        },
        {
            path: '/projects/create',
            name: 'create-project',
            component: () => import(/* webpackChunkName: "project" */ './views/Projects/CreateProject.vue')
        },
        {
            path: '/projects/:id',
            name: 'view-project',
            component: () => import(/* webpackChunkName: "project" */ './views/Projects/ViewProject.vue')
        },
        {
            path: '/projects/:id/create',
            name: 'create-ticket',
            component: () => import(/* webpackChunkName: "project" */ './views/Projects/Tickets/CreateTicket.vue')
        },
        {
            path: '/tickets/:id',
            name: 'view-ticket',
            component: () => import(/* webpackChunkName: "project" */ './views/Projects/Tickets/ViewTicket.vue')
        }
    ],
});

// Checks that the user is logged in on all routes
// except those with `meta: { public: true }`
router.beforeEach((to, from, next) => {
    if(process.env.NODE_ENV === 'development') {
        if(store.state.isLoggedIn) next();
        else {
            // Dev user
            const devUser = {
                username: 'dev',
                password: 'dev',
                email: 'dev@dev.com'
            }
            store.commit('storeUser', devUser);
            next();
        }
    } else if (to.matched.some(record => record.meta.public) || store.state.isLoggedIn === true) {
        // This route doesn't require auth
        next();
    } else {
        UserService.getCurrentUser().then(res => {
            const user = res.data;
            if(user) {
                // User session is recognized
                store.commit('storeUser', user);
                next();
            } else next({ path: '/login' });
        }).catch(() => {
            next({ path: '/login' });
        });
    }
    
    
});

export default router;