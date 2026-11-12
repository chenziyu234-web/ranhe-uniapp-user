import config from '@/config.js'
const {
	baseURL,
	companyName
} = config
const state = {
	baseURL: baseURL, //服务器地址
	companyName: companyName,
	dictCacheTime: 2 * 24 * 60 * 60 * 1000, //字典缓存时间
	clienttype: 1, // APP应用类型
	client: 'wechat', // 客户端 android   ios
	package_name: 'base.WeChat', //包名
	version: '1.0.0', //版本号
	version_number: '100', //版本号，用于版本升级
	
}
const getters = {
	requestHeader(state) {
		return {
			clienttype: state.clienttype,
			client: state.client,
			version: state.version_number
		}
	}

}
// #ifdef APP-PLUS
if (uni.getSystemInfoSync().platform == "ios") {
	state.client = 'ios'
}
// #endif

const mutations = {
	SET_VERSION(state, version) {
		state.version = version;
	},
	SET_VERSIONNUMBER(state, version) {
		state.version_number = version;
	},
}
export default {
	namespaced: true,
	state,
	getters,
	mutations
}
