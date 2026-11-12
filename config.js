export default {

	tokenTAG: '_member__token', //token缓存本地的key,

	openIdTAG: '_member_ope_id', //openId缓存本地的key

	userInfoTAG: '_member__user__info', //userInfo缓存本地的key

	locationTAG: '_member__location', //location缓存本地的key

	menuButtonTAG: '_member__menu__button', //menuButton缓存本地的key

	addressTAG: '_member_address', //openId缓存本地的key

	mapkey:'5892fdd4cc3b1897f12fabe39055c4f1',//杭州地址解析 Web 服务 Key

	companyName: '杭州逸畴环保',
	
	appID:  'wx79c2ebb74673181f',

	themeColor: "#00B3E0",

	giftServiceEnabled: false,

	// HBuilderX 运行到微信开发者工具时连接本机；发行包使用杭州服务器。
	baseURL: process.env.NODE_ENV === 'development'
		? 'http://127.0.0.1:8121/'
		: 'https://yitaohuanbao.com/',

}
