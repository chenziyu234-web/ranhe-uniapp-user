import http from '@/common/utils/request.js'
//首页

// 获取登录接口
export function getLogin(data = {
	noToken: true
}) {
	return http.request({
		url: '/login/login',
		method: 'POST',
		data
	})
}

// 投过的回收/附近站点机...列表
export function getDeliverList(data) {
	return http.request({
		url: '/api/user/equipment/get-deliver-list',
		method: 'POST',
		data
	})
}
// 投过的回收/附近站点机..详情
export function getDeliverDetail(data) {
	return http.request({
		url: '/api/user/equipment/detail',
		method: 'GET',
		data
	})
}
// 设备运营通知
export function DeliverSubscribe(data) {
	return http.request({
		url: '/api/user/equipment/subscribe',
		method: 'POST',
		data
	})
}
//获取活动列表
export function getActivityList(data) {
	return http.request({
		url: '/api/user/member/getActivityList',
		method: 'POST',
		data
	})
}

//获取会员活动列表及排行详情
export function getActivityListWithInfo(data) {
	return http.request({
		url: '/api/user/member/getActivityListWithInfo',
		method: 'POST',
		data
	})
}

//增加浏览量
export function activityView(data) {
	return http.request({
		url: '/api/user/member/activityView',
		method: 'POST',
		data
	})
}

//查看浏览量
export function activityViewTotal(data) {
	return http.request({
		url: '/api/user/member/activityViewTotal',
		method: 'POST',
		data
	})
}

//活动弹窗
export function getAdByPosition(data) {
	return http.request({
		url: '/api/user/home/getAdByPosition',
		method: 'POST',
		data
	})
}

//活动报名
export function activityApply(data) {
	return http.request({
		url: '/api/user/member/activityApply',
		method: 'POST',
		data
	})
}

// 环保账单排名
export function billMemberTotal(data) {
	return http.request({
		url: '/api/user/equipment-deliver/bill-member-total',
		method: 'POST',
		data
	})
}
// 环保账单页面统计
export function memberbillTotal(data) {
	return http.request({
		url: '/api/user/member/bill-total',
		method: 'GET',
		data
	})
}
// 账单明细(投递记录)
export function memberDeliveryList(data) {
	return http.request({
		url: '/api/user/member/delivery-list',
		method: 'POST',
		data
	})
}
// 小程序码
export function appletCode(data) {
	return http.request({
		url: '/api/user/member/applet-code',
		method: 'GET',
		data
	})
}
// 被点赞记录
export function likeMemberList(data) {
	return http.request({
		url: '/api/user/member/like-member-list',
		method: 'POST',
		data
	})
}
// 点赞会员
export function likeMember(data) {
	return http.request({
		url: '/api/user/member/like-member',
		method: 'GET',
		data
	})
}
// 消息类型列表
export function messageTypes(data) {
	return http.request({
		url: '/api/user/member/message/types',
		method: 'GET',
		data
	})
}
// 消息列表
export function messageList(data) {
	return http.request({
		url: '/api/user/member/message/list',
		method: 'POST',
		data
	})
}
// 单页内容
export function contentpage(data) {
	return http.request({
		url: '/contentpage/get',
		method: 'POST',
		data
	})
}
// 文章列表
export function newsList(data) {
	return http.request({
		url: '/api/news/list',
		method: 'POST',
		data
	})
}
// 文章详情
export function newsGet(data) {
	return http.request({
		url: '/api/news/get',
		method: 'GET',
		data
	})
}
// 轮播图列表
export function bannerList(data) {
	return http.request({
		url: '/api/banner/list',
		method: 'POST',
		data
	})
}

// 发送指令(扫码开门)
export function sendCommand(data) {
	return http.request({
		url: '/api/user/equipment/sendCommand',
		method: 'POST',
		data
	})
}
// 禁投物品列表
export function equipmentWaste(data) {
	return http.request({
		url: '/api/user/equipment/waste',
		method: 'POST',
		data
	})
}
// 点击开门【发送真正开门指令】
export function sendOpen(data) {
	return http.request({
		url: '/api/user/equipment/sendOpen',
		method: 'POST',
		data
	})
}
// 点击关门
export function sendClose(data) {
	return http.request({
		url: '/api/user/equipment/sendClose',
		method: 'POST',
		data
	})
}
// 投口选择
export function equipmentOutlet(data) {
	return http.request({
		url: '/api/user/equipment/outlet',
		method: 'GET',
		data
	})
}
//获取投递订单信息
export function getResult(data) {
	return http.request({
		url: '/api/user/equipment/getSendResult',
		method: 'GET',
		data
	})
}
//获取活动信息
export  function getActive(data){
	return http.request({
		url: '/api/user/member/getActivityInfo',
		method: 'POST',
		data
	})
}


// 地址列表
export function addressList(data) {
	return http.request({
		url: '/api/member/address/list',
		method: 'POST',
		data
	})
}
// 地址详情
export function addressDetail(data) {
	return http.request({
		url: '/api/member/address/get',
		method: 'POST',
		data
	})
}
// 添加/编辑
export function addressEdit(data) {
	return http.request({
		url: '/api/member/address/update',
		method: 'POST',
		data
	})
}
// 删除地址
export function addressDelete(data) {
	return http.request({
		url: '/api/member/address/delete',
		method: 'POST',
		data
	})
}



// 商品列表
export function goodsProductList(data) {
	return http.request({
		url: '/api/goods-product/list',
		method: 'POST',
		data
	})
}
// 商品分类列表
export function goodsCategoryList(data) {
	return http.request({
		url: '/api/goods-product/category-list',
		method: 'POST',
		data
	})
}
// 商品详情
export function goodsDetail(data) {
	return http.request({
		url: '/api/goods-product/get',
		method: 'POST',
		data
	})
}



// 创建订单
export function orderCreate(data) {
	return http.request({
		url: '/api/order/create',
		method: 'POST',
		data
	})
}
// 订单列表
export function orderList(data) {
	return http.request({
		url: '/api/order/list',
		method: 'POST',
		data
	})
}

// 订单详情
export function orderDetail(data) {
	return http.request({
		url: '/api/user/member/delivery-detail',
		method: 'GET',
		data
	})
}
// 取消订单
export function orderCancel(data) {
	return http.request({
		url: '/api/order/cancel',
		method: 'POST',
		data
	})
}
// 确认收货
export function orderConfirm(data) {
	return http.request({
		url: '/api/order/confirm-receipt',
		method: 'POST',
		data
	})
}





// 发布分类列表
export function categoryList(data) {
	return http.request({
		url: '/api/publish/category-list',
		method: 'POST',
		data
	})
}
// 发布商品列表
export function goodsList(data) {
	return http.request({
		url: '/api/publish/goods-list',
		method: 'POST',
		data
	})
}
// 买家留言列表
export function msgList(data) {
	return http.request({
		url: '/api/publish/message-list',
		method: 'POST',
		data
	})
}
// 发布商品详情
export function goodDetail(data) {
	return http.request({
		url: '/api/publish/goods-detail',
		method: 'POST',
		data
	})
}
// 发布/修改商品
export function goodsUpdate(data) {
	return http.request({
		url: '/api/publish/goods-update',
		method: 'POST',
		data
	})
}
// 买家留言
export function msgLeave(data) {
	return http.request({
		url: '/api/publish/message-leave',
		method: 'POST',
		data
	})
}
// 同意售卖
export function msgAgreeSell(data) {
	return http.request({
		url: '/api/publish/message-agree-sell',
		method: 'POST',
		data
	})
}
// 删除发布商品
export function goodDelete(data) {
	return http.request({
		url: '/api/publish/goods-delete',
		method: 'POST',
		data
	})
}
// 我发布的商品列表
export function myGoodList(data) {
	return http.request({
		url: '/api/publish/goods-my-list',
		method: 'POST',
		data
	})
}
// 设置发布商品状态
export function setStatus(data) {
	return http.request({
		url: '/api/publish/set-status',
		method: 'POST',
		data
	})
}





// 回收管理
// 创建订单
export function recycleOrderCreate(data) {
	return http.request({
		url: '/api/user/recycle-order/create',
		method: 'POST',
		data
	})
}
// 订单列表
export function recycleOrderList(data) {
	return http.request({
		url: '/api/user/recycle-order/list',
		method: 'POST',
		data
	})
}
// 订单列表详情
export function recycleOrderDetail(data) {
	return http.request({
		url: '/api/user/recycle-order/get',
		method: 'POST',
		data
	})
}
// 删除订单
export function recycleOrderDelete(data) {
	return http.request({
		url: '/api/user/recycle-order/delete',
		method: 'POST',
		data
	})
}
// 取消订单
export function recycleOrderCancel(data) {
	return http.request({
		url: '/api/user/recycle-order/cancel',
		method: 'POST',
		data
	})
}
// 回收类型列表
export function recycleOrdertypeList(data) {
	return http.request({
		url: '/api/user/recycle-order/type-list',
		method: 'POST',
		data
	})
}













// 申请商户
export function UserApplyCreate(data) {
	return http.request({
		url: '/api/user/member-apply/create',
		method: 'POST',
		data
	})
}
// 申请商户的详情
export function UserApplyGet(data) {
	return http.request({
		url: '/api/user/member-apply/get',
		method: 'POST',
		data
	})
}




// 中转站列表
export function stationList(data) {
	return http.request({
		url: '/api/user/station/list',
		method: 'POST',
		data
	})
}

// 中转站详情
export function stationDetail(data) {
	return http.request({
		url: '/api/user/station/get',
		method: 'POST',
		data
	})
}

// 获取宣传员推广图
export function xuanChaunCodeApi(data) {
	return http.request({
		url: '/api/user/member/publicity-code',
		method: 'GET',
		data
	})
}

// 绑定宣传员
export function bindPublicityApi(data) {
	return http.request({
		url: '/api/user/member/bindPublicity',
		method: 'POST',
		data
	})
}
// 推广配置
export function publicityConfigApi() {
	return http.request({
		url: '/api/user/member/getPublicConfig',
		method: 'GET'
	})
}
// 推广记录/奖励记录
export function publicityListApi(data) {
	return http.request({
		url: '/api/user/member/publicity-list',
		method: 'POST',
		data
	})
}
// 推广统计
export function publicityDataApi(data) {
	return http.request({
		url: '/api/user/member/publicity-data',
		method: 'POST',
		data
	})
}
//发送短信验证码
export function senSms(data) {
	return http.request({
		url: '/api/common/send-code',
		method: 'POST',
		data
	})
}

//申请代理商无登录态
export function submitApplyNo(data) {
	return http.request({
		url: '/api/agent/agentApply/submitApply',
		method: 'POST',
		data
	})
}
//申请代理商登录态
export function submitApply(data) {
	return http.request({
		url: '/api/agent/agentApply/memberSubmitApply',
		method: 'POST',
		data
	})
}
//查询是否申请过代理商
export function getApplyInfo(data) {
	return http.request({
		url: '/api/agent/agentApply/getApplyInfo',
		method: 'GET',
		data
	})
}

//获取代理商账户信息
export function getAccount(data) {
	return http.request({
		url: '/api/agent/getAccount',
		method: 'GET',
		data
	})
}

//获取代理商账号提现规则
export function getWallet(data) {
	return http.request({
		url: '/api/agent/getWallet',
		method: 'GET',
		data
	})
}

//分页代理商余额明细列表
export function agentbillsList(data) {
	return http.request({
		url: '/api/agent/billsList',
		method: 'GET',
		data
	})
}

//分页代理商设备列表
export function deviceList(data) {
	return http.request({
		url: '/api/agent/deviceList',
		method: 'GET',
		data
	})
}

//代理商密码修改
export function updatePwd(data) {
	return http.request({
		url: '/api/agent/updatePwd',
		method: 'GET',
		data
	})
}
//代理商发起提现
export function withdraw(data) {
	return http.request({
		url: '/api/agent/withdraw',
		method: 'POST',
		data
	})
}
//分页代理商提现列表
export function withdrawList(data) {
	return http.request({
		url: '/api/agent/withdrawList',
		method: 'GET',
		data
	})
}
//获取上门回收业务开启状态
export function getRecycleStatus(data) {
	return http.request({
		url: '/api/user/equipment/getRecycleStatus',
		method: 'POST',
		data
	})
}
