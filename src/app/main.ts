import Vue from 'vue';
import App from './App.vue';
import * as VueGoogleMaps from 'vue2-google-maps';

// disable console warnings
Vue.config.devtools = false;
Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.API_KEY,
    libraries: 'places',
  },
});

new Vue({
  render: h => h(App),
}).$mount('#app');
