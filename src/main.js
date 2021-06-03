import Vue from 'vue';

Vue.config.productionTip = false;

import App from './App.vue';
import router from './router/index';

import iView from 'iview';
import 'iview/dist/styles/iview.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

Vue.use(iView);



import Router from 'vue-router';

Vue.use(Router);

new Vue({router: router, render: h => h(App)}).$mount('#app')





