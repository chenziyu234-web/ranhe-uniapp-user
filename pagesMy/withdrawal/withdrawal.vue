<template>
	<view>
		<view class="input">
			<view class="font-weight u-font-28 text-333333 u-p-b-30">提现金额(满<text>￥{{withdraw.minMoney}}可提现</text>)</view>
			<view class="u-flex u-p-t-30 pos-r">
				<text class="font-weight  u-m-r-10" style="font-size: 60rpx;">￥</text>
				<u-input placeholder="" @blur="changeInput" :focus="inputFocus" :customStyle="{fontSize:'60rpx',fontWeight:'bold'}"  maxlength="5" v-model="formData.amount" type="digit" />
				<text v-if="!formData.amount" class="u-font-26 text-666666" style="position: absolute;left: 80rpx;">请输入提现金额</text>
			</view>
			<view class="u-font-24 text-999999 u-p-t-20">当前可提现金额{{userInfo.nowMoney || 0}}元，<text style="color: #4E80FF;" @click="getAll">全部提现</text></view>
		</view>
		<view class="input u-p-30 color-999 ">
			<!-- <view class="text-333333 u-font-32 font-weight u-p-b-30">注意事项</view> -->
			<text class="u-font-24">注：单笔最低提现{{withdraw.minMoney}}元，每日最多提现5次；审核通过后1~3天内到账，请在提现记录中确认收款，到账以查询结果为准。</text>
		</view>
		<view class="fixedBtn">
			<view class="button" @click="submit"
				:style="{backgroundColor: formData.amount&&formData.amount!=0?'#4E80FF':''}">
				确认提现
			</view>
		</view>
	</view>
</template>

<script>
	import {
		withdraw
	} from '@/api/user.js'
	export default {
		data() {
			return {
				inputFocus: false,
				submitting: false,
				oldValue:0,
				typeList: [{
						label: '微信',
						value: 'we_chant',
						type: false
					},
					{
						label: '支付宝',
						value: 'ali',
						type: false
					},
					{
						label: '银行卡',
						value: 'back_card',
						type: false
					},
				],
				formData: {
					// #ifdef MP-WEIXIN
					accountType: 'we_chant',
					// #endif
					// #ifdef MP-ALIPAY
					accountType: 'ali',
					// #endif
					accountInfo: {
						bankcardCom: '',
						bankcardNum: '',
						bankcardName: '',
						aliAccount: '',
						aliName: ''
					},
					amount: ''
				}
			}
		},
		computed: {
			global() {
				return this.$store.state.settings.global || {}
			},
			withdraw() {
				return this.global.withdraw || {} //autoTransfer
			},
			publicityValidTime(){
				return this.global.system.publicityValidTime || 0
			}
		},
		onLoad() {
			this.typeList[0].type = this.withdraw.isWxCash
			this.typeList[1].type = this.withdraw.isAliCash
			this.typeList[2].type = this.withdraw.isCardCash
		},
		onReady() {
			this.triggerFocus()
		},
		onShow() {
			this.triggerFocus()
		},
		onHide() {
			if (this._focusTimer) clearTimeout(this._focusTimer)
			this.inputFocus = false
		},
		methods: {
			triggerFocus() {
				if (this._focusTimer) clearTimeout(this._focusTimer)
				this.inputFocus = false
				this._focusTimer = setTimeout(() => {
					this.inputFocus = true
					this._focusTimer = null
				}, 550)
			},
			changeInput(e){
				let val = Math.floor(this.formData.amount * 100) / 100
				if(val == 0 || val == '') {
					return
				}
				if(this.$u.test.isEmpty(val)){
				uni.showToast({
					title:'提现金额最多支持两位小数',
					icon:'none'
				})
				this.formData.amount = ''
			} else{
				this.formData.amount = val
			}
		},
		getAll(){
				this.formData.amount = this.userInfo.nowMoney || ''
			},
			radioChange(e) {
				this.formData.accountType = e.detail.value
			},
			toBack() {
				uni.navigateBack({})
			},
			submit() {
				if (this.submitting) return
				if(!this.$u.test.amount(this.formData.amount)){
					uni.showToast({
						title:'提现金额只支持两位小数',
						icon:'none'
					})
					return
				}
				if (!this.formData.amount) return
				if(this.formData.amount < this.withdraw.minMoney){
					const msg = "最低提现" + this.withdraw.minMoney + "元"
					uni.showToast({
						title: msg,
						icon:'error'
					})
					return
				}
				this.submitting = true
				uni.showLoading({
					title: '加载中',
					mask: true
				})
                withdraw(this.formData).then(() => {
                    uni.hideLoading()
                    uni.redirectTo({ url: '/pagesMy/withdrawalList/memberWithdrawalList' })
                }).catch(err => {
                    uni.hideLoading()
                    this.$u.toast((err && ((err.data && err.data.msg) || err.msg || err.message)) || '提现申请未确认，请先查看提现记录')
                }).finally(() => { this.submitting = false })
            }
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F6F7FB;
	}

	.nav {
		width: 100%;
		height: 386rpx;
		position: relative;
		background-color: #4E80FF;
		color: #FFF;

		.nav-bg {
			width: 100%;
			height: 540rpx;
			position: absolute;
			top: 0;
		}

	}

	.input {
		width: 100%;
		padding: 30rpx;
		background-color: #ffffff;
	}

	.button {
		width: 690rpx;
		height: 88rpx;
		background-color: #d7d9e6;
		border-radius: 50rpx;
		margin: auto;
		text-align: center;
		line-height: 88rpx;
		color: #fff;
		font-size: 32rpx;
		margin-top: 10rpx;
	}

	input {
		color: #000;
	}

	.fixedBtn{
		position: fixed;
		bottom: 0;
		height: 120rpx;
		background-color: #fff;
		width: 100%;
	}
</style>
