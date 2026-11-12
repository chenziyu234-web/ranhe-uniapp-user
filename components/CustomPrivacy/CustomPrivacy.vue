<script setup>
	import {
		onMounted,
		ref
	} from "vue";
	import xunHelper from "../../common/utils/xunHelper";
	const emits = defineEmits([""]);
	const props = defineProps({
		title: {
			type: String,
			default: "用户隐私保护提示"
		},
		firstText: {
			type: String,
			default: "在您使用本产品服务之前，请仔细阅读"
		},
		lastText: {
			type: String,
			default: "如您同意，请点击“同意”开始使用。如您拒绝，某些产品服务将无法使用，具体无法使用的服务请阅读"
		},
		isHide: {
			type: Boolean,
			default: false
		},
		isAutomatic: {
			type: Boolean,
			default: false
		},
	});
	const popupRef = ref(null);
	const name = ref('《用户隐私保护提示》');
	// const resolvePrivacyAuthorization = () => {}
	function open() {
		popupRef.value.open()
	}

	function openRef() {
		if (needAuthorization.value) {
			popupRef.value.open()
		}
	}

	function close() {
		popupRef.value.close()
	}

	function refuse() {
		close()
	}

	function handleAgreePrivacyAuthorization() {
		// 用户点击同意按钮后
		// if (resolvePrivacyAuthorization) {
		// 	resolvePrivacyAuthorization({
		// 		buttonId: 'agree-btn',
		// 		event: 'agree'
		// 	})
		// }
		close()
		// props.isHide && uni.showTabBar()
	}

	function toOpenPrivacyContract() {
		wx.openPrivacyContract({
			success: () => {},
			fail: () => {},
			complete: () => {}
		})
	}
	const needAuthorization = ref(false)
	onMounted(() => {
		if (wx.onNeedPrivacyAuthorization) {
			wx.getPrivacySetting({
				success: res => {
					name.value = res.privacyContractName
					if (props.isAutomatic) {
						if (res.needAuthorization) {
							props.isHide && uni.hideTabBar()
							open()
						}
					} else {
						needAuthorization.value = res.needAuthorization
					}
					console.log("组件 getWxPrivacySetting success res", res)
				}
			})
			wx.onNeedPrivacyAuthorization((resolve) => {
				console.log(resolve);
				resolvePrivacyAuthorization = resolve
				open()
			})
		}
	})
	defineExpose({
		open,
		close,
		openRef
	})
</script>
<template>
	<uni-popup ref="popupRef" :isMaskClick="false">
		<view class="customPrivacy">
			<view class="customPrivacy-title">
				<view class="title-icon"></view>
				<view class="font-weight font-s32 u-m-l-12">{{ title }}</view>
			</view>
			<view style="padding: 0 20rpx;">
				<view class="p-col-30 font-s28" style="line-height: 60rpx;">
					<text>{{ firstText }}</text>
					<text @click="toOpenPrivacyContract" class="text-theme">{{ name }}</text>
					<text>{{ lastText }}</text>
					<text @click="toOpenPrivacyContract" class="text-theme">{{ name }}</text>。
				</view>
				<view class="customPrivacy-button">
					<button @tap="refuse" class="button text-theme">拒绝</button>
					<button class="button bg-theme text-white" id="agree-btn" open-type="agreePrivacyAuthorization"
						@agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
				</view>
			</view>
		</view>
	</uni-popup>
</template>
<style lang="scss">
	.customPrivacy {
		width: 590rpx;
		background-color: #ffffff;
		border-radius: 30rpx;
		padding: 40rpx 30rpx;

		&-button {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 20rpx;

			.button {
				width: 220rpx;
				margin: 0px !important;
				padding: 0px !important;
				font-size: 28rpx;
				line-height: 80rpx;

				&::after {
					border: none;
				}

				&:first-child {
					background-color: #e8e8e8;
				}
			}
		}

		&-title {
			display: flex;
			align-items: center;

			.title-icon {
				width: 45rpx;
				height: 45rpx;
				border-radius: 50%;
				background-color: #bfbfbf;
			}
		}
	}
</style>