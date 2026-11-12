import config from '@/config.js'
const {
	themeColor
} = config
const state = {
	pswRegular: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{8,20})$/, //密码正则校验
	messageCountdown: 60, //短信倒计时
	themeColor:themeColor,
	global: { system: {}, withdraw: {}, voice: {} },
	formData:"",
	indexConfig:{},
	dictdata:{}
}

const mutations = {
	SET_FORMDATA(state,value){
		state.formData=value
	},
	SET_GLOBAL(state, value) {
		const data = value && typeof value === 'object' ? value : {}
		state.global = {
			...data,
			system: data.system || {},
			withdraw: data.withdraw || {},
			voice: data.voice || {}
		};
	},
	SET_INDEXCONFIG(state, value) {
		state.indexConfig = value;
	},
	SET_DICTDATA(state, value) {
		state.dictdata = value;
	},

}

const actions = {
	
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
