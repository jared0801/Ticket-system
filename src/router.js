import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/tickets',
      name: 'tickets',
      // route level code-splitting
      // this generates a separate chunk (ticket.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "ticket" */ './views/Tickets.vue'),
    },
    {
      path: '/tickets/create',
      name: 'create-ticket',
      // route level code-splitting
      // this generates a separate chunk (ticket.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "ticket" */ './views/CreateTicket.vue'),
    },
  ],
});
