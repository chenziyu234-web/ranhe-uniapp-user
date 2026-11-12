<template>
	<view>
		<view class="bg-white padding-row-30">
			<u-form-item label="联系人" label-width="200" :label-style="labelStyle">
				<u-input v-model="form.recipientName" placeholder="请输入姓名"
					placeholderStyle="color:#818287,fontSize:28rpx" />
			</u-form-item>

			<u-form-item label="手机号码" label-width="200" :label-style="labelStyle">
				<u-input maxlength="11" type="number" v-model="form.recipientPhone" placeholder="请填写联系人手机号"
					placeholderStyle="color:#818287,fontSize:28rpx" />
			</u-form-item>
			<u-form-item label="选择地区" label-width="200" :label-style="labelStyle">
				<view class="u-flex-1">
					<view class="width-100 u-flex u-row-between" @click="openLoction">
						<view class="u-flex">
							<view v-if="form.fullAddress">{{form.fullAddress}}</view>
							<view style="color:#818287;fontSize:28rpx;" v-else>请选择地区</view>
						</view>
						<u-icon name="/pagesMy/static/addicon.png" size="30"></u-icon>
					</view>
				</view>
			</u-form-item>
			<u-form-item label="详细地址" label-width="200" :label-style="labelStyle">
				<u-input style="" v-model="form.recipientAddress" placeholder="请输入详细地址(如:6栋501)"
					placeholderStyle="color:#818287,fontSize:28rpx" />
			</u-form-item>
		</view>

		<view class="bg-white padding-row-30 u-m-t-20">
			<u-form-item label="设为默认" label-width="200" :label-style="labelStyle">
				<template v-slot:right>
					<u-switch v-model="checked" :active-color="themeColor"></u-switch>
				</template>
			</u-form-item>
		</view>
		<view class="btn" @click="$u.throttle(submit,500)">保存</view>
		<view v-if="type == 'edit'" class="btn1" @click="deleteItem()">删除</view>
	</view>
</template>

<script>
	import {
		addressDetail,
		addressEdit,
		addressDelete
	} from '@/api/index.js'
	import {
		commonLocation
	} from "@/api/public.js"
	export default {
		data() {
			return {
				labelStyle: {
					color: '#999999',
					fontWeight: 'bold',
				},
				form: {
					province: "",
					city: "",
					county: "",
					id: '',
					recipientName: '',
					recipientPhone: '',
					recipientAddress: '',
					isDefault: '', //0否 1是
					fullAddress: '',
					lon: '',
					lat: ''
				},
				type: 'add', //edit 编辑  add添加
				checked: false,
				dataSource: {},
				uPickerBool: false
			}
		},
		onLoad(options) {
			if (options.type) {
				this.type = options.type
				let navTitle = ""
				if (options.type === 'edit') {
					this.addressDetail(options.id)
					navTitle = "编辑地址"
				} else if (options.type === 'add') {
					navTitle = "添加地址"
				}
				uni.setNavigationBarTitle({
					title: navTitle
				})
			}
		},
		methods: {
			openLoction() {
				// this.checkLocation(() => {
				wx.chooseLocation({
					success: (res) => {
						console.log(res);
						this.form.recipientAddress = res.name
						this.form.lon = res.longitude
						this.form.lat = res.latitude
						commonLocation({
							location: res.latitude + ',' + res.longitude
						}).then(res2 => {
							this.form.province = res2.data.province
							this.form.city = res2.data.city
							this.form.county = res2.data.district
							this.form.fullAddress = res2.data.province + res2.data.city +
								res2.data.district
						})
					}
				})
				// })
			},
			addressDetail(id) {
				addressDetail({
					id: id
				}).then(res => {
					this.form = res.data
					this.form.fullAddress = this.form.province + this.form.city + this.form.county
					this.checked = this.form.isDefault == 1 ? true : false
				})
			},
			deleteItem() {
				uni.showModal({
					title: '提示',
					content: '确认删除地址?',
					success: (res) => {
						if (res.confirm) {
							this.delAddress()
						}
					}
				})
			},
			delAddress() {
				addressDelete([this.form.id]).then(res => {
					this.$u.toast('删除成功!')
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				}).catch(e => {
					this.logError(e)
				})
			},
			changeAddress(e) { //微信小程序地址选择
				let list = e.detail.value
				this.form.fullAddress = list.join("")
				this.form.province = list[0]
				this.form.city = list[1]
				this.form.county = list[2]
			},

			submit() {
				if (this.$u.test.isEmpty(this.form.recipientName)) {
					uni.showToast({
						title: '请填写姓名',
						icon: 'none'
					})
					return
				}
				if (!this.$u.test.mobile(this.form.recipientPhone)) {
					uni.showToast({
						title: '请填写正确的手机号',
						icon: 'none'
					})
					return
				}
				if (this.$u.test.isEmpty(this.form.fullAddress)) {
					uni.showToast({
						title: '请选择地区',
						icon: 'none'
					})
					return
				}
				if (this.$u.test.isEmpty(this.form.recipientAddress)) {
					uni.showToast({
						title: '请填写详细地址',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '提交中~'
				})
				let obj = {
					...this.form,
					isDefault: this.checked ? 1 : 0,
				}
				addressEdit(obj).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack({})
					}, 800)
				})
			}
		}
	}
</script>
<style lang="scss">
	page {
		background: #F8f8f8;
	}

	.btn,
	.btn1 {
		width: 670rpx;
		height: 88rpx;
		line-height: 88rpx;
		background-color: $theme-color;
		color: white;
		border-radius: 44rpx;
		text-align: center;
		font-size: 28rpx;
		margin: 0 auto;
		margin-top: 30rpx;
	}

	.btn1 {
		background: none;
		border: solid 2px $theme-color;
		color: $theme-color
	}
</style>