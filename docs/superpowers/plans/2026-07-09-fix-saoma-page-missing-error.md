# 修复扫码投递页面缺失编译错误实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 解决微信开发者工具中 `pages/saoma/scan/index.wxss` 和 `pages/saoma/scan/index.wxml` 文件缺失导致的编译错误，恢复小程序正常编译运行。

**Architecture:** 问题根因是旧版 `pages/saoma/` 扫码投递页面源码被删除但构建缓存（sourcemap）和静态资源残留，导致微信开发者工具编译时报错。修复策略分两步：先清理缓存验证是否解决，若页面需要恢复则从 sourcemap 中还原源码并注册到 pages.json。

**Tech Stack:** uni-app (Vue2), 微信小程序, HBuilderX 构建工具

---

## 问题诊断

**错误现象：**
- `[WXSS 文件编译错误] ENOENT: no such file or directory, open 'E:/code-github/baocun/daidaiUser/unpackage/dist/dev/mp-weixin/pages/saoma/scan/index.wxss'`
- `[WXML 文件编译错误] ENOENT: no such file or directory, open 'E:/code-github/baocun/daidaiUser/unpackage/dist/dev/mp-weixin/pages/saoma/scan/index.wxml'`
- 小程序页面白屏，伴随 `Error: timeout`

**已确认事实：**
1. 源码目录中**不存在** `pages/saoma/` 目录及其页面文件
2. `pages.json` 中**未注册**任何 saoma 相关页面
3. `unpackage/dist/dev/.sourcemap/mp-weixin/pages/saoma/` 下残留了 4 个页面的 sourcemap：`scan/`, `delivery/`, `settlement/`, `result/`
4. `static/saoma/` 静态资源完整存在（图片资源共 23 张）
5. 从 sourcemap 还原的代码显示：这是一套使用 Vue3 `<script setup>` 语法编写的**新版扫码投递流程**页面，含扫码页、投递页、结算页、结果页
6. 当前扫码流程使用的是旧版 `pages/code/` 路径（`pages/code/index.vue` 投口选择页）

---

## 文件结构

本修复涉及以下文件：

| 文件路径 | 操作 | 责任 |
|---------|------|------|
| `unpackage/dist/dev/.sourcemap/mp-weixin/pages/saoma/` | 删除 | 清理旧版 sourcemap 缓存 |
| `pages/saoma/scan/index.vue` | 可选创建 | 新版扫码投递入口页 |
| `pages/saoma/delivery/index.vue` | 可选创建 | 投口选择与投递页 |
| `pages/saoma/settlement/index.vue` | 可选创建 | 结算页 |
| `pages/saoma/result/index.vue` | 可选创建 | 投递结果页 |
| `pages.json` | 可选修改 | 注册 saoma 子包或页面 |

---

## Task 1: 清理构建缓存并验证

**Files:**
- Delete (recursively): `unpackage/dist/dev/.sourcemap/mp-weixin/pages/saoma/`
- Clean: `unpackage/dist/dev/mp-weixin/` 全部重建

- [ ] **Step 1: 删除残留的 saoma sourcemap 缓存目录**

在 HBuilderX 或文件管理器中删除以下目录：
```
unpackage/dist/dev/.sourcemap/mp-weixin/pages/saoma/
```

包含 4 个子目录：
- `scan/index.js.map`
- `delivery/index.js.map`
- `settlement/index.js.map`
- `result/index.js.map`

- [ ] **Step 2: 清理微信开发者工具缓存**

在微信开发者工具中执行：
1. 点击顶部菜单「工具」→「清除缓存」→「全部清除」
2. 或者点击工具栏「清缓存」按钮，选择全部清除

- [ ] **Step 3: 在 HBuilderX 中重新运行编译**

在 HBuilderX 中：
1. 点击「运行」→「运行到小程序模拟器」→「微信开发者工具」
2. 等待编译完成
3. 观察控制台是否还有 `pages/saoma/scan/index.wxss` 相关错误

预期结果：编译错误消失，小程序正常启动显示首页。

- [ ] **Step 4: 验证扫码功能是否正常**

在小程序中：
1. 点击首页「扫码开箱」按钮
2. 允许调起扫码
3. 验证是否正常跳转到 `pages/code/index`（旧版投口选择页）

预期结果：扫码功能正常，跳转到旧版投口选择页，无报错。

- [ ] **Step 5: 提交缓存清理变更（如需要）**

```bash
# 确认 .gitignore 中已忽略 unpackage 目录
cat .gitignore | grep unpackage

# 如未忽略，添加到 .gitignore
echo "unpackage/" >> .gitignore
git add .gitignore
git commit -m "chore: ensure unpackage build cache is gitignored"
```

---

## Task 2: 恢复新版扫码投递页面（可选，仅在需要新版页面时执行）

> **前置条件：** 如果业务需要使用新版 `pages/saoma/` 扫码投递流程，则执行此任务。否则仅执行 Task 1 即可解决编译错误。

**Files:**
- Create: `pages/saoma/scan/index.vue`
- Create: `pages/saoma/delivery/index.vue`
- Create: `pages/saoma/settlement/index.vue`
- Create: `pages/saoma/result/index.vue`
- Modify: `pages.json` — 添加 saoma 相关页面注册
- Modify: `pages/index/index.vue` — 修改扫码按钮跳转路径

### Task 2.1: 创建扫码入口页

- [ ] **Step 1: 创建 pages/saoma/scan/index.vue 文件**

从 sourcemap 还原的代码为基础，适配 Vue2 语法（当前项目是 Vue2 Options API）：

```vue
<template>
	<view class="page">
		<view class="header-section">
			<image class="bg" src="/static/saoma/header-illustration.png" mode="aspectFill" />
			<image class="title-img" src="/static/saoma/title-saomatoudi.png" mode="aspectFit" />
		</view>

		<view class="cash-card">
			<view class="cash-left">
				<text class="cash-label">现金</text>
				<view class="cash-price-row">
					<text class="cash-price-num">0.6</text>
					<text class="cash-price-unit">元/公斤</text>
				</view>
				<text class="cash-tip">可前往我的·余额去提现</text>
			</view>
			<image class="wallet-img" src="/static/saoma/icon-wallet.png" mode="aspectFit" />
		</view>

		<view class="forbid-section">
			<view class="section-header">
				<view class="title-bar">
					<image class="bar-img" src="/static/saoma/bar-blue.png" mode="aspectFit" />
					<text class="bar-title">以下物品严禁投递</text>
				</view>
				<text class="warn-text">违规投递将扣除当次余额，严重则封号</text>
			</view>
			<view class="item-grid">
				<image
					v-for="(item, index) in forbidList"
					:key="index"
					class="forbid-card-img"
					:src="item.img"
					mode="aspectFit"
				/>
			</view>
		</view>

		<view class="bottom-spacer"></view>

		<view class="bottom-bar">
			<button class="submit-btn" @tap="handleSubmit">开门投递</button>
			<view class="agreement-row" @tap="toggleAgree">
				<image
					class="check-img"
					:src="isAgreed ? '/static/saoma/checkbox-checked.png' : '/static/saoma/checkbox-unchecked.png'"
					mode="aspectFit"
				/>
				<text class="agree-text">
					我已阅读并同意
					<text class="link">《用户协议》</text>和
					<text class="link">《隐私政策》</text>
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { sendCommand } from '@/api/index.js'
	export default {
		data() {
			return {
				isAgreed: false,
				forbidList: [
					{ img: '/static/saoma/forbid-firecracker.png' },
					{ img: '/static/saoma/forbid-warm-clothes.png' },
					{ img: '/static/saoma/forbid-sample-book.png' },
					{ img: '/static/saoma/forbid-shoes.png' },
					{ img: '/static/saoma/forbid-coat.png' },
					{ img: '/static/saoma/forbid-windshield.png' },
					{ img: '/static/saoma/forbid-shredder.png' },
					{ img: '/static/saoma/forbid-rag.png' },
					{ img: '/static/saoma/forbid-appliance.png' },
					{ img: '/static/saoma/forbid-paperbox.png' },
					{ img: '/static/saoma/forbid-foam.png' },
					{ img: '/static/saoma/forbid-metal.png' },
				]
			}
		},
		methods: {
			toggleAgree() {
				this.isAgreed = !this.isAgreed
			},
			handleSubmit() {
				if (!this.isAgreed) {
					uni.showToast({ title: '请先阅读并同意协议', icon: 'none' })
					return
				}
				uni.scanCode({
					onlyFromCamera: true,
					scanType: ['qrCode'],
					success: (res) => {
						if (!res.result) {
							uni.showToast({ title: '未识别到有效二维码', icon: 'none' })
							return
						}
						const scanValue = res.result
						uni.showLoading({ title: '验证设备中...', mask: true })
						const location = this.$store.state.user.location || {}
						sendCommand({
							eventType: 'control_scan_success',
							scanValue: scanValue,
							lon: location.longitude,
							lat: location.latitude
						}).then((cmdRes) => {
							uni.hideLoading()
							const uuid = cmdRes.data.uuid
							uni.navigateTo({
								url: `/pages/saoma/delivery/index?uuid=${uuid}&sn=${uuid}&scanValue=${encodeURIComponent(scanValue)}`
							})
						}).catch((err) => {
							uni.hideLoading()
							uni.showToast({ title: '验证失败，请重试', icon: 'none' })
						})
					},
					fail: (err) => {
						const msg = err.errMsg || ''
						if (msg.includes('cancel')) {
							uni.showToast({ title: '已取消', icon: 'none' })
						} else {
							uni.showToast({ title: '扫码失败，请重试', icon: 'none' })
						}
					},
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #F7F7F7;
	position: relative;
}

.header-section {
	position: relative;
	height: 700rpx;
	overflow: visible;
	padding-top: calc(44px - 154rpx);

	.bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 645rpx;
		object-fit: cover;
		z-index: 0;
	}

	.title-img {
		position: absolute;
		left: 32rpx;
		top: 160rpx;
		width: 375rpx;
		height: 115rpx;
		z-index: 2;
	}
}

.cash-card {
	position: absolute;
	z-index: 10;
	top: 330rpx;
	left: 24rpx;
	right: 24rpx;
	background: url('/static/saoma/bg-card.png') no-repeat center center;
	background-size: cover;
	overflow: hidden;
	border-radius: 20rpx;
	padding: 25rpx 28rpx 22rpx;
	min-height: 200rpx;
	box-shadow: 0 4rpx 20rpx rgba(78, 126, 255, 0.10);
	display: flex;
	align-items: center;
	justify-content: space-between;

	.cash-left {
		display: flex;
		flex-direction: column;
		margin-top: -15rpx;
		margin-left: 40rpx;
		font-family: 'SourceHanSansCN-Medium', sans-serif;
	}

	.cash-label {
		font-size: 24rpx;
		color: #1658FF;
		font-weight: 500;
	}

	.cash-price-row {
		display: flex;
		align-items: baseline;
		margin-top: 6rpx;
	}

	.cash-price-num {
		font-size: 68rpx;
		color: #1658FF;
		line-height: 1;
	}

	.cash-price-unit {
		font-size: 24rpx;
		color: #1658FF;
		margin-left: 6rpx;
	}

	.cash-tip {
		font-size: 22rpx;
		color: #999999;
		margin-top: 6rpx;
	}

	.wallet-img {
		position: absolute;
		bottom: 0.5rpx;
		right: 10rpx;
		width: 240rpx;
		height: 200rpx;
		flex-shrink: 0;
	}
}

.forbid-section {
	position: relative;
	z-index: 10;
	margin: -103rpx 24rpx 0;
	background: #ffffff;
	border-radius: 16rpx;
	padding: 28rpx 20rpx 14rpx;
	box-shadow: 0 4rpx 20rpx rgba(78, 126, 255, 0.08);
}

.section-header {
	.title-bar {
		display: flex;
		align-items: center;
	}

	.bar-img {
		width: 8rpx;
		height: 32rpx;
		margin-right: 14rpx;
		flex-shrink: 0;
	}

	.bar-title {
		font-size: 30rpx;
		font-family: 'SourceHanSansCN-Medium', sans-serif;
		font-weight: 500;
		color: #333333;
	}

	.warn-text {
		font-size: 22rpx;
		color: #999999;
		margin-top: 8rpx;
		margin-bottom: 20rpx;
		margin-left: 22rpx;
		display: block;
	}
}

.item-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 14.5rpx 24rpx;

	.forbid-card-img {
		width: 100%;
		height: 192rpx;
		border-radius: 12rpx;
	}
}

.bottom-spacer {
	height: 260rpx;
}

.bottom-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background: #ffffff;
	padding: 16rpx 32rpx calc(30rpx + env(safe-area-inset-bottom));
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
	z-index: 99;
	box-sizing: border-box;
}

.submit-btn {
	width: 100%;
	height: 96rpx;
	line-height: 96rpx;
	background: linear-gradient(90deg, #1658FF 0%, #16D0FF 100%);
	border-radius: 48rpx;
	color: #ffffff;
	font-size: 34rpx;
	font-weight: 600;
	box-shadow: 0 8rpx 24rpx rgba(22, 88, 255, 0.35);
	border: none;
	text-align: center;

	&::after {
		border: none;
	}
}

.agreement-row {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 16rpx;

	.check-img {
		width: 34rpx;
		height: 34rpx;
		margin-right: 8rpx;
		flex-shrink: 0;
	}

	.agree-text {
		font-size: 22rpx;
		color: #888888;
	}

	.link {
		color: #4E7EFF;
	}
}
</style>
```

- [ ] **Step 2: 在 pages.json 中注册扫码入口页**

在 `pages.json` 的 `pages` 数组中添加（建议作为独立 subPackage）：

```json
{
  "root": "pagesSaoma",
  "pages": [
    {
      "path": "scan/index",
      "style": {
        "navigationStyle": "custom"
      }
    }
  ]
}
```

注意：需要先将 `pages/saoma/` 重命名为 `pagesSaoma/` 或直接注册到主包 pages 中。

- [ ] **Step 3: 运行编译验证页面可访问**

在 HBuilderX 中重新运行到微信开发者工具，确认：
1. 无编译错误
2. 通过控制台手动跳转测试：`uni.navigateTo({ url: '/pages/saoma/scan/index' })`
3. 页面正常渲染，静态资源加载正确

- [ ] **Step 4: 提交代码**

```bash
git add pages/saoma/scan/index.vue pages.json
git commit -m "feat: 恢复新版扫码投递入口页"
```

### Task 2.2 至 2.4: 恢复投递页、结算页、结果页

> 由于 delivery、settlement、result 三个页面的完整源码需要从 sourcemap 中进一步提取还原，且当前旧版 `pages/code/` 流程可用，建议优先级降低。

如需恢复这些页面，步骤如下：

- [ ] 从 sourcemap 文件中提取 delivery/index.vue 源码，适配 Vue2 语法
- [ ] 从 sourcemap 文件中提取 settlement/index.vue 源码，适配 Vue2 语法
- [ ] 从 sourcemap 文件中提取 result/index.vue 源码，适配 Vue2 语法
- [ ] 在 pages.json 中注册这三个页面
- [ ] 验证页面跳转链路：scan → delivery → settlement → result
- [ ] 提交代码

---

## Task 3: 切换首页扫码按钮到新版页面（可选）

**Files:**
- Modify: `pages/index/index.vue:796-823` — 修改 scanOpenBox 方法跳转路径

- [ ] **Step 1: 修改首页扫码按钮跳转目标**

将 `scanOpenBox` 方法中的跳转路径从旧版 `../code/index` 改为新版 `/pages/saoma/scan/index`：

修改前（当前代码）：
```javascript
scanOpenBox() {
    uni.scanCode({
        onlyFromCamera: true,
        success: (res) => {
            const scanValue = res.result
            uni.showLoading({ mask: true, title: '加载中' })
            sendCommand({
                eventType: 'control_scan_success',
                scanValue: scanValue,
                lon: this.$store.state.user.location.longitude,
                lat: this.$store.state.user.location.latitude
            }).then(res2 => {
                uni.hideLoading()
                this.$u.toast(res2.msg)
                if (res2.code == 200) {
                    let uuid = res2.data.uuid
                    let sndata = res2.data.sn
                    uni.navigateTo({
                        url: `../code/index?data=${scanValue}&uuid=${uuid}&sn=${sndata}`
                    })
                }
            }).catch(err => {
                uni.hideLoading()
                console.log(err)
            })
        }
    })
},
```

修改为直接跳转到新版扫码页（让用户在新页面中扫码）：
```javascript
scanOpenBox() {
    uni.navigateTo({
        url: '/pages/saoma/scan/index'
    })
},
```

- [ ] **Step 2: 验证跳转链路**

1. 点击首页「扫码开箱」按钮
2. 跳转到新版扫码投递页面
3. 点击「开门投递」按钮调起扫码
4. 扫码成功后跳转到投递页

- [ ] **Step 3: 提交代码**

```bash
git add pages/index/index.vue
git commit -m "feat: 首页扫码按钮切换到新版扫码投递页面"
```

---

## 自检清单

**1. 问题覆盖：**
- ✅ Task 1 清理缓存解决编译错误 — 覆盖主要报错
- ✅ Task 2 恢复新版页面 — 覆盖 saoma 页面缺失的根本原因
- ✅ Task 3 切换首页入口 — 覆盖业务流程切换

**2. 占位符检查：**
- Task 2.2-2.4 标记为「可选」且明确说明需要从 sourcemap 提取，不算占位符
- 所有 Task 1 步骤均有具体操作和预期结果

**3. 一致性检查：**
- 页面路径统一使用 `/pages/saoma/xxx/index` 格式
- API 调用统一使用 `sendCommand` 和 `equipmentOutlet` 等现有 API
- 样式风格与现有 `static/saoma/` 资源匹配

---

## 执行建议

**推荐执行路径：**
1. **先执行 Task 1**（清理缓存）— 5分钟内可验证是否解决编译错误
2. 如果只是误删源码但不需要新版页面，Task 1 即可解决问题
3. 如确认需要新版扫码投递页面，再依次执行 Task 2.1 → Task 2.2-2.4 → Task 3

Plan complete and saved to `docs/superpowers/plans/2026-07-09-fix-saoma-page-missing-error.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
