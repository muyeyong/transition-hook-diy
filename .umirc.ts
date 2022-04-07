import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: 'key', component: '@/pages/key'},
    { path: 'emoji', component: '@/pages/emoji'},
    { path: 'switch', component: '@/pages/switch'},
    { path: 'switchDiy', component: '@/pages/switchDiy'},
    { path: 'list', component: '@/pages/list'},
  ],
  fastRefresh: {},
});
