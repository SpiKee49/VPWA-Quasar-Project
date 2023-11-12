import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: () => ({ name: 'landing' }),
    },

    {
        path: '/auth',
        children: [
            {
                path: 'login',
                name: 'login',
                meta: { guestOnly: true },
                component: () => import('pages/login/LogInPage.vue'),
            },
        ],
    },
    {
        path: '/channel',
        meta: { requiresAuth: true },
        component: () => import('layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                name: 'landing',
                component: () => import('pages/IndexPage.vue'),
            },
            {
                path: '/:id',
                component: () => import('pages/channels/ChannelPage.vue'),
            },
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
]

export default routes
