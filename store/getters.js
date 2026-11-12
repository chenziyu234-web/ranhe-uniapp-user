const getters = {
	token: state => state.user.token,
	userInfo: state => state.user.userInfo,
	publicityConfig: state => state.user.publicityConfig,
	baseURL: state => state.config.baseURL,
	companyName: state => state.config.companyName,
	global: state => state.settings.global,
	themeColor: state => state.settings.themeColor,
	loginStatus: state => state.user.token && state.user.userInfo,
	currentShop: state => state.user.currentShop,
	requestHeader: (state, getters) => {

		let data = {
			...getters['config/requestHeader'],
		}
		if (state.user.token) {
			data.token = state.user.token
			data.Authorization = `Bearer ${state.user.token}`
		}
		return data

	}
}
export default getters
