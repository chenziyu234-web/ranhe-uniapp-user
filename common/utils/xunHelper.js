import config from '@/config.js'
const {
	baseURL,
	tokenTAG,
	userInfoTAG,
} = config
import store from "@/store";
//判断是否为空
function empty(value) {
	switch (typeof value) {
		case 'undefined':
			return true;
		case 'string':
			if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
			break;
		case 'boolean':
			if (!value) return true;
			break;
		case 'number':
			if (0 === value || isNaN(value)) return true;
			break;
		case 'object':
			if (null === value || value.length === 0) return true;
			for (var i in value) {
				return false;
			}
			return true;
	}
	return false;
}

/**
 * 判断url是否合法  不合法加上域名
 */
function detectUrl(url) {

	if (empty(url)) {
		return url
	}
	if (
		/^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)) {
		return url;
	} else {
		let buildurl = url ?
			baseURL.replace(/\/+$/, '') + '/' + url.replace(/^\/+/, '') :
			baseURL
		return buildurl;

	}
}

// 微信小程序 login 
function getWxLoginCode() {
	return new Promise((resolve, reject) => {
		uni.login({
			// #ifdef MP-WEIXIN
			provider: 'weixin',
			// #endif
			// #ifdef MP-ALIPAY
			provider: 'alipay',
			// #endif
			success(resCode) {
				resolve(resCode.code)
			},
			fail(e) {
				reject(e)
			}
		})
	});
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
function handleTree(data, id, parentId, children) {
	let config = {
		id: id || 'id',
		parentId: parentId || 'parentId',
		childrenList: children || 'children'
	};

	var childrenListMap = {};
	var nodeIds = {};
	var tree = [];

	for (let d of data) {
		let parentId = d[config.parentId];
		if (childrenListMap[parentId] == null) {
			childrenListMap[parentId] = [];
		}
		nodeIds[d[config.id]] = d;
		childrenListMap[parentId].push(d);
	}

	for (let d of data) {
		let parentId = d[config.parentId];
		if (nodeIds[parentId] == null) {
			tree.push(d);
		}
	}

	for (let t of tree) {
		adaptToChildrenList(t);
	}

	function adaptToChildrenList(o) {
		if (childrenListMap[o[config.id]] != null) {
			o[config.childrenList] = childrenListMap[o[config.id]];
		}
		if (o[config.childrenList]) {
			for (let c of o[config.childrenList]) {
				adaptToChildrenList(c);
			}
		}
	}
	return tree;
}

function backLogin() {
	let pages = getCurrentPages()
	let backIndex = -1
	let firstIndex = -1
	for (let i = 0; i < pages.length; i++) {
		if (pages[i].route.indexOf('login') != -1) {
			backIndex = i
			break
		}
	}
	if (backIndex == -1) {
		backIndex = 1
	} else {
		backIndex = (pages.length) - backIndex
	}
	uni.navigateBack({
		delta: backIndex,
	})
}


function tiemFormatTimestamp(time) {
	return new Date(time.replace(/-/g, '/')).valueOf();
}

// 机器状态返回文字
function useStatus(state,lineStatus=1) {
	if(lineStatus == 2) return '设备离线'
	// 1正常(可投递) 2即将满仓(可投递) 3已满仓(不可) 4即将运营(不可) 5机器故障(不可)
	if (state == 1 || state == 2) return '快去投递吧'
	if (state == 3) return '设备满仓'
	if (state == 4) return '即将运营'
	if (state == 5) return '机器故障'
}
// 机器状态返回文字
function useStatusBtn(state) {
	// 1正常(可投递) 2即将满仓(可投递) 3已满仓(不可) 4即将运营(不可) 5机器故障(不可)
	if (state == 1 || state == 2) return '请您前往投递'
	if (state == 3) return '清理后通知我'
	if (state == 4) return '运营后通知我'
	if (state == 5) return '修复后通知我'
}

// 返回克转千克
function weightK(val) {
	if (!val) {
		return '0'
	}
	return (val / 1000).toFixed(2)
}


//轮播图预览
function previewImage(index = 0, list) {
	if (list.length > 0 && typeof list[0] == 'object') {
		list = Array.from(Object.values(list));
	}
	list = list.map(item => {
		return detectUrl(item);
	});
	uni.previewImage({
		current: index,
		urls: list
	});
}

function toMap(obj) { //打开微信原生地图导航
	uni.openLocation({
		latitude: Number(obj.lat),
		longitude: Number(obj.lon),
		name: obj.name,
		address: obj.name,
		complete: (e) => {
			console.log(e);
		}
	})
}
function isLogin(){
	let loginStatus=store.getters.loginStatus||false
	if(!loginStatus){
		const token=uni.getStorageSync(tokenTAG)
		if(token){
			const info=uni.getStorageSync(userInfoTAG)
			if(info){
				loginStatus=true
			}
		}
	}
	return loginStatus
}



const xunHelper = {
	detectUrl,
	empty,
	backLogin,
	tiemFormatTimestamp,
	handleTree,
	getWxLoginCode,
	useStatusBtn,
	useStatus,
	weightK,
	toMap,
	previewImage,
	isLogin
}

const install = Vue => {
	// #ifdef VUE2
	Vue.prototype.xunHelper = xunHelper
	Vue.prototype.$xunHelper = xunHelper
	// #endif

	// #ifdef VUE3
	Vue.config.globalProperties.xunHelper = xunHelper
	Vue.config.globalProperties.$xunHelper = xunHelper
	// #endif
}

export default {
	install,
	xunHelper
}