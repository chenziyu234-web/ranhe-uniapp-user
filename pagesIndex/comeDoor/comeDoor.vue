<template>
	<view>
		<view class="nav-view u-flex">
			<text class="u-m-r-10">*</text>
			30kg以上可预约上门
		</view>
		<view class="content">
			<view class="title-view">
				<view class="u-flex">
					<view class="title-icon"></view>
					回收种类
				</view>
				<!-- <view>合肥市包河区绿地瀛海</view> -->
			</view>
			<checkbox-group @change="checkboxChange">
				<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in list" :key="item.id">
					<view class="item">
						<view>
							<checkbox color="#2A9F4E" style="transform: scale(0.8);" :value="item.id"
								:checked="item.id == query.recycleTypeIds[index]" />
							<text>{{item.name}}</text>
						</view>
						<view><text
								style="color: #ff7f3f;">{{userInfo.roleType==1?item.price:item.companyPrice}}</text>元/{{item.unit}}
						</view>
					</view>
				</label>
			</checkbox-group>
		</view>
		<view class="btn-view">
			<view class="item" @click="radioChange" :class="query.needBag == '1' ? 'actives' : ''">
				<image src="/static/12.png" mode="widthFix" v-if="query.needBag=='2'"></image>
				<u-icon v-else name="checkmark-circle-fill" size="36"
					:color="themeColor"></u-icon>
				<text class="color-666 u-m-l-16">是否需要绳子或袋子(无额外收费)</text>
			</view>
			<view class="btn-info">
				<!--  :value="preWeightIndex" -->
				<picker :range="lists" range-key="label" @change="bindChange">
					<view class="button">一键下单</view>
				</picker>
				<view>已选品类：{{query.recycleTypeIds.length || 0}}件</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		recycleOrdertypeList,
	} from '@/api/index.js'
	export default {
		data() {
			return {
				list: [], //回收种类
				query: {
					tenantId:null,
					addressId: null, //地址id
					preWeight: null, //预估重量	”10-20“
					preTime: null, //预约上门时间	”2022-08-09 12：00“
					remarks: '', //备注	”东西很杂，需要分拣“
					enterDoor: null, //是否需要进门	
					needBag: '2', //是否需要袋子或绳子	
					recycleTypeIds: [], //多选类型
					recycleType: [] //暂存类型信息，页面展示使用，下单时删除
				},
				pickerValue: [0, 0, 0], //重量范围选择初始值
				lists: [
					{
						label: '30~50公斤',
						value: '30-50'
					},
					{
						label: '50~100公斤',
						value: '50-100'
					},
					{
						label: '100~200公斤',
						value: '100-200'
					},
					{
						label: '200公斤以上',
						value: '200-0'
					},
				]
			}
		},
		computed: {
			order() { //存在
				return this.$store.state.user.recycleOrder || {} //SET_RECYCLEORDER
			},
			preWeightIndex(){
				let index = this.lists.findIndex(item=>{
					return item.value == this.query.preWeight
				})
				return [index]
			}
		},
		onLoad() {
			this.query = this.order
			console.log(this.query)
			this.getList()
		},
		onReady() {
			console.log(this.preWeightIndex);
		},
		methods: {
			bindChange(e) { //一键下单
				this.query.preWeight = this.lists[Number(e.detail.value)].value
				if (this.query.recycleTypeIds.length <= 0) return this.$u.toast('请选择回收种类')
				this.$store.commit('user/SET_RECYCLEORDER', this.query)
				uni.navigateTo({
					url: '../comeDoorOrder/comeDoorOrder'
				})
			},

			radioChange() { //是否需要绳子
				this.query.needBag = this.query.needBag == '2' ? '1' : '2'
			},
			checkboxChange(e) { //选择回收种类
				let value = e.detail.value
				this.query.recycleTypeIds = value //下单需要数据
				let list = []
				if (value.length > 0) { //防止无数据报错
					for (let i = 0; i < this.list.length; i++) {
						for (let j = 0; j < value.length; j++) {
							if (value[j] == this.list[i].id) {
								list.push(this.list[i])
							}
						}
					}
					this.query.recycleType = list
				}
			},
			getList() { //获取回收分类
				recycleOrdertypeList({
					pageNum: 1,
					pageSize: 100,
					tenantId:this.query.tenantId
				}).then(res => {
					this.list = res.rows
				})
			},

		}
	}
</script>

<style lang="scss">
	.btn-view {
		position: fixed;
		bottom: 0;
		width: 100%;
		padding: 0rpx 0rpx 80rpx;
		background-color: #fff;

		.item {
			display: flex;
			align-items: center;
			width: 100%;
			height: 98rpx;
			background-color: #f2f2f2;
			border-radius: 8rpx;
			padding: 20rpx;

			image {
				width: 32rpx;
				height: 32rpx;
			}
		}

		.actives {
			color: $theme-color;
		}

		.btn-info {
			display: flex;
			align-items: center;
			flex-direction: row-reverse;
			padding: 10rpx 30rpx;

			.button {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 200rpx;
				height: 70rpx;
				background-color: $theme-color;
				box-shadow: 0rpx 6rpx 12rpx 0rpx #e1e1e1;
				border-radius: 44rpx;
				color: #fff;
				margin-left: 20rpx;
			}
		}
	}

	.content {
		width: 100%;
		padding: 30rpx;
		padding-bottom: 400rpx;

		.title-view {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.title-icon {
				width: 10rpx;
				height: 30rpx;
				background-color: $theme-color;
				border-radius: 10rpx;
				margin-right: 10rpx;
			}
		}

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			height: 102rpx;
			background-color: #f2f2f2;
			border-radius: 8rpx;
			margin-top: 20rpx;
			padding: 20rpx;
		}
	}

	.nav-view {
		width: 100%;
		height: 98rpx;
		background-color: #f2f2f2;
		color: #ff7f3f;
		padding-left: 30rpx;
	}
</style>
