import {
	getInfo,
	authLogin,
	homeData
} from '@/api/user.js';
import {publicityConfigApi} from "@/api/index.js"
import config from '@/config.js'
import xunData from '@/common/utils/xunHelper.js';
const {
	xunHelper
} = xunData
const {
	tokenTAG,
	openIdTAG,
	userInfoTAG,
	locationTAG,
	menuButtonTAG,
	defaultCity,
	addressTAG
} = config

const state = {
	token: uni.getStorageSync(tokenTAG) || null,
	openId: uni.getStorageSync(openIdTAG) || null, //微信的openId 
	userInfo: uni.getStorageSync(userInfoTAG) || null, //用户基本信息
	location: uni.getStorageSync(locationTAG) || {
		longitude: null,
		latitude: null
	}, //经纬度
	menuButton: uni.getStorageSync(menuButtonTAG) || null,
	homeData: null, //我的页面数据
	address: uni.getStorageSync(addressTAG) || null,
	recycleOrder: null,
	tabbarList: [{
			"pagePath": "/pages/index/index",
			"text": "首页",
			"iconPath": "/static/homeV2/tab-home.png",
			"selectedIconPath": "/static/homeV2/tab-home-active.png"
		},
		{
			"pagePath": "/pages/index/keFU",
			"text": "客服",
			"iconPath": "/static/homeV2/tab-kefu.png",
			"selectedIconPath": "/static/homeV2/tab-kefu-active.png"
		},
		{
			"pagePath": "/pages/me/index",
			"text": "我的",
			"iconPath": "/static/homeV2/tab-me.png",
			"selectedIconPath": "/static/homeV2/tab-me-active.png"
		}
	],
	publicityConfig:{},



}

const mutations = {

	ADD_CACHELIST: (state, {
		key,
		value
	}) => {
		state.cacheList.set(key, value)
	},
	SET_RECYCLEORDER: (state, value) => {
		state.recycleOrder = value
	},
	SET_HOMEDATA: (state, value) => {
		state.homeData = value
	},
	SET_TOKEN: (state, value) => {
		state.token = value
		if (value) {
			uni.setStorageSync(tokenTAG, value)
		} else {
			uni.removeStorageSync(tokenTAG)
		}
	},
	SET_OPENID: (state, value) => {
		state.openId = value
		uni.setStorage({
			key: openIdTAG,
			data: value
		})
	},
	SET_USERINFO: (state, value) => {
		state.userInfo = value
		if (value) {
			uni.setStorageSync(userInfoTAG, value)
		} else {
			uni.removeStorageSync(userInfoTAG)
		}
	},
	SET_LOCATION: (state, value) => {
		state.location = value
		uni.setStorage({
			key: locationTAG,
			data: value,
		})
	},
	SET_MENUBUTTONINF: (state, value) => {
		state.menuButton = value
		uni.setStorage({
			key: menuButtonTAG,
			data: value,
		})
	},
	SET_ADDRESS: (state, value) => {
		state.address = value
		uni.setStorage({
			key: addressTAG,
			data: value
		})
	},
	SET_PUBLICITY_CONFIG: (state, value) => {
		state.publicityConfig = value
	},

}
const actions = {

	//获取用户信息
	getUserInfo({
		state,
		dispatch,
		commit
	}) {
		return new Promise(async (resolve, rej) => {
			try {
				const res = await getInfo()
				let data = res.data
				commit('SET_USERINFO', data);
				resolve(true)
			} catch (e) {
				//TODO handle the exception
				rej(false)
			}
		})
	},

	getHomeData({
		state,
		dispatch,
		commit
	}) {
		return new Promise(async (resolve, rej) => {
			try {
				const res = await homeData()
				let data = res.data
				commit('SET_HOMEDATA', data);
				resolve(true)
			} catch (e) {
				console.log(e)
				rej(false)
			}
		})
	},
	//推广配置
	getPublicityConfig({
		state,
		dispatch,
		commit
	}) {
		return new Promise(async (resolve, rej) => {
			try {
				const res = await publicityConfigApi()
				let data = res.data
				commit('SET_PUBLICITY_CONFIG', data);
			} catch (e) {
				console.log(e)
				rej(false)
			}
		})
	},

	//登录
	async login({
		state,
		dispatch,
		commit
	}) {
		const token = state.token;
		if (!token) {
			dispatch('wxUserLogin')
		} else {
			dispatch('getUserInfo')
		}

	},

	//微信登录
	async wxUserLogin({
		state,
		dispatch,
		commit
	}) {
		try {
			const resCode = await xunHelper.getWxLoginCode();
			const res = await authLogin({
				// #ifdef MP-WEIXIN
				scene: "wemini_auth_login",
				weminiJsCode: resCode,
				// #endif
				// #ifdef MP-ALIPAY
				scene: "alipay_auth_login",
				aliAuthCode: resCode
				// #endif
				
			})
			commit('SET_TOKEN', res.token)
			commit('SET_USERINFO', res.member)
			await dispatch('getHomeData')
			dispatch('getPublicityConfig')
			return res
		} catch (error) {
			await dispatch('logOut')
			throw error
		} finally {
			uni.hideLoading()
		}
	},

	//删除token
	logOut({
		commit
	}) {
		return new Promise(resolve => {
			commit('SET_TOKEN', null)
			commit('SET_USERINFO', null)
			commit('SET_HOMEDATA', null)
			// uni.clearStorage()
			resolve()
		})
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
