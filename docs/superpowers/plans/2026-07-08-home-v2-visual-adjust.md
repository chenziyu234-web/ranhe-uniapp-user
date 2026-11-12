# 首页视觉尺寸对齐设计稿 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将首页各白卡、按钮、分类区域的尺寸/圆角/间距精确对齐设计稿标注值，替换扫码开箱按钮渐变色，整体比例按小程序 750rpx 画布计算。

**Architecture:** 纯 CSS/template 调整，不涉及 JS 逻辑改动。修改 3 个文件：pages/index/index.vue（页面容器、扫码开箱按钮、8宫格白卡、页面背景）、components/machine-view/machine-view.vue（卡片内边距、去重白色背景）、components/machine-list/machine-list.vue（swiper 高度调整）。所有数据绑定、事件、业务逻辑保持不动。

**Tech Stack:** uni-app (Vue2 Options API)、SCSS、微信小程序 rpx 单位

---

## 设计稿尺寸总表（从小程序 750×1624rpx 画布提取）

| 元素 | 属性 | 设计值 | 当前值 | 需改动 |
|---|---|---|---|---|
| 页面背景 | background-color | #F7F7F7 | #fafafa | ✅ |
| 所有白卡统一 | width | 702rpx | 690rpx | ✅ |
| 所有白卡统一 | margin-left/right | 24rpx | 30rpx | ✅ |
| 所有白卡统一 | border-radius | 24rpx | 20rpx/30rpx 不一致 | ✅ |
| 设备白卡 | height | 411rpx（含地图+底部文字） | 无固定高度，由内容撑开 | 调整内边距使高度接近 |
| 设备白卡 | margin-top（叠压banner） | -93rpx | -96rpx | 微调为 -93rpx |
| 扫码开箱按钮 | width | 702rpx（跟随卡片宽度） | 由 margin-row-30 撑出 690rpx | ✅ |
| 扫码开箱按钮 | height | 100rpx | 96rpx | ✅ |
| 扫码开箱按钮 | border-radius | 16rpx | 20rpx（胶囊=高度一半） | ✅ |
| 扫码开箱按钮 | background | linear-gradient(90deg, #FEE2E2, #30C3F7, #4E80FF) | linear-gradient(90deg, #4E80FF, #0B84FF) | ✅ |
| 扫码开箱按钮 | 上下间距 | ~24rpx | u-m-b-30 | ✅ |
| 8宫格分类白卡 | height | 374rpx | 无白卡包裹，直接在页面上 | ✅ 包白卡 |
| 8宫格分类白卡 | padding | 约 30rpx 内边距 | 无 | ✅ |
| machine-view | background-color | transparent（外层白卡已有背景） | #ffffff | ✅ 去重 |
| machine-view | border-radius | 0（不单独圆角） | 30rpx | ✅ |
| machine-view | padding | 调整以适应外层白卡 | 40rpx 30rpx 30rpx 30rpx | ✅ |
| 地图容器 | width | 约 654rpx（702-24*2） | 670rpx | ✅ |
| 地图容器 | border-radius | 与卡片协调，约 16rpx 上圆角 | 20rpx 上圆角 | 微调 |
| swiper 高度 | height | 约 180rpx（设备信息区） | 380rpx | ✅ 大幅缩减 |
| 左列图标 | .image 宽/高 | 图标按比例自适应 | width:92rpx; height:180rpx | 调整 |
| banner"扫码回收"按钮 | top 位置 | 约 200-220rpx 区域 | 310rpx | 验证后微调 |

---

### Task 1: 页面背景色 + 设备白卡外层容器尺寸

**Files:**
- Modify: `pages/index/index.vue`

- [ ] **Step 1: 修改页面背景色**

在 `.index-view` 样式中，将 `background-color: #fafafa` 改为 `background-color: #F7F7F7`。

文件位置：[index.vue L1213-1216](file:///e:/code-github/baocun/daidaiUser/pages/index/index.vue#L1213-L1216)

改前：
```scss
.index-view {
    min-height: 100vh;
    background-color: #fafafa;
}
```
改后：
```scss
.index-view {
    min-height: 100vh;
    background-color: #F7F7F7;
}
```

- [ ] **Step 2: 修改设备白卡外层容器 inline style**

文件位置：[index.vue L9](file:///e:/code-github/baocun/daidaiUser/pages/index/index.vue#L9)

改前：
```vue
<view style="background-color: #fff;width: 690rpx;margin-left: 30rpx;border-radius: 20rpx;margin-top: -96rpx;position: relative;z-index: 2;">
```
改后：
```vue
<view style="background-color: #fff;width: 702rpx;margin-left: 24rpx;border-radius: 24rpx;margin-top: -93rpx;position: relative;z-index: 2;">
```

- [ ] **Step 3: 调整设备白卡内部 padding 和地图容器宽度**

文件位置：[index.vue L10-38](file:///e:/code-github/baocun/daidaiUser/pages/index/index.vue#L10-L38)

改前：
```vue
    <view style="padding-bottom: 20rpx;" class="u-m-l-30" v-if="deliverList.length > 0">
        <machine-list :list="deliverList"></machine-list>
    </view>
    <view style="padding-bottom: 20rpx;height: 380rpx;"
        class="u-m-l-20 u-font-32 text-333333 u-flex u-row-center u-col-center" v-else>
        ...
    </view>

    <view class="section-view u-m-b-20">
        <view style="overflow: hidden;width: 670rpx;height: 170rpx;border-radius: 20rpx 20rpx 0 0;">
            <map style="width: 670rpx;height: 170rpx;border-radius: 20rpx 20rpx 0 0;" name=""
                :latitude="location.latitude" :longitude="location.longitude"></map>
        </view>
        <view class="u-font-24 text-666666 text-center u-m-t-30" @click="toMap">
            10公里内有<text class="text-theme">{{totalLength}}</text>台回收机
            <u-icon name="arrow-right"></u-icon>
        </view>
    </view>
```
改后：
```vue
    <view style="padding: 24rpx 24rpx 0 24rpx;" v-if="deliverList.length > 0">
        <machine-list :list="deliverList"></machine-list>
    </view>
    <view style="padding: 24rpx 24rpx 0 24rpx;height: 180rpx;"
        class="u-font-28 text-999999 u-flex u-row-center u-col-center" v-else>
        ...
    </view>

    <view class="section-view">
        <view style="overflow:hidden;width:654rpx;height:170rpx;margin:0 auto;border-radius:16rpx 16rpx 0 0;">
            <map style="width:654rpx;height:170rpx;border-radius:16rpx 16rpx 0 0;" name=""
                :latitude="location.latitude" :longitude="location.longitude"></map>
        </view>
        <view class="u-font-24 text-666666 text-center u-m-t-20 u-m-b-24" @click="toMap">
            <text style="color:#999;">附近有</text><text class="text-theme">{{totalLength}}</text><text style="color:#999;">台回收机</text>
            <u-icon name="arrow-right" color="#999" size="24"></u-icon>
        </view>
    </view>
```

关键变化：
- 外层 padding 统一改为 24rpx（顶/右/左），底部为 0（地图紧贴）
- 空状态高度从 380rpx 缩为 180rpx（与 swiper 区域等高）
- 地图宽度从 670rpx 改为 654rpx（=702-24×2），水平居中 `margin:0 auto`
- 地图圆角从 20rpx 改为 16rpx
- 底部文字区域："10公里内有"改为"附近有"，加 u-m-b-24 给底部留 24rpx，箭头颜色改灰色
- 去掉 u-m-b-20，改由底部 padding 控制

- [ ] **Step 4: 编译验证**

在微信开发者工具中编译查看：设备白卡宽度、圆角、叠压位置是否正确，地图是否水平居中且不超出卡片。

---

### Task 2: machine-list swiper 高度缩减 + machine-view 去重白色背景

**Files:**
- Modify: `components/machine-list/machine-list.vue`
- Modify: `components/machine-view/machine-view.vue`
- Modify: `components/machine-status/machine-status.vue`

- [ ] **Step 1: 缩减 u-swiper2 高度**

文件位置：[machine-list.vue L3](file:///e:/code-github/baocun/daidaiUser/components/machine-list/machine-list.vue#L3)

改前：
```vue
<u-swiper2 height="380" :autoplay="false" mode="rect" :list="list" bgColor="transparent"></u-swiper2>
```
改后：
```vue
<u-swiper2 height="180" :autoplay="false" mode="rect" :list="list" bgColor="transparent"></u-swiper2>
```

swiper 高度从 380rpx 缩为 180rpx（仅覆盖设备信息区，地图在外层白卡中不属于 swiper）。

- [ ] **Step 2: 去掉 machine-view 的白色背景和独立圆角，调整内边距**

文件位置：[machine-view.vue L179-211](file:///e:/code-github/baocun/daidaiUser/components/machine-view/machine-view.vue#L179-L211)

改前：
```scss
.machine {
    padding: 40rpx 30rpx 30rpx 30rpx;
    background-color: #ffffff;
    border-radius: 30rpx;
    margin-top: 20rpx;
    min-height: 330rpx;

    .machine-left {
        width: 100rpx;
        flex-direction: column;
        align-items: center;

        .machine-status-text {
            margin-top: 12rpx;
            font-size: 22rpx;
            color: #A0A3B4;
            text-align: center;
        }
    }

    .machine-right {
        width: calc(100% - 100rpx);
        padding-left: 30rpx;

        .item-buttons {
            border: 1rpx solid $theme-color;
            border-radius: 6rpx;
            color: $theme-color;
            width: 200rpx;
            height: 60rpx;
        }
    }
}
```
改后：
```scss
.machine {
    padding: 0;
    background-color: transparent;
    border-radius: 0;
    margin-top: 0;
    min-height: auto;

    .machine-left {
        width: 100rpx;
        flex-direction: column;
        align-items: center;

        .machine-status-text {
            margin-top: 8rpx;
            font-size: 20rpx;
            color: #A0A3B4;
            text-align: center;
        }
    }

    .machine-right {
        flex: 1;
        padding-left: 20rpx;

        .text-name {
            font-size: 32rpx;
        }

        .item-buttons {
            border: 1rpx solid $theme-color;
            border-radius: 6rpx;
            color: $theme-color;
            width: 160rpx;
            height: 50rpx;
            font-size: 24rpx;
        }
    }
}
```

关键变化：
- 去掉 background-color、独立 border-radius、margin-top、大 padding
- machine-right 从 `calc(100% - 100rpx)` 改为 `flex:1` 自适应
- 左列 padding-left 从 30rpx 减为 20rpx
- 设备名称字号从 36rpx 微调为 32rpx（设计稿比例）
- 状态文字 margin-top 从 12rpx→8rpx，字号 22→20rpx
- 订阅按钮缩为 160×50rpx，字号 24rpx

- [ ] **Step 3: 调整 machine-status 图标尺寸**

文件位置：[machine-status.vue L40-43](file:///e:/code-github/baocun/daidaiUser/components/machine-status/machine-status.vue#L40-L43)

改前：
```scss
.image {
    width: 92rpx;
    height: 180rpx;
}
```
改后：
```scss
.image {
    width: 80rpx;
    height: auto;
}
```

关键变化：图标宽度从 92rpx 缩为 80rpx，去掉固定 height（mode=widthFix 会自动按比例算高度，新图标 35×51px → 80rpx 宽时高约 117rpx）。

- [ ] **Step 4: 调整 machine-view 模板中内联间距**

文件位置：[machine-view.vue L12-37](file:///e:/code-github/baocun/daidaiUser/components/machine-view/machine-view.vue#L12-L37)

改前：
```vue
            <view class="u-flex">
                <view class="text-name u-font-36 font-weight u-line-1">
                    {{item.villageName}}{{item.position}}
                </view>
            </view>
            <view class="u-flex u-row-between u-font-28  u-p-t-4" style="color: #7b7b7b;margin: 16rpx 0;">
            <text>{{parseAreaName(item.parentsName)}}</text>
            <view class="u-flex u-row-center u-col-center">
                <image src="/static/homeV2/icon-location.png" style="width: 28rpx;margin-right: 6rpx;" mode="widthFix"></image>
                <text>{{filterDistance(item.distance)}}</text>
            </view>
        </view>
            <view class="u-flex u-row-between" style="color: #999;height: 50rpx;">
                <view class="tag" v-if="item.deliveryNumber!=0">
                    投过{{item.deliveryNumber}}次</view>
            </view>

            <view class="u-flex u-row-between u-col-center u-m-t-30">
                <view @click.stop="deliverSubscribe(item)" v-if="item.useStatus!=1 && item.lineStatus != 2" class="u-flex u-row-center font-weight item-buttons"
                    :style="{border: item.useStatus!=1&&item.useStatus!=2 ? '1rpx solid #333':'',color:item.useStatus!=1&&item.useStatus!=2 ? '#333':''}">
                    {{xunHelper.useStatusBtn(item.useStatus)}}
                </view>
            </view>
```
改后：
```vue
            <view class="u-flex">
                <view class="text-name font-weight u-line-1">
                    {{item.villageName}}{{item.position}}
                </view>
            </view>
            <view class="u-flex u-row-between u-font-24 u-p-t-4" style="color: #999;margin: 10rpx 0;">
            <text>{{parseAreaName(item.parentsName)}}</text>
            <view class="u-flex u-row-center u-col-center">
                <image src="/static/homeV2/icon-location.png" style="width: 24rpx;margin-right: 4rpx;" mode="widthFix"></image>
                <text>{{filterDistance(item.distance)}}</text>
            </view>
        </view>
            <view class="u-flex u-row-between" style="color: #999;">
                <view class="tag" v-if="item.deliveryNumber!=0">
                    投过{{item.deliveryNumber}}次</view>
            </view>

            <view class="u-flex u-row-end u-col-center u-m-t-10">
                <view @click.stop="deliverSubscribe(item)" v-if="item.useStatus!=1 && item.lineStatus != 2" class="u-flex u-row-center font-weight item-buttons"
                    :style="{border: item.useStatus!=1&&item.useStatus!=2 ? '1rpx solid #4E80FF':'',color:item.useStatus!=1&&item.useStatus!=2 ? '#4E80FF':''}">
                    {{xunHelper.useStatusBtn(item.useStatus)}}
                </view>
            </view>
```

关键变化：
- 设备名去掉 `u-font-36`（字号由 `.text-name` 的 32rpx 控制）
- 地址/距离行字号从 28→24rpx，颜色从 #7b7b7b→#999，margin 从 16rpx→10rpx
- 定位图标宽 28→24rpx，margin-right 6→4rpx
- 投递次数行去掉固定 `height: 50rpx`
- 按钮行 u-m-t-30→u-m-t-10，改为 `u-row-end`（按钮靠右底对齐，不再左对齐）
- 按钮边框颜色统一为 #4E80FF（跟主题蓝一致），去掉旧的 #333

- [ ] **Step 5: 编译验证**

在微信开发者工具中编译查看：设备信息区域（图标+名称+地址+距离+按钮）是否紧凑排列在 swiper 高度内，没有溢出或大片空白。

---

### Task 3: 扫码开箱按钮渐变色 + 尺寸 + 间距

**Files:**
- Modify: `pages/index/index.vue`

- [ ] **Step 1: 替换按钮 inline class 和 margin**

文件位置：[index.vue L42](file:///e:/code-github/baocun/daidaiUser/pages/index/index.vue#L42)

改前：
```vue
<view class="scan-btn margin-row-30 u-m-b-30" @click="scanOpenBox">
```
改后：
```vue
<view class="scan-btn" @click="scanOpenBox">
```

（去掉 margin-row-30 和 u-m-b-30，改为在 .scan-btn 样式中精确控制 margin）

- [ ] **Step 2: 替换按钮样式**

文件位置：[index.vue L1281-1300](file:///e:/code-github/baocun/daidaiUser/pages/index/index.vue#L1281-L1300)

改前：
```scss
/* 扫码开箱按钮 */
.scan-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 96rpx;
    border-radius: 20rpx;
    background: linear-gradient(90deg, #4E80FF, #0B84FF);

    .scan-btn-icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 12rpx;
    }

    .scan-btn-text {
        color: #ffffff;
        font-size: 30rpx;
        font-weight: bold;
    }
}
```
改后：
```scss
/* 扫码开箱按钮 */
.scan-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 702rpx;
    height: 100rpx;
    margin: 24rpx auto;
    border-radius: 16rpx;
    background: linear-gradient(90deg, #FEE2E2, #30C3F7, #4E80FF);

    .scan-btn-icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 12rpx;
    }

    .scan-btn-text {
        color: #ffffff;
        font-size: 30rpx;
        font-weight: bold;
    }
}
```

关键变化：
- width 显式设为 702rpx，margin `24rpx auto` 实现水平居中+上下 24rpx 间距
- height 96→100rpx
- border-radius 从 20rpx 改为 16rpx（非胶囊，是小圆角矩形）
- 渐变色替换为三色：#FEE2E2 → #30C3F7 → #4E80FF，方向 90deg（左到右）

- [ ] **Step 3: 编译验证**

按钮应为宽 702rpx、高 100rpx、16rpx 圆角、三色渐变（左粉→中青→右蓝），上下各 24rpx 间距。

---

### Task 4: 8宫格分类包裹白卡

**Files:**
- Modify: `pages/index/index.vue`

- [ ] **Step 1: 将 category-grid 改为白卡包裹**

文件位置：[index.vue L48-81](file:///e:/code-github/baocun/daidaiUser/pages/index/index.vue#L48-L81)

改前：
```vue
<!-- 8宫格分类（静态写死，不绑跳转） -->
<view class="category-grid margin-row-30 u-m-b-30">
    <view class="category-item">
        ...（8个分类item）...
    </view>
</view>
```
改后：
```vue
<!-- 8宫格分类（静态写死，不绑跳转） -->
<view class="category-card">
    <view class="category-grid">
        <view class="category-item">
            ...（8个分类item，内容不变）...
        </view>
    </view>
</view>
```

（外层新增 `.category-card` 白卡容器，内层 `.category-grid` 去掉 margin-row-30/u-m-b-30）

- [ ] **Step 2: 替换分类区域样式**

文件位置：[index.vue L1302-1330 附近](file:///e:/code-github/baocun/daidaiUser/pages/index/index.vue#L1302)

改前：
```scss
/* 8宫格分类（静态写死） */
.category-grid {
    display: flex;
    flex-wrap: wrap;
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 20rpx 0;

    .category-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 25%;
        padding: 16rpx 0;

        .category-icon { width: 88rpx; height: 88rpx; }
        .category-text { margin-top: 10rpx; font-size: 24rpx; color: #333333; }
    }
}
```
改后：
```scss
/* 8宫格分类白卡 */
.category-card {
    width: 702rpx;
    margin: 0 auto 24rpx;
    background-color: #ffffff;
    border-radius: 24rpx;
    padding: 30rpx 0;
}

.category-grid {
    display: flex;
    flex-wrap: wrap;

    .category-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 25%;
        padding: 16rpx 0;

        .category-icon { width: 96rpx; height: 96rpx; }
        .category-text { margin-top: 12rpx; font-size: 24rpx; color: #333333; }
    }
}
```

关键变化：
- 白卡 `.category-card`：702rpx 宽、居中、24rpx 圆角、30rpx 上下内边距、底部 24rpx 外边距
- `.category-grid` 去掉白色背景和圆角（由外层 card 承担），改为纯 flex 容器
- 图标从 88rpx 放大到 96rpx，文字 margin-top 10→12rpx
- 白卡总高度 ≈ 30(上padding) + (96+12+24+16×2)*2(两行) + 30(下padding) ≈ 374rpx，与设计稿一致

- [ ] **Step 3: 编译验证**

8宫格区域应为 702rpx 宽白色圆角卡片（24rpx 圆角），2行4列，图标 96rpx，整体高度约 374rpx。

---

### Task 5: banner"扫码回收"按钮位置验证

**Files:**
- Modify: `pages/index/index.vue`（仅在位置不对时微调）

- [ ] **Step 1: 编译后目视检查按钮位置**

当前 `.banner-scan-btn` 的 top 值是 310rpx。banner 图片高 520rpx，设备白卡顶部叠压在 427rpx 处（margin-top:-93rpx）。

按钮在 310rpx 位置意味着：距离 banner 顶部 310rpx，距离可见 banner 底部（=白卡顶部 427rpx）还有 117rpx。

- [ ] **Step 2: 如果位置不对，微调 top 值**

根据设计稿，"扫码回收"按钮应在副标题"化学法再生技术，赋予旧衣新生"下方，大概在 y=200-240rpx 位置（在回收机插画的左侧）。如果 310rpx 偏低（被白卡遮挡或太靠下），将 top 调整为 220rpx 左右。

修改位置：[index.vue .banner-scan-btn 样式](file:///e:/code-github/baocun/daidaiUser/pages/index/index.vue#L1265)

```scss
.banner-scan-btn {
    position: absolute;
    left: 44rpx;
    top: 220rpx;  /* 从310rpx调整到约220rpx，具体数值以编译后视觉为准 */
    width: 174rpx;
    height: 57rpx;
    line-height: 57rpx;
    border-radius: 29rpx;
    background: transparent;
    border: 1rpx solid #ffffff;
    color: #ffffff;
    font-size: 24rpx;
    text-align: center;
}
```

注意：border-radius 保持 29rpx（胶囊形，=高度一半 57/2），这个是 banner 上的描边胶囊按钮，跟下方扫码开箱按钮（16rpx 圆角矩形）样式不同。

- [ ] **Step 3: 编译验证**

按钮应在 banner 左侧，副标题下方，不遮挡回收机插画主体。

---

### Task 6: 整体检查与微调

**Files:**
- Modify: 所有涉及文件（如有需要）

- [ ] **Step 1: 检查底部 tabbar 是否被遮挡**

8宫格白卡底部 margin 24rpx，加上 tabbar 高度（约 100rpx），确保最后一个元素不被 tabbar 遮挡。如果内容被遮挡，在最末尾加一个占位 `<view style="height: 120rpx;"></view>` 或给 `.pos-r` 容器加 padding-bottom。

- [ ] **Step 2: 检查设备白卡总高度**

设备白卡内容：swiper(180rpx) + 地图(170rpx) + 底部文字(约50rpx 含padding) = ~400rpx，加上24rpx顶部padding ≈ 424rpx。设计稿是 411rpx，差距约 13rpx，可通过微调地图高度或底部文字 margin 来对齐，但不用强求像素级一致。

- [ ] **Step 3: 检查空状态**

当附近无设备或未授权定位时，空状态区域高度为 180rpx（跟 swiper 等高），确保布局不错位。

- [ ] **Step 4: 编译最终预览截图**

在微信开发者工具中编译，截图整个首页，确认：
1. 页面背景 #F7F7F7 灰色
2. 顶部 banner + "扫码回收"胶囊按钮位置正确
3. 设备白卡 702rpx 宽/24rpx 圆角/叠压 banner 约 93rpx
4. 设备卡内：左列图标+状态文字、右列名称+地址+距离+按钮，两列顶部对齐
5. 地图区域居中 654rpx 宽，底部"附近有X台回收机"
6. 扫码开箱按钮：三色渐变、100rpx 高、16rpx 圆角
7. 8宫格白卡：702rpx 宽、24rpx 圆角、2行4列图标清晰
8. tabbar 三个新图标正常显示（蓝色选中/灰色未选中）
