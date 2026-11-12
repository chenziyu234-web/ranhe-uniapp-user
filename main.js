import App from './App'
import uView from './uni_modules/vk-uview-ui';
import store from './store';
import xunHelper from '@/common/utils/xunHelper.js';
import baseMixins from '@/common/mixins/baseMixins.js';


// #ifdef VUE2
import Vue from 'vue'

Vue.use(uView); //引入uview
Vue.use(xunHelper)
Vue.mixin(baseMixins)

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.use(uView)
  app.use(store)
  app.use(xunHelper)
  app.mixin(baseMixins)
  
  return {
    app
  }
}
// #endif