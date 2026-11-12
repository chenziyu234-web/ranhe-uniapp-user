<script>
	import {
		getConfig,
		dictdata
	} from '@/api/public.js'
	export default {
		globalData:{
			qrcode: '',
		},
		methods: {
			//获取配置
			getconfig() {
				getConfig()
					.then(res => {
						if (res.code == 200) {
							this.$store.commit('settings/SET_GLOBAL', res.data);
						}
					})
					.catch(e => {
						console.log(e);
					});
			},
			//解析url
			filterUrlParam(urlSearch) {
				let ret = {}
				let regParam = /([^&=]+)=([\w\W]*?)(&|$|#)/g
				if (urlSearch) {
					var strParam = urlSearch
					var result
					while ((result = regParam.exec(strParam)) != null) {
						ret[result[1]] = result[2]
					}
				}
				console.log(ret,'urlret111111')
				return ret
			},
			getdictdata() {
				dictdata().then(res => {
					if (res.code == 200) {
						this.$store.commit('settings/SET_DICTDATA', res.data);
					}
				}).catch(e => {
					console.log(e);
				});
			},
		},
		onLaunch: function(option) {
			this.getconfig()
			this.getdictdata()
			// #ifdef MP-WEIXIN
			this.$store.commit('user/SET_MENUBUTTONINF', uni.getMenuButtonBoundingClientRect());
			// #endif
		},
		onShow: function(option) {
			this.globalData.qrcode = option.query
			console.log(option,"onshow")
		},
		onHide: function() {}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import 'common/css/public.scss';
	@import "./uni_modules/vk-uview-ui/index.scss";
	.u-font-48{
		font-size: 48rpx;
	}
	.text-999999{
		color: #999;
	}
</style>
