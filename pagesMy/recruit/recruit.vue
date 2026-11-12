<template>
	<view class="view-box">
		<form ref="form">
			<view label="姓名" name="actualName" class="agentInput">
				<view class="labelTxt">姓名:</view>
				<u-input v-model="form.actualName" placeholder="请输入姓名" />
			</view>
			<view label="手机号" name="mobile" class="agentInput">
				<view class="labelTxt">手机号:</view>
				<u-input v-model="form.mobile" placeholder="请输入手机号" :maxlength="11" />
			</view>
			<view label="企业名称" name="companyName" class="agentInput">
				<view class="labelTxt">商户名称:</view>
				<u-input v-model="form.companyName" placeholder="请输入商户名称" />
			</view>
			<view label="联系地址" name="address" class="agentInput">
				<view class="labelTxt">联系地址:</view>
				<u-input v-model="form.address" placeholder="请输入联系地址" />
			</view>
		</form>
		<view v-if="form.id > 0" class="status-box ">
			<view class="agentInput">
				<view class="labelTxt">状态：</view>
				<view style="padding: 15rpx 0;">{{form.status == 1 ?'审核中':(form.status == 2 ?'审核通过':'审核驳回')}}</view>
			</view>
			<view class="agentInput" v-if="form.auditRemark != '' && form.auditRemark != null">
				<view class="labelTxt">审核意见：</view>
				<view style="padding: 15rpx 0;">{{form.auditRemark}}</view>
			</view>

		</view>
		<button v-if="form.status != 2" class="btn" type="primary"
			@click="submit()">{{form.id == 0?'提交申请':'修改申请'}}</button>
	</view>
</template>

<script>
	import {
		UserApplyCreate,
		UserApplyGet
	} from '@/api/index.js'
	// import storage from '@/utils/storage.js'
	// import vh from "vh-plugin";
	export default {
		data() {
			return {
				form: {
					id: 0,
					actualName: '',
					mobile: '',
					companyName: '',
					address: '',
					status: 0,
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
			if (data !== '') {
				// this.from.phone = data.mobile
				UserApplyGet().then((res) => {
					console.log(res, 'resdata')
					this.from = Object.assign(this.form, res.data)
				})
			}
			console.log(this.from, 'from')
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
				if (!this.form.actualName) {
					uni.showToast({
						title: '请填写姓名',
						icon: "none"
					});
					return;
				}
				if (!this.form.mobile) {
					uni.showToast({
						title: '请填写手机号',
						icon: "none"
					});
					return;
				}
				if (!this.form.companyName) {
					uni.showToast({
						title: '请填写公司名称',
						icon: "none"
					});
					return;
				}
				if (!this.form.address) {
					uni.showToast({
						title: '请填写联系地址',
						icon: "none"
					});
					return;
				}
				var pattern = /1[3-9]\d{9}/
				if (!pattern.test(this.form.mobile)) {
					uni.showToast({
						title: '请填写正确的手机号',
						icon: "none"
					});
					return;
				}
				// this.$refs.form.validate().then(form => {
				if (this.loading) return
				this.loading = true
				// uni.showLoading()
				UserApplyCreate(this.form).then((response) => {
					if (response.code == 200) {
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

	.agentInput {
		display: flex;
		background: #fff;
		padding: 10rpx 30rpx 10rpx 0;
		border: none;
		border-radius: 10rpx;
		margin-bottom: 25rpx;
		clear: both;
	}

	.labelTxt {
		width: 160rpx;
		font-size: 28rpx;
		color: #666;
		line-height: 70rpx;
		padding-right: 20rpx;
		text-align: right;
	}

	.status-box .labelTxt {
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

	.btn::after {
		border: none;
	}

	.noborder {
		border: none;
	}

	.noborder .uni-select,
	.noborder .input-value-border {
		border: none !important;
	}
</style>