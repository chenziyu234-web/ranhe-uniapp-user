# 袋袋回收 - 完整接口文档

## 1. 项目概述

本文档描述了袋袋回收小程序项目的API接口结构、数据传递方式和使用规范。

## 2. 基础配置

### 2.1 服务器地址
- **测试环境**: `http://192.168.1.22:8121/`
- **生产环境**: `https://ddtapi.guangdongzexinzhinengkeji.com.cn/`

### 2.2 请求配置
- **请求库**: luch-request (基于uni-app的HTTP请求库)
- **请求拦截器**: 自动添加请求头 (clienttype, client, version, token)
- **响应拦截器**: 
  - 401状态码: 自动跳转登录页
  - 非200状态码: 显示错误提示

### 2.3 请求头参数
```javascript
{
  clienttype: 1,      // APP应用类型
  client: 'wechat',   // 客户端类型 (android/ios/wechat)
  version: '100',     // 版本号
  token: 'xxx'        // 登录令牌 (登录后自动添加)
}
```

### 2.4 响应格式
```javascript
// 成功响应
{
  code: 200,          // 状态码，200表示成功
  msg: "success",     // 提示信息
  data: {},           // 数据对象
  rows: [],           // 列表数据(部分接口)
  total: 100          // 总数(分页接口)
}

// 错误响应
{
  code: 401,          // 状态码
  msg: "token过期"    // 错误信息
}
```

### 2.5 分页参数格式
```javascript
// 请求参数
{
  pageNum: 1,         // 页码，从1开始
  pageSize: 10        // 每页数量
}

// 响应数据
{
  code: 200,
  data: [],           // 或 rows: []
  total: 100
}
```

---

## 3. 接口详细说明

### 3.1 用户认证模块 (user.js)

#### 3.1.1 登录接口
- **接口**: `POST api/user/auth/login`
- **函数**: `authLogin(data)`
- **参数**:
  ```javascript
  {
    scene: "wemini_auth_login",  // 场景标识
    weminiJsCode: "xxx"          // 微信登录code (wx.login获取)
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    msg: "登录成功",
    token: "xxx",                 // 登录令牌，需本地存储
    member: {
      id: 1,
      nickname: "用户昵称",
      avatar: "头像URL",
      mobile: "13800138000",
      nowMoney: 100.00,           // 可提现金额
      checkMoney: 50.00,          // 待审核金额
      likeNumber: 10,             // 被点赞数
      publicityFlag: 1,           // 是否为宣传员 1是 0否
      roleType: 1,                // 用户角色类型
      registerDays: 30,           // 注册天数
      deliverNumber: 50,          // 投递次数
      deliverWeight: 100.5,       // 投递重量(kg)
      deliverEquipment: 5         // 投递设备数
    }
  }
  ```

#### 3.1.2 注册接口
- **接口**: `POST /api/user/auth/register`
- **函数**: `authRegister(data)`
- **参数**:
  ```javascript
  // 手机验证码注册
  {
    scene: "mobile_code_register",
    mobile: "13800138000",        // 手机号
    smsCode: "123456",            // 短信验证码
    weminiJsCode: "xxx",          // 微信登录code
    promoterId: "",               // 推荐人ID (可选)
    runnerUserId: "",             // 地推人员ID (可选)
    uuid: ""                      // 设备标识 (扫码开门时传)
  }
  
  // 微信手机号快捷登录
  {
    scene: "wemini_mobile_register",
    weminiJsCode: "xxx",
    code: "xxx",                  // 手机号获取code
    iv: "xxx",                    // 加密向量
    encryptedData: "xxx",         // 加密数据
    promoterId: "",
    runnerUserId: "",
    uuid: ""
  }
  ```
- **返回**: 同登录接口

#### 3.1.3 获取用户信息
- **接口**: `GET /api/user/member/info`
- **函数**: `getInfo()`
- **参数**: 无
- **返回**:
  ```javascript
  {
    code: 200,
    data: {
      id: 1,
      nickname: "用户昵称",
      avatar: "头像URL",
      mobile: "13800138000",
      nowMoney: 100.00,
      checkMoney: 50.00,
      likeNumber: 10,
      publicityFlag: 1,
      roleType: 1
    }
  }
  ```

#### 3.1.4 获取我的页面数据
- **接口**: `GET /api/user/member/home-data`
- **函数**: `homeData()`
- **参数**: 无
- **返回**:
  ```javascript
  {
    code: 200,
    data: {
      nowMoney: 100.00,           // 可提现金额
      checkMoney: 50.00,          // 待审核金额
      deliverDays: 30,            // 投递天数
      deliverWeight: 100.5,       // 累计投递重量
      deliverNumber: 50,          // 投递次数
      integral: 1000              // 碳积分
    }
  }
  ```

#### 3.1.5 更新会员信息
- **接口**: `POST /api/user/member/edit`
- **函数**: `userEdit(data)`
- **参数**:
  ```javascript
  {
    nickname: "新昵称",           // 昵称 (可选)
    avatar: "头像URL",            // 头像 (可选)
    // 其他需要更新的字段
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    msg: "更新成功"
  }
  ```

#### 3.1.6 企业认证申请
- **接口**: `POST /api/user/member-apply/create`
- **函数**: `memberApplyCreate(data)`
- **参数**:
  ```javascript
  {
    companyName: "企业名称",
    contactName: "联系人",
    contactPhone: "联系电话",
    businessLicense: "营业执照URL"
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    msg: "提交成功"
  }
  ```

#### 3.1.7 企业认证详情
- **接口**: `POST /api/user/member-apply/get`
- **函数**: `memberApplyGet(data)`
- **参数**: 无
- **返回**:
  ```javascript
  {
    code: 200,
    data: {
      id: 1,
      status: 0,                  // 0待审核 1已通过 2已拒绝
      companyName: "企业名称",
      // ... 其他认证信息
    }
  }
  ```

---

### 3.2 首页模块 (index.js)

#### 3.2.1 获取轮播图
- **接口**: `POST /api/banner/list`
- **函数**: `bannerList(data)`
- **参数**:
  ```javascript
  {
    categoryId: 2                 // 轮播图分类ID
    // 1:首页轮播 2:首页 7:设备详情顶部 8:设备详情中部
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    rows: [
      {
        id: 1,
        image: "图片URL",
        link: "跳转链接",          // 可选
        sort: 1                   // 排序
      }
    ]
  }
  ```

#### 3.2.2 获取附近设备列表
- **接口**: `POST /api/user/equipment/get-deliver-list`
- **函数**: `getDeliverList(data)`
- **参数**:
  ```javascript
  {
    pageNum: 1,
    pageSize: 10,
    lon: 113.xxx,                 // 经度 (必填)
    lat: 23.xxx,                  // 纬度 (必填)
    isAsc: 'ascending',           // 排序方式
    orderByColumn: 'distance',    // 排序字段: distance/deliveryNumber
    distance: 10                  // 搜索距离(km)
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    msg: "10",                    // 设备总数
    data: [
      {
        id: 1,
        villageName: "小区名称",
        position: "具体位置",
        parentsName: "区域名称",
        lon: 113.xxx,
        lat: 23.xxx,
        distance: 1.5,            // 距离(km)
        distanceText: "1.5km",
        useStatus: 1,             // 使用状态 1空闲 2使用中 3故障 4停用
        lineStatus: 1,            // 在线状态 1在线 2离线
        deliveryNumber: 100,      // 投递次数
        memberDeliverNumber: 5,   // 当前用户投递次数
        memberDeliverWeight: 10.5,// 当前用户投递重量
        priceParam: [             // 价格参数
          {
            title: "纸类",
            price: 0.5,           // 元/kg
            unit: "kg"
          }
        ]
      }
    ]
  }
  ```

#### 3.2.3 获取设备详情
- **接口**: `GET /api/user/equipment/detail`
- **函数**: `getDeliverDetail(data)`
- **参数**:
  ```javascript
  {
    equipmentId: 1,               // 设备ID (必填)
    lon: 113.xxx,                 // 经度
    lat: 23.xxx                   // 纬度
  }
  ```
- **返回**: 同设备列表单条数据结构

#### 3.2.4 设备运营通知订阅
- **接口**: `POST /api/user/equipment/subscribe`
- **函数**: `DeliverSubscribe(data)`
- **参数**:
  ```javascript
  {
    equipmentId: 1,               // 设备ID
    channel: 2,                   // 订阅渠道 2:微信
    msgTypes: [                   // 订阅消息类型
      "aOckdf6SLxuJbNFvtgLetUtARes_upX3_jTeKTVEj-E",
      "UCaGRqgzimHVjA_QOfBjLnei9hZgTb4s4_Ml6iXzURw"
    ]
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    msg: "订阅成功"
  }
  ```

#### 3.2.5 扫码发送指令
- **接口**: `POST /api/user/equipment/sendCommand`
- **函数**: `sendCommand(data)`
- **参数**:
  ```javascript
  {
    eventType: "control_scan_success",  // 事件类型
    scanValue: "xxx",                   // 扫码内容 (设备二维码值)
    lon: 113.xxx,                       // 经度 (可选)
    lat: 23.xxx                         // 纬度 (可选)
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    msg: "指令发送成功",
    data: {
      uuid: "xxx",                // 设备UUID
      sn: "xxx"                   // 设备SN号
    }
  }
  ```

#### 3.2.6 开门指令
- **接口**: `POST /api/user/equipment/sendOpen`
- **函数**: `sendOpen(data)`
- **参数**:
  ```javascript
  {
    uuid: "xxx",                  // 设备UUID
    sn: "xxx"                     // 设备SN号
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    msg: "开门成功"
  }
  ```

#### 3.2.7 关门指令
- **接口**: `POST /api/user/equipment/sendClose`
- **函数**: `sendClose(data)`
- **参数**: 同开门指令
- **返回**:
  ```javascript
  {
    code: 200,
    msg: "关门成功"
  }
  ```

#### 3.2.8 投口选择
- **接口**: `GET /api/user/equipment/outlet`
- **函数**: `equipmentOutlet(data)`
- **参数**:
  ```javascript
  {
    uuid: "xxx"                   // 设备UUID
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    data: [
      {
        id: 1,
        name: "投口1",
        status: 1                 // 1可用 2不可用
      }
    ]
  }
  ```

#### 3.2.9 获取投递结果
- **接口**: `GET /api/user/equipment/getSendResult`
- **函数**: `getResult(data)`
- **参数**:
  ```javascript
  {
    uuid: "xxx"                   // 设备UUID
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    data: {
      orderSn: "订单号",
      totalPrice: 10.50,          // 总价
      weight: 5.2,                // 重量(kg)
      createTime: "2024-01-01 12:00:00",
      status: 1,                  // 状态
      items: [                    // 投递明细
        {
          typeName: "纸类",
          weight: 2.5,
          price: 0.5,
          amount: 1.25
        }
      ]
    }
  }
  ```

#### 3.2.10 禁投物品列表
- **接口**: `POST /api/user/equipment/waste`
- **函数**: `equipmentWaste(data)`
- **参数**:
  ```javascript
  {
    equipmentId: 1                // 设备ID
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    data: [
      {
        id: 1,
        name: "物品名称",
        image: "图片URL"
      }
    ]
  }
  ```

#### 3.2.11 获取上门回收状态
- **接口**: `POST /api/user/equipment/getRecycleStatus`
- **函数**: `getRecycleStatus(data)`
- **参数**:
  ```javascript
  {
    lon: 113.xxx,
    lat: 23.xxx,
    province: "广东省",
    city: "深圳市",
    district: "南山区",
    township: "粤海街道"
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    data: {
      tenantId: "xxx",            // 租户ID
      recycleOpen: true,          // 是否开启上门回收
      // 其他配置信息
    }
  }
  ```

#### 3.2.12 获取活动弹窗
- **接口**: `POST /api/user/home/getAdByPosition`
- **函数**: `getAdByPosition(data)`
- **参数**:
  ```javascript
  {
    adPosition: 'home'            // 广告位置: home首页
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    data: {
      id: 1,
      cover: "弹窗图片URL",
      type: 1,                    // 1:跳转小程序 2:跳转页面
      appId: "小程序appId",       // type=1时
      targetUrl: "跳转地址"       // 页面路径或小程序路径
    }
  }
  ```

---

### 3.3 活动模块

#### 3.3.1 获取活动列表
- **接口**: `POST /api/user/member/getActivityList`
- **函数**: `getActivityList(data)`
- **参数**: 分页参数
- **返回**:
  ```javascript
  {
    code: 200,
    data: [
      {
        id: 1,
        title: "活动标题",
        cover: "封面图URL",
        startTime: "2024-01-01",
        endTime: "2024-01-31",
        status: 1,                // 1进行中 2已结束
        viewCount: 100,           // 浏览量
        applyCount: 50            // 报名人数
      }
    ]
  }
  ```

#### 3.3.2 获取会员活动列表及排行详情
- **接口**: `POST /api/user/member/getActivityListWithInfo`
- **函数**: `getActivityListWithInfo(data)`
- **参数**: 分页参数 + 活动ID
- **返回**: 活动列表 + 排行信息

#### 3.3.3 活动报名
- **接口**: `POST /api/user/member/activityApply`
- **函数**: `activityApply(data)`
- **参数**:
  ```javascript
  {
    activityId: 1                 // 活动ID
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    msg: "报名成功"
  }
  ```

#### 3.3.4 获取活动信息
- **接口**: `POST /api/user/member/getActivityInfo`
- **函数**: `getActive(data)`
- **参数**:
  ```javascript
  {
    activityId: 1                 // 活动ID
  }
  ```
- **返回**: 活动详细信息

#### 3.3.5 增加浏览量
- **接口**: `POST /api/user/member/activityView`
- **函数**: `activityView(data)`
- **参数**:
  ```javascript
  {
    activityId: 1                 // 活动ID
  }
  ```

#### 3.3.6 查看浏览量
- **接口**: `POST /api/user/member/activityViewTotal`
- **函数**: `activityViewTotal(data)`
- **参数**:
  ```javascript
  {
    activityId: 1                 // 活动ID
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    data: {
      viewCount: 100              // 浏览量
    }
  }
  ```

---

### 3.4 环保账单模块

#### 3.4.1 环保账单排名
- **接口**: `POST /api/user/equipment-deliver/bill-member-total`
- **函数**: `billMemberTotal(data)`
- **参数**:
  ```javascript
  {
    month: "2024-01",             // 月份 (格式: YYYY-MM)
    sortField: "total_number"     // 排序字段: total_number投递次数 total_weight投递重量
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    selfRanking: 5,               // 我的排名
    total: {
      totalNumber: 50,            // 当月投递次数
      totalWeight: 100.5          // 当月投递重量(kg)
    },
    data: [                       // 排行榜数据
      {
        memberId: 1,
        nickname: "用户昵称",
        avatar: "头像URL",
        mobile: "138****8000",
        totalNumber: 100,         // 投递次数
        totalWeight: 200.5,       // 投递重量
        likeNumber: 0             // 是否已点赞 0否 1是
      }
    ]
  }
  ```

#### 3.4.2 环保账单页面统计
- **接口**: `GET /api/user/member/bill-total`
- **函数**: `memberbillTotal()`
- **参数**: 无
- **返回**:
  ```javascript
  {
    code: 200,
    data: {
      registerDays: 30,           // 加入天数
      deliverEquipment: 5,        // 投递地点数
      deliverNumber: 50,          // 累计投递次数
      deliverWeight: 100.5,       // 累计投递重量
      likeNumber: 10              // 被点赞数
    }
  }
  ```

#### 3.4.3 账单明细(投递记录)
- **接口**: `POST /api/user/member/delivery-list`
- **函数**: `memberDeliveryList(data)`
- **参数**:
  ```javascript
  {
    pageNum: 1,
    pageSize: 10,
    sendStatus: '1',              // 发送状态 (可选)
    status: '1'                   // 订单状态 (可选)
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    data: [
      {
        id: 1,
        orderSn: "订单号",
        totalPrice: 10.50,        // 金额
        weight: 5.2,              // 重量
        status: 1,                // 状态
        statusText: "审核中",
        createTime: "2024-01-01 12:00:00"
      }
    ]
  }
  ```

#### 3.4.4 投递详情
- **接口**: `GET /api/user/member/delivery-detail`
- **函数**: `orderDetail(data)`
- **参数**:
  ```javascript
  {
    id: 1                         // 投递ID
  }
  ```
- **返回**: 投递详细信息

---

### 3.5 账户与提现模块 (user.js)

#### 3.5.1 资金记录
- **接口**: `POST /api/user/member/bills/bills-list`
- **函数**: `billsList(data)`
- **参数**: 分页参数
- **返回**:
  ```javascript
  {
    code: 200,
    data: [
      {
        id: 1,
        category: 1,              // 分类 1资金 2提现
        categoryText: "投递收入",
        types: 1,                 // 类型 1收入 2支出
        changeMoney: 10.50,       // 变动金额
        currentMoney: 100.00,     // 当前余额
        publicityFlag: 0,         // 是否宣传员
        createTime: "2024-01-01 12:00:00"
      }
    ]
  }
  ```

#### 3.5.2 提现记录
- **接口**: `POST /api/user/member/bills/withdraw-list`
- **函数**: `withdrawList(data)`
- **参数**: 分页参数
- **返回**: 提现记录列表

#### 3.5.3 发起提现
- **接口**: `POST /api/user/member/bills/withdraw`
- **函数**: `withdraw(data)`
- **参数**:
  ```javascript
  {
    accountType: "we_chant",      // 提现方式: we_chant微信 ali支付宝 back_card银行卡
    amount: 50.00,                // 提现金额
    accountInfo: {                // 账户信息 (银行卡/支付宝时需要)
      bankcardCom: "银行名称",
      bankcardNum: "银行卡号",
      bankcardName: "持卡人姓名",
      aliAccount: "支付宝账号",
      aliName: "支付宝姓名"
    }
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    msg: "提现申请已提交",
    data: {
      amount: 50.00,              // 提现金额
      statusText: "审核中",       // 状态文本
      createTime: "2024-01-01 12:00:00"
    }
  }
  ```

#### 3.5.4 确认收款
- **接口**: `POST /api/user/member/bills/confirm-receipt`
- **函数**: `withdrawConfirmReceipt(data)`
- **参数**:
  ```javascript
  {
    id: 1                         // 提现记录ID
  }
  ```

#### 3.5.5 确认收款结果
- **接口**: `GET /api/user/member/bills/receipt-result`
- **函数**: `withdrawReceiptResult(data)`
- **参数**:
  ```javascript
  {
    id: 1                         // 提现记录ID
  }
  ```

#### 3.5.6 碳积分记录
- **接口**: `POST /api/user/member/integral/list`
- **函数**: `memberIntegralList(data)`
- **参数**: 分页参数
- **返回**: 碳积分记录列表

---

### 3.6 消息模块

#### 3.6.1 获取未读消息数
- **接口**: `GET /api/user/member/message/noReadCount`
- **函数**: `noReadCount()`
- **参数**: 无
- **返回**:
  ```javascript
  {
    code: 200,
    data: 5                       // 未读消息数
  }
  ```

#### 3.6.2 消息类型列表
- **接口**: `GET /api/user/member/message/types`
- **函数**: `messageTypes()`
- **参数**: 无
- **返回**: 消息类型列表

#### 3.6.3 消息列表
- **接口**: `POST /api/user/member/message/list`
- **函数**: `messageList(data)`
- **参数**: 分页参数 + 类型筛选
- **返回**: 消息列表

---

### 3.7 地址模块

#### 3.7.1 地址列表
- **接口**: `POST /api/member/address/list`
- **函数**: `addressList(data)`
- **参数**: 无
- **返回**:
  ```javascript
  {
    code: 200,
    data: [
      {
        id: 1,
        name: "收货人",
        mobile: "13800138000",
        province: "广东省",
        city: "深圳市",
        district: "南山区",
        address: "详细地址",
        isDefault: 1              // 是否默认 1是 0否
      }
    ]
  }
  ```

#### 3.7.2 地址详情
- **接口**: `POST /api/member/address/get`
- **函数**: `addressDetail(data)`
- **参数**:
  ```javascript
  {
    id: 1                         // 地址ID
  }
  ```
- **返回**: 地址详细信息

#### 3.7.3 添加/编辑地址
- **接口**: `POST /api/member/address/update`
- **函数**: `addressEdit(data)`
- **参数**:
  ```javascript
  {
    id: 1,                        // 地址ID (编辑时传，新增时不传)
    name: "收货人",
    mobile: "13800138000",
    province: "广东省",
    city: "深圳市",
    district: "南山区",
    address: "详细地址",
    isDefault: 1                  // 是否默认
  }
  ```

#### 3.7.4 删除地址
- **接口**: `POST /api/member/address/delete`
- **函数**: `addressDelete(data)`
- **参数**:
  ```javascript
  {
    id: 1                         // 地址ID
  }
  ```

---

### 3.8 商品模块

#### 3.8.1 商品列表
- **接口**: `POST /api/goods-product/list`
- **函数**: `goodsProductList(data)`
- **参数**: 分页参数 + 分类筛选
- **返回**: 商品列表

#### 3.8.2 商品分类列表
- **接口**: `POST /api/goods-product/category-list`
- **函数**: `goodsCategoryList(data)`
- **参数**: 无
- **返回**: 商品分类列表

#### 3.8.3 商品详情
- **接口**: `POST /api/goods-product/get`
- **函数**: `goodsDetail(data)`
- **参数**: 商品ID
- **返回**: 商品详细信息

---

### 3.9 订单模块

#### 3.9.1 创建订单
- **接口**: `POST /api/order/create`
- **函数**: `orderCreate(data)`
- **参数**: 商品信息、地址等

#### 3.9.2 订单列表
- **接口**: `POST /api/order/list`
- **函数**: `orderList(data)`
- **参数**: 分页参数 + 状态筛选

#### 3.9.3 取消订单
- **接口**: `POST /api/order/cancel`
- **函数**: `orderCancel(data)`
- **参数**: 订单ID

#### 3.9.4 确认收货
- **接口**: `POST /api/order/confirm-receipt`
- **函数**: `orderConfirm(data)`
- **参数**: 订单ID

---

### 3.10 发布商品模块

#### 3.10.1 发布分类列表
- **接口**: `POST /api/publish/category-list`
- **函数**: `categoryList(data)`
- **参数**: 无
- **返回**: 分类列表

#### 3.10.2 发布商品列表
- **接口**: `POST /api/publish/goods-list`
- **函数**: `goodsList(data)`
- **参数**: 分页参数

#### 3.10.3 我发布的商品列表
- **接口**: `POST /api/publish/goods-my-list`
- **函数**: `myGoodList(data)`
- **参数**: 分页参数

#### 3.10.4 发布商品详情
- **接口**: `POST /api/publish/goods-detail`
- **函数**: `goodDetail(data)`
- **参数**: 商品ID

#### 3.10.5 发布/修改商品
- **接口**: `POST /api/publish/goods-update`
- **函数**: `goodsUpdate(data)`
- **参数**: 商品信息对象

#### 3.10.6 删除发布商品
- **接口**: `POST /api/publish/goods-delete`
- **函数**: `goodDelete(data)`
- **参数**: 商品ID

#### 3.10.7 设置发布商品状态
- **接口**: `POST /api/publish/set-status`
- **函数**: `setStatus(data)`
- **参数**: 商品ID + 状态

#### 3.10.8 买家留言列表
- **接口**: `POST /api/publish/message-list`
- **函数**: `msgList(data)`
- **参数**: 商品ID + 分页参数

#### 3.10.9 买家留言
- **接口**: `POST /api/publish/message-leave`
- **函数**: `msgLeave(data)`
- **参数**: 商品ID + 留言内容

#### 3.10.10 同意售卖
- **接口**: `POST /api/publish/message-agree-sell`
- **函数**: `msgAgreeSell(data)`
- **参数**: 留言ID

---

### 3.11 回收订单模块

#### 3.11.1 创建回收订单
- **接口**: `POST /api/user/recycle-order/create`
- **函数**: `recycleOrderCreate(data)`
- **参数**:
  ```javascript
  {
    tenantId: "xxx",              // 租户ID
    addressId: "xxx",             // 地址ID
    preWeight: "30-50",           // 预估重量: 30-50/50-100/100-200/200-0
    preTime: "2024-01-01 12:00",  // 预约上门时间
    remarks: "备注信息",          // 备注
    enterDoor: 1,                 // 是否需要进门 1是 2否
    needBag: '2',                 // 是否需要袋子 1是 2否
    recycleTypeIds: [1, 2]        // 回收类型ID数组
  }
  ```

#### 3.11.2 回收订单列表
- **接口**: `POST /api/user/recycle-order/list`
- **函数**: `recycleOrderList(data)`
- **参数**: 分页参数

#### 3.11.3 回收订单详情
- **接口**: `POST /api/user/recycle-order/get`
- **函数**: `recycleOrderDetail(data)`
- **参数**: 订单ID

#### 3.11.4 删除回收订单
- **接口**: `POST /api/user/recycle-order/delete`
- **函数**: `recycleOrderDelete(data)`
- **参数**: 订单ID

#### 3.11.5 取消回收订单
- **接口**: `POST /api/user/recycle-order/cancel`
- **函数**: `recycleOrderCancel(data)`
- **参数**: 订单ID

#### 3.11.6 回收类型列表
- **接口**: `POST /api/user/recycle-order/type-list`
- **函数**: `recycleOrdertypeList(data)`
- **参数**:
  ```javascript
  {
    pageNum: 1,
    pageSize: 100,
    tenantId: "xxx"               // 租户ID
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    rows: [
      {
        id: 1,
        name: "纸类",
        price: 0.5,               // 个人价格
        companyPrice: 0.6,        // 企业价格
        unit: "kg",
        image: "分类图标URL"
      }
    ]
  }
  ```

---

### 3.12 推广模块

#### 3.12.1 获取推广配置
- **接口**: `GET /api/user/member/getPublicConfig`
- **函数**: `publicityConfigApi()`
- **参数**: 无
- **返回**:
  ```javascript
  {
    code: 200,
    data: {
      isTuiJian: true,            // 是否显示推荐功能
      // 其他配置
    }
  }
  ```

#### 3.12.2 绑定宣传员
- **接口**: `POST /api/user/member/bindPublicity`
- **函数**: `bindPublicityApi(data)`
- **参数**:
  ```javascript
  {
    publicityId: "xxx"            // 宣传员ID
  }
  ```

#### 3.12.3 获取推广码
- **接口**: `GET /api/user/member/publicity-code`
- **函数**: `xuanChaunCodeApi()`
- **参数**: 无
- **返回**: 推广码/小程序码

#### 3.12.4 推广记录/奖励记录
- **接口**: `POST /api/user/member/publicity-list`
- **函数**: `publicityListApi(data)`
- **参数**: 分页参数
- **返回**: 推广记录列表

#### 3.12.5 推广统计
- **接口**: `POST /api/user/member/publicity-data`
- **函数**: `publicityDataApi(data)`
- **参数**: 无
- **返回**: 推广统计数据

#### 3.12.6 推广图
- **接口**: `POST /api/user/member-poster/create`
- **函数**: `memberPosterCreate(data)`
- **参数**: 无
- **返回**: 推广海报图

#### 3.12.7 下级人员
- **接口**: `POST /api/user/member-poster/promoter`
- **函数**: `memberPromoter(data)`
- **参数**: 分页参数
- **返回**: 下级用户列表

#### 3.12.8 小程序码
- **接口**: `GET /api/user/member/applet-code`
- **函数**: `appletCode()`
- **参数**: 无
- **返回**: 小程序码图片

---

### 3.13 点赞模块

#### 3.13.1 被点赞记录
- **接口**: `POST /api/user/member/like-member-list`
- **函数**: `likeMemberList(data)`
- **参数**: 分页参数
- **返回**:
  ```javascript
  {
    code: 200,
    data: [
      {
        memberId: 1,
        nickname: "用户昵称",
        avatar: "头像URL",
        mobile: "138****8000",
        createTime: "2024-01-01 12:00:00"
      }
    ]
  }
  ```

#### 3.13.2 点赞会员
- **接口**: `GET /api/user/member/like-member`
- **函数**: `likeMember(data)`
- **参数**:
  ```javascript
  {
    memberId: 1                   // 被点赞用户ID
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    msg: "点赞成功"
  }
  ```

---

### 3.14 商户模块

#### 3.14.1 申请商户
- **接口**: `POST /api/user/member-apply/create`
- **函数**: `UserApplyCreate(data)`
- **参数**: 申请资料

#### 3.14.2 申请商户详情
- **接口**: `POST /api/user/member-apply/get`
- **函数**: `UserApplyGet(data)`
- **参数**: 无

---

### 3.15 中转站模块

#### 3.15.1 中转站列表
- **接口**: `POST /api/user/station/list`
- **函数**: `stationList(data)`
- **参数**: 分页参数
- **返回**: 中转站列表

#### 3.15.2 中转站详情
- **接口**: `POST /api/user/station/get`
- **函数**: `stationDetail(data)`
- **参数**: 中转站ID
- **返回**: 中转站详细信息

---

### 3.16 代理商模块

#### 3.16.1 申请代理商(无登录态)
- **接口**: `POST /api/agent/agentApply/submitApply`
- **函数**: `submitApplyNo(data)`
- **参数**: 申请信息

#### 3.16.2 申请代理商(登录态)
- **接口**: `POST /api/agent/agentApply/memberSubmitApply`
- **函数**: `submitApply(data)`
- **参数**: 申请信息

#### 3.16.3 查询是否申请过代理商
- **接口**: `GET /api/agent/agentApply/getApplyInfo`
- **函数**: `getApplyInfo()`
- **参数**: 无
- **返回**: 申请状态信息

#### 3.16.4 获取代理商账户信息
- **接口**: `GET /api/agent/getAccount`
- **函数**: `getAccount()`
- **参数**: 无
- **返回**:
  ```javascript
  {
    code: 200,
    data: {
      totalMoney: 1000.00,        // 总金额
      // 其他账户信息
    }
  }
  ```

#### 3.16.5 获取代理商账号提现规则
- **接口**: `GET /api/agent/getWallet`
- **函数**: `getWallet()`
- **参数**: 无
- **返回**: 提现规则配置

#### 3.16.6 代理商余额明细列表
- **接口**: `GET /api/agent/billsList`
- **函数**: `agentbillsList(data)`
- **参数**: 分页参数
- **返回**:
  ```javascript
  {
    code: 200,
    rows: [
      {
        id: 1,
        types: 1,                 // 1收入 2支出
        changeMoney: 10.00,
        currentMoney: 100.00,
        description: "描述",
        createTime: "2024-01-01 12:00:00"
      }
    ]
  }
  ```

#### 3.16.7 代理商设备列表
- **接口**: `GET /api/agent/deviceList`
- **函数**: `deviceList(data)`
- **参数**: 分页参数
- **返回**: 设备列表

#### 3.16.8 代理商密码修改
- **接口**: `GET /api/agent/updatePwd`
- **函数**: `updatePwd(data)`
- **参数**: 旧密码、新密码

#### 3.16.9 代理商发起提现
- **接口**: `POST /api/agent/withdraw`
- **函数**: `withdraw(data)`
- **参数**: 提现金额

#### 3.16.10 代理商提现列表
- **接口**: `GET /api/agent/withdrawList`
- **函数**: `withdrawList(data)`
- **参数**: 分页参数
- **返回**: 提现记录列表

---

### 3.17 内容模块

#### 3.17.1 单页内容
- **接口**: `POST /contentpage/get`
- **函数**: `contentpage(data)` / `contentPage(data)`
- **参数**:
  ```javascript
  {
    id: 1                         // 页面ID/标识
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    data: {
      title: "页面标题",
      content: "HTML内容"
    }
  }
  ```

#### 3.17.2 文章列表
- **接口**: `POST /api/news/list`
- **函数**: `newsList(data)`
- **参数**: 分页参数
- **返回**: 文章列表

#### 3.17.3 文章详情
- **接口**: `GET /api/news/get`
- **函数**: `newsGet(data)`
- **参数**: 文章ID
- **返回**: 文章详细信息

---

### 3.18 公共模块 (public.js)

#### 3.18.1 获取配置
- **接口**: `GET /api/common/config`
- **函数**: `getConfig()`
- **参数**: 无
- **返回**:
  ```javascript
  {
    code: 200,
    data: {
      system: {
        recycleOpen: true,        // 是否开启上门回收
        userTitle: "标题",
        publicityValidTime: 7     // 推广有效天数
      },
      withdraw: {
        minMoney: 15,             // 最低提现金额
        maxMoney: 100,            // 最高提现金额
        isWxCash: true,           // 微信提现
        isAliCash: true,          // 支付宝提现
        isCardCash: false         // 银行卡提现
      },
      maps: {
        webKeys: "key1,key2"      // 高德地图key
      }
    }
  }
  ```

#### 3.18.2 发送验证码
- **接口**: `POST /api/common/send-code`
- **函数**: `sendCode(data)` / `senSms(data)`
- **参数**:
  ```javascript
  {
    mobile: "13800138000",        // 手机号
    scene: 6                      // 场景 6:登录注册
  }
  ```
- **返回**:
  ```javascript
  {
    code: 200,
    msg: "发送成功"
  }
  ```

#### 3.18.3 文件上传
- **接口**: `POST api/common/public/upload`
- **函数**: `publicUpload(data)`
- **参数**: FormData文件数据
- **返回**:
  ```javascript
  {
    code: 200,
    data: {
      url: "文件访问地址"
    }
  }
  ```

#### 3.18.4 获取位置信息
- **接口**: `GET /api/common/location`
- **函数**: `commonLocation()`
- **参数**: 无

#### 3.18.5 字典数据
- **接口**: `POST /xunapi/dictdata`
- **函数**: `dictdata(data)`
- **参数**: 字典类型
- **返回**: 字典数据列表

---

## 4. 数据传递方式

### 4.1 Vuex状态管理

项目使用Vuex进行全局状态管理，主要模块包括:

#### 4.1.1 user模块
```javascript
state: {
  token: '',           // 登录令牌 (持久化存储)
  openId: '',          // 微信openId (持久化存储)
  userInfo: {},        // 用户信息 (持久化存储)
  location: {},        // 位置信息 (持久化存储)
  menuButton: {},      // 菜单按钮信息
  homeData: {},        // 我的页面数据
  address: {},         // 地址信息
  recycleOrder: {},    // 回收订单信息
  publicityConfig: {}, // 推广配置
  tabbarList: []       // 底部导航配置
}
```

#### 4.1.2 config模块
```javascript
state: {
  baseURL: '',         // 服务器地址
  companyName: '',     // 公司名称
  clienttype: 1,       // 客户端类型
  client: 'wechat',    // 客户端标识
  version: '1.0.0',    // 版本号
  dictCacheTime: 0     // 字典缓存时间
}
```

#### 4.1.3 settings模块
```javascript
state: {
  global: {},          // 全局配置
  themeColor: '',      // 主题色
  indexConfig: {},     // 首页配置
  dictdata: {},        // 字典数据
  formData: "",        // 表单数据
  pswRegular: '',      // 密码正则
  messageCountdown: 60 // 短信倒计时
}
```

### 4.2 本地存储

使用uni.setStorage/getStorage进行本地数据持久化:

| 存储键 | 说明 | 配置键 |
|--------|------|--------|
| `_member__token` | 登录令牌 | tokenTAG |
| `_member_ope_id` | 微信openId | openIdTAG |
| `_member__user__info` | 用户信息 | userInfoTAG |
| `_member__location` | 位置信息 | locationTAG |
| `_member__menu__button` | 菜单按钮 | menuButtonTAG |
| `_member_address` | 地址信息 | addressTAG |
| `publicityId` | 宣传员ID | - |
| `promoterId` | 推荐人ID | - |
| `offline` | 地推人员ID | - |
| `eq` | 扫码设备值 | - |
| `geoinfo` | 地理位置信息 | - |
| `agentMsg` | 代理商信息 | - |
| `saveInfo` | 海报保存信息 | - |

### 4.3 页面间数据传递

#### 4.3.1 URL参数传递
```javascript
// 跳转时传递
uni.navigateTo({
  url: `/pages/code/index?data=${q}&uuid=${uuid}&sn=${sndata}`
})

// 接收页面获取
onLoad(option) {
  const data = option.data
  const uuid = option.uuid
}
```

#### 4.3.2 Vuex状态传递
```javascript
// 设置状态
this.$store.commit('user/SET_TOKEN', res.token)
this.$store.commit('user/SET_USERINFO', res.member)

// 获取状态
const token = this.$store.state.user.token
const userInfo = this.$store.getters.userInfo
```

#### 4.3.3 事件传递
```javascript
// 父组件监听
<child-component @update="handleUpdate"></child-component>

// 子组件触发
this.$emit('update', data)
```

### 4.4 接口调用模式

#### 4.4.1 Promise方式
```javascript
getDeliverListApi({
  pageNum: 1,
  pageSize: 10,
  lon: this.location.longitude,
  lat: this.location.latitude
}).then(res => {
  this.deliverList = res.data
}).catch(err => {
  console.error(err)
})
```

#### 4.4.2 async/await方式
```javascript
async loadData() {
  try {
    const res = await getDeliverListApi(params)
    this.list = res.data
  } catch (e) {
    console.error(e)
  }
}
```

---

## 5. 错误处理

### 5.1 HTTP状态码处理
- **401**: 自动清除token，跳转登录页
- **其他错误**: 显示后端返回的错误信息

### 5.2 业务状态码
- **200**: 请求成功
- **其他**: 显示msg字段的错误信息

---

## 6. 认证流程

### 6.1 微信登录流程
1. 调用 `wx.login()` 获取code
2. 调用 `authLogin` 接口，传入code
3. 获取token和用户信息
4. 存储到Vuex和本地存储
5. 获取首页数据

### 6.2 手机号登录流程
1. 调用 `sendCode` 发送验证码
2. 调用 `authRegister` 接口，传入手机号和验证码
3. 获取token和用户信息
4. 存储到Vuex和本地存储

### 6.3 扫码开门流程
1. 扫描设备二维码
2. 调用 `sendCommand` 发送扫码成功指令
3. 获取设备uuid和sn
4. 跳转到开门页面
5. 调用 `sendOpen` 发送开门指令
6. 投递完成后获取结果

---

## 7. 接口文件结构

```
api/
├── index.js      # 主要业务接口 (首页、设备、活动、订单、代理商等)
├── public.js     # 公共接口 (配置、验证码、上传等)
└── user.js       # 用户相关接口 (登录、信息、账单等)
```

---

## 8. 接口统计

| 模块 | 接口数量 |
|------|----------|
| 用户认证 | 7 |
| 首页模块 | 12 |
| 活动模块 | 6 |
| 环保账单 | 4 |
| 账户提现 | 6 |
| 消息模块 | 3 |
| 地址模块 | 4 |
| 商品模块 | 3 |
| 订单模块 | 4 |
| 发布商品 | 10 |
| 回收订单 | 6 |
| 推广模块 | 8 |
| 点赞模块 | 2 |
| 商户模块 | 2 |
| 中转站模块 | 2 |
| 代理商模块 | 10 |
| 内容模块 | 3 |
| 公共模块 | 5 |
| **总计** | **97** |

---

## 9. 重构建议

### 9.1 接口管理优化
- 使用TypeScript定义接口类型
- 统一接口错误处理
- 添加接口请求/响应拦截器
- 实现接口缓存机制
- 接口分模块管理，避免单文件过大

### 9.2 状态管理优化
- 使用Pinia替代Vuex (Vue3)
- 模块化状态管理
- 添加持久化插件

### 9.3 代码组织优化
- 按业务模块拆分API文件
- 添加API文档注释
- 统一接口命名规范
- 移除重复接口 (如 senSms 和 sendCode)

---

*文档生成时间: 2026-06-27*