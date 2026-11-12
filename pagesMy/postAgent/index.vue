<template>
	<view class="view-box">
		<form ref="form" >
			<view label="姓名" name="name" class="agentInput" >
				<view class="labelTxt">姓名:</view>
				<u-input v-model="form.name" placeholder="请输入姓名" />
			</view>
			<view label="手机号" name="phone" class="agentInput" >
				<view class="labelTxt">手机号:</view>
				<u-input v-model="form.phone" placeholder="请输入手机号" :maxlength="11" />
			</view>
			<view class="code-box" v-if="form.id == 0" label="验证码" >
				<view class="labelTxt">验证码:</view>
				<u-input v-model="form.smsCode" placeholder="请输入验证码" />
				<view class="get" @click="get()">
					{{!times?'获取验证码':times+'s'}}
				</view>
			</view>
			<view label="邮箱" name="email" class="agentInput" >
				<view class="labelTxt">邮箱:</view>
				<u-input v-model="form.email" placeholder="请输入邮箱" />
			</view>
			<view label="选择城市" name="city" class="agentInput" >
				<view class="labelTxt">选择城市:</view>
				<uni-data-picker v-model="form.city" :localdata="citys" placeholder="请选择柜机城市"  popup-title="请选择柜机城市"	:map="{text:'label',value:'value'}" style="border: none;" :clear-icon="false" border="false"></uni-data-picker>
			</view>
			<view label="代理意向" name="intention" class="agentInput">
				<view class="labelTxt">代理意向:</view>
				<uni-data-select v-model="form.intention" :localdata="range" :clear="false" class="noborder" style="width: 200rpx;" ></uni-data-select>
			</view>
		</form>
		<view v-if="form.id > 0" class="status-box ">
			<view class="agentInput">
				<view class="labelTxt">状态：</view>
				<view style="padding: 15rpx 0;">{{form.status == 1 ?'审核中':(form.status == 2 ?'审核通过':'审核驳回')}}</view>
			</view>
			<view class="agentInput" v-if="form.auditOpinion != ''">
				<view class="labelTxt">审核意见：</view>
				<view style="padding: 15rpx 0;">{{form.auditOpinion}}</view>
			</view>
			
		</view>
		<button v-if="form.status != 2" class="btn" type="primary" @click="submit()">{{form.id == 0?'提交申请':'修改申请'}}</button>
	</view>
</template>

<script>
	import {
		senSms,
		submitApply,
		submitApplyNo,
		getApplyInfo
	} from '@/api/index.js'
	import address from '../static/address.json'
	import uniDataPicker from '@/uni_modules/uni-data-picker/components/uni-data-picker/uni-data-picker.vue'
	// import storage from '@/utils/storage.js'
	// import vh from "vh-plugin";
	export default {
		components: {
			uniDataPicker
		},
		data() {
			return {
				form: {
					id: 0,
					name: '',
					phone: '',
					smsCode: '',
					email: '',
					city: '',
					intention: '',
					status: 0,
					audit_opinion: ''
				},
				timer: null,
				times: 0,
				rules: {
					// name: {
					// 	rules: [{
					// 		required: true,
					// 		errorMessage: '请输入姓名'
					// 	}]
					// },
					// phone: {
					// 	rules: [{
					// 		required: true,
					// 		errorMessage: '请输入手机号'
					// 	}]
					// },
					// smsCode: {
					// 	rules: [{
					// 		required: true,
					// 		errorMessage: '请输入验证码'
					// 	}]
					// },
					// email: {
					// 	rules: [{
					// 			required: true,
					// 			errorMessage: '请输入邮箱'
					// 		},
					// 		{
					// 			format: 'email',
					// 			errorMessage: '请输入正确的邮箱'
					// 		}
					// 	]
					// },
					// city: {
					// 	rules: [{
					// 		required: true,
					// 		errorMessage: '请选择柜机城市'
					// 	}]
					// },
					// intention: {
					// 	rules: [{
					// 		required: true,
					// 		errorMessage: '请选择代理意向'
					// 	}]
					// }
				},
				range: [{
						value: 1,
						text: "10W以下"
					},
					{
						value: 2,
						text: "20W以下"
					},
					{
						value: 3,
						text: "20W以上"
					},
				],
				citys: address,
				loading: false
			}
		},
		
		onLoad(e) {
			// if (e && e.i) {
			// 	this.getApplyData(e.i)
			// }
		},
		onShow() {
			var data = uni.getStorageSync('_member__user__info')
			if(data !== ''){
				// this.from.phone = data.mobile
				getApplyInfo({
					mobile: data.mobile
				}).then((res)=>{
					console.log(res,'resdata')
					this.from = Object.assign(this.form, res.data)
				})
			}
			console.log(this.from,'from')
		},
		methods: {
			get() {
				if (this.times > 0) {
					uni.showToast({
						title: '不能重复获取',
						icon: "none"
					});
					return;
				}

				if (!this.form.phone) {
					uni.showToast({
						title: '请填写手机号',
						icon: "none"
					});
					return;
				}

				var pattern = /1[3-9]\d{9}/
				if (!pattern.test(this.form.phone)) {
					uni.showToast({
						title: '请填写正确的手机号',
						icon: "none"
					});
					return;
				}

				senSms({
					mobile: this.form.phone,
					scene: '14'
				}).then((res) => {
					console.log(res)
					this.countdown(180)
				})
			},
			countdown(times) {
				if (times <= 0) return
				let that = this
				that.times = times
				that.timer = setInterval(function() {
					// storage.set('code', that.times)
					that.times--
					if (that.times < 1) {
						// storage.set('code', null)
						clearInterval(that.timer)
					}
				}, 1000)
			},
			// getApplyData(id) {
			// 	getApply({
			// 			id
			// 		}).then((response) => {
			// 			this.form = Object.assign(this.form, response.data);
			// 		})
			// },
			submit() {
				// this.$refs.form.validate().then(form => {
					if (this.loading) return
					this.loading = true
					// uni.showLoading()
					if(this.form.id > 0){
						submitApply(this.form).then((response) => {
							if(response.code == 200){
								// uni.hideLoading()
								this.loading = false
								uni.showToast({
									title: '提交成功'
								})
							}
								// uni.navigateTo({
								// 	url: '/pages/index/apply?i=' + response.data.id
								// })
							}).finally(() => {
								// uni.hideLoading()
								this.loading = false
							})
					}else{
						submitApplyNo(this.form).then((response) => {
							if(response.code == 200){
								// uni.hideLoading()
								this.loading = false
								uni.showToast({
									title: '提交成功'
								})
							}
								// uni.navigateTo({
								// 	url: '/pages/index/apply?i=' + response.data.id
								// })
							}).finally(() => {
								// uni.hideLoading()
								this.loading = false
							})
					}
					
				// }).catch(err => {
					// console.log('err', err);
				// })
			},
		}
	}
</script>
<style lang="scss">
	.view-box {
		height: calc(100vh - var(--window-top) - 100rpx);
		background: #f2f2f2;
		padding: 50rpx;
	}
	.uni-forms-item {
		background: #fff;
		padding: 15rpx 30rpx;
		border-radius: 10rpx;
	}
	
	.input-value-border {
		border: unset !important;
	}
	
	.uni-select {
		border: unset !important;
	}
	.agentInput{
		display: flex;
		background: #fff;
		padding: 10rpx 30rpx 10rpx 0;
		border: none;
		border-radius: 10rpx;
		margin-bottom: 25rpx;
		clear: both;
	}
	.labelTxt{
		width: 160rpx;
		font-size: 28rpx;
		color: #666;
		line-height: 70rpx;
		padding-right: 20rpx;
		text-align: right;
	}
	
	.status-box .labelTxt{
		// display: inline-block;
	}

	.code-box {
		background: #fff;
		display: flex;
		align-items: center;
		margin-bottom: 25rpx;
	}

	.get {
		padding: 10px 10px;
		color: #606266;
	}

	.btn {
		background-color: #00B3E0 !important;
		margin-top: 120rpx;
		border: none;
	}
	.btn::after{
		border: none;
	}
	.noborder{
		border: none;
	}
	.noborder .uni-select, .noborder .input-value-border{
		border: none !important;
	}
</style>