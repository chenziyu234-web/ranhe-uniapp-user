<template>
	<view>
		<uni-popup ref="uniPopup" type="center">
			<view class="u-flex-col u-col-center">
				<view class="" v-if="posterImage">
					<image :src="posterImage" mode="aspectFit" class="posterImage"></image>
				</view>
				<button class="u-reset-button btn-down u-m-t-30" @click="saveImg">
					<text class="u-m-l-10">保存图片</text>
				</button>
				<view class="u-flex u-row-center u-m-t-30" @click="hidePopup">
					<u-icon name="close-circle" color="#FFF" size="50"></u-icon>
				</view>
			</view>
		</uni-popup>
		<!-- 画布 -->
		<view class="hideCanvasView">
			<canvas class="hideCanvas" id="default_PosterCanvasId" canvas-id="default_PosterCanvasId"
				:style="{ width: (poster.width || 10) + 'px', height: (poster.height || 10) + 'px' }"></canvas>
		</view>
	</view>
</template>

<script>
	import {
		getSharePoster
	} from '@/js_sdk/QuShe-SharerPoster/QS-SharePoster/QS-SharePoster.js';

	import {
		appletCode
	} from '@/api/index.js'


	export default {
		name: 'save-popup',
		data() {
			return {
				poster: {},
				posterImage: '',
				info: {}
			};
		},

		computed: {
			userInfo() {
				return this.$store.getters.userInfo
			}
		},
		onLoad() {
			console.log(this.info)
		},
		methods: {
			getWxCode() {
				return appletCode({}).then(res => {
					this.QRCode = this.xunHelper.detectUrl(res.data.data)
				}).catch(e => {
					this.logError(e)
					throw new Error("错误")
				})

			},
			hidePopup() {
				this.$refs.uniPopup.close();
			},
			async buildPoster() {
				this.info = uni.getStorageSync('saveInfo')
				await this.getWxCode()

				let _this = this
				uni.showLoading({
					title: '生成中...',
					mask: true
				});
				try {
					const width = uni.upx2px(600);
					const height = uni.upx2px(870);
					const avatarSize = uni.upx2px(85);
					const qrcodeSize = uni.upx2px(156);
					let info = {};
					const d = await getSharePoster({
						_this: this, //若在组件中使用 必传
						type: 'testShareType',
						posterCanvasId: 'default_PosterCanvasId', //canvasId
						delayTimeScale: 20, //延时系数
						background: {
							width: width,
							height: height,
							backgroundColor: '#FFF'
						},
						drawArray: ({
							bgObj,
							type,
							bgScale
						}) => {
							const dx = uni.upx2px(34);
							const fontSize = uni.upx2px(28);
							const lineHeight = bgObj.height * 0.04;
							const titleHeight = dx + uni.upx2px(40) + uni.upx2px(630)
							//可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
							return new Promise((rs, rj) => {
								rs([{
										type: 'image',
										url: "/static/home/68.png",
										dWidth: uni.upx2px(600), // 因为设置了圆形图片 所以要乘以2
										dHeight: uni.upx2px(878),
										roundRectSet: {
											r: uni.upx2px(10)
										}
									},
									{
										type: 'text',
										text: this.info.time,
										size: 14,
										dx: uni.upx2px(230),
										dy: uni.upx2px(80),
									},
									{
										type: 'text',
										text: "-我的排名-",
										size: 11,
										dx: uni.upx2px(245),
										dy: uni.upx2px(190),
									},
									{
										type: 'text',
										text: this.info.selfRanking ? "第" + this.info.selfRanking + "名" : "无排名" ,
										size: 24,
										dx: uni.upx2px(230),
										dy: uni.upx2px(250),
									},
									{
										type: 'image',
										url: this.xunHelper.detectUrl(this.userInfo.avatar),	// "/static/home/66.png",	
										dx: uni.upx2px(235),
										dy: uni.upx2px(360),
										dWidth: uni.upx2px(127), // 因为设置了圆形图片 所以要乘以2
										dHeight: uni.upx2px(127),
										roundRectSet: {
											r: uni.upx2px(63)
										}
									},
									// {
									// 	type: 'text',
									// 	text: this.userInfo.nickname,
									// 	size: 14,
									// 	dx: uni.upx2px(225),
									// 	dy: uni.upx2px(520),
									// },
									{
										type: 'text',
										text: this.info.registerDays || '0',
										size: 14,
										dx: uni.upx2px(50),
										dy: uni.upx2px(590),
									},
									{
										type: 'text',
										// text: "加入分类(天)",
										text: "加入分类",
										size: 10,
										dx: uni.upx2px(20),
										dy: uni.upx2px(635),
									},
									{
										type: 'text',
										text: this.info.likeNumber || '0',
										size: 14,
										dx: uni.upx2px(200),
										dy: uni.upx2px(590),
									},
									{
										type: 'text',
										// text: "投递地点(个)",
										text: "投递地点",
										size: 10,
										dx: uni.upx2px(170),
										dy: uni.upx2px(635),
									},
									{
										type: 'text',
										text: this.info.deliverNumber || '0',
										size: 14,
										dx: uni.upx2px(350),
										dy: uni.upx2px(590),
									},
									{
										type: 'text',
										text: "累计投递",
										// text: "累计投递(次)",
										size: 10,
										dx: uni.upx2px(318),
										dy: uni.upx2px(635),
									},
									{
										type: 'text',
										text: this.xunHelper.weightK(this.info.deliverWeight),
										size: 14,
										dx: uni.upx2px(500),
										dy: uni.upx2px(590),
									},
									{
										type: 'text',
										text: "累计重量",
										// text: "累计重量(kg)",
										size: 10,
										dx: uni.upx2px(467),
										dy: uni.upx2px(635),
									},
									{
										type: 'text',
										text: "你不投我不投，资源何时能出头。",
										size: 10,
										color: '#000',
										fontWeight: 'bold',
										dx: uni.upx2px(48),
										dy: uni.upx2px(745),
									},
									{
										type: 'text',
										text: "你一瓶我一罐，分类回收把钱换。",
										size: 10,
										color: '#000',
										fontWeight: 'bold',
										dx: uni.upx2px(48),
										dy: uni.upx2px(790),
									},
									{
										type: 'roundFillRect',
										backgroundColor: 'rgba(255,255,255,0.5)',
										width: uni.upx2px(550),
										height: uni.upx2px(160),
										dy: uni.upx2px(685),
										dx: uni.upx2px(28),
										r:uni.upx2px(20)
									},
									{
										type: 'image',
										url: this.QRCode,
										dx: width - qrcodeSize - dx,
										dy: titleHeight,
										dWidth: uni.upx2px(140), // 因为设置了圆形图片 所以要乘以2
										dHeight: uni.upx2px(140),
										roundRectSet: {
											r: 200
										}
									}
								]);
							});
						},
						setCanvasWH: ({
							bgObj,
							type,
							bgScale
						}) => {
							// 为动态设置画布宽高的方法，
							this.poster = bgObj;
						}
					});
					this.posterImage = d.poster.tempFilePath;
					uni.hideLoading();
					this.$refs.uniPopup.open();
				} catch (e) {
					console.log(e);
					uni.hideLoading();
					uni.showToast({
						title: '生成失败',
						icon: 'none'
					});
				}
			},

			async buildQrcode() {
				uni.showLoading({
					title: '生成中...',
					mask: true
				});
				try {
					const qrcodeSize = uni.upx2px(444);

					const d = await getSharePoster({
						_this: this, //若在组件中使用 必传
						type: 'testShareType',
						posterCanvasId: 'default_PosterCanvasId', //canvasId
						delayTimeScale: 20, //延时系数
						background: {
							width: uni.upx2px(500),
							height: uni.upx2px(500),
							backgroundColor: '#FFF'
						},
						drawArray: ({
							bgObj,
							type,
							bgScale
						}) => {
							return new Promise((rs, rj) => {
								rs([{
									type: 'image',
									url: '/static/home/66.png',
									dx: uni.upx2px(447),
									dy: uni.upx2px(700),
									dWidth: uni.upx2px(137), // 因为设置了圆形图片 所以要乘以2
									dHeight: uni.upx2px(137),
									roundRectSet: {
										r: uni.upx2px(68)
									}
								}]);
							});
						},
						setCanvasWH: ({
							bgObj,
							type,
							bgScale
						}) => {
							// 为动态设置画布宽高的方法，
							this.poster = bgObj;
						}
					});
					this.posterImage = d.poster.tempFilePath;
					uni.hideLoading();
					this.$refs.uniPopup.open();
				} catch (e) {
					uni.hideLoading();
					uni.showToast({
						title: '生成失败',
						icon: 'none'
					});
				}
			},

			saveImg() {
				uni.saveImageToPhotosAlbum({
					filePath: this.posterImage,
					success:(res)=> {
						uni.showToast({
							icon: 'none',
							title: '保存成功'
						})
						this.hidePopup()
					},
					fail() {}
				});
			}
		}
	};
</script>

<style lang="scss">
	.hideCanvasView {
		position: relative;
	}

	.hideCanvas {
		position: fixed;
		top: -99999upx;
		left: -99999upx;
		z-index: -99999;
	}

	.posterImage {
		width: 600rpx;
		height: 875rpx;
		border-radius: 50rpx;
	}

	.btn-down {
		width: 249rpx;
		height: 80rpx;
		background-color: transparent;
		border-radius: 40rpx;
		border: solid 2px #ffffff;
		line-height: 80rpx;
		font-size: 32rpx;
		color: #ffffff;
	}
</style>
