import getters from './getters'

// #ifdef VUE2
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1') //获取当前文件的名称
	const value = modulesFiles(modulePath)
	modules[moduleName] = value.default
	return modules
}, {})
const store = new Vuex.Store({
	modules,
	getters
})
// #endif



// #ifdef VUE3
import {
	createStore
} from 'vuex'

//读取当前./modules 文件夹下的文件 并且自动导入
const modulesFiles =
	import.meta.glob('./modules/*.js',{eager:true});

const modules = {};

for (const key in modulesFiles) {
	if (Object.prototype.hasOwnProperty.call(modulesFiles, key)) {
		const moduleName = key.replace(/^\.\/modules\/(.*)\.\w+$/, '$1') //获取当前文件的名称
		modules[moduleName] = modulesFiles[key].default
	}
}
const store = createStore({
	modules,
	getters
})
// #endif



export default store
