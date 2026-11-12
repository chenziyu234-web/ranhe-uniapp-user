# 修复"手机短信登录/注册"按钮缺少登录功能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复 `pages/login/index.vue` 中"手机短信登录/注册"页面只调用了注册接口（`authRegister`）而没有实现登录功能的问题，使已注册手机号用户能通过短信验证码正常登录；同时修复微信 code 一次性消耗后被重复使用导致的 `40163 code been used` 报错。

**Architecture:** 在 `submit()` 方法中，先调用 `authRegister`（注册接口）。若后端返回"手机号已被注册"类错误，则自动刷新微信 code 并回退调用 `authLogin`（登录接口）完成登录。所有失败路径均刷新微信 code，确保用户下次点击时使用全新 code，形成完整闭环。

**Tech Stack:** uni-app (Vue 2) + Vuex + luch-request HTTP 库

---

## 问题根因分析

### Bug 复现流程

```
用户输入已注册手机号 → 获取验证码 → 点击"登录/注册"
  ↓
submit() 调用 authRegister（注册接口），传入 this.session（微信code）
  ↓
后端返回错误："该手机号已被注册"，code != 200
  ↓
request.js 拦截器弹出错误提示，Promise 被 reject
  ↓
submit() 没有 .catch()，rejected promise 未被处理
  ↓
此时 this.session 对应的微信 code 已被注册请求消耗（微信code一次性）
  ↓
用户第二次点击"登录/注册"
  ↓
submit() 再次调用 authRegister，仍使用已失效的 this.session
  ↓
微信返回错误：40163, code been used（截图中的报错）
```

### 三个缺陷点

| # | 缺陷 | 位置 | 影响 |
|---|------|------|------|
| 1 | `submit()` 只调用 `authRegister`，没有调用 `authLogin` | [login/index.vue:165](file:///e:/code-github/baocun/daidaiUser/pages/login/index.vue#L165) | 已注册用户无法通过短信验证码登录 |
| 2 | `submit()` 没有 `.catch()` 错误处理 | [login/index.vue:165-186](file:///e:/code-github/baocun/daidaiUser/pages/login/index.vue#L165-L186) | 请求失败后 loading 不消失，code 不刷新 |
| 3 | 微信 code 失效后不刷新 | `this.session` 仅在 `onLoad` 时获取一次 | 第二次点击必定报 `40163 code been used` |

### 对比：已有的正确实现

同文件中 `getphonenumber()` 方法（手机号快捷登录）已有正确的错误处理模式：

```javascript
// login/index.vue:220-247
authRegister(PPdata).then(res => {
    // ... 成功处理
}).catch(res => {
    this.getSession()  // ← 失败时刷新微信code
    uni.hideLoading()
    uni.showToast({ icon: 'none', title: res.data.msg })
})
```

`submit()` 方法缺少相同的 `.catch()` + `this.getSession()` 模式。

### API 接口现状

| 接口 | 函数 | URL | 已有 scene 值 |
|------|------|-----|--------------|
| 登录 | `authLogin` | `POST api/user/auth/login` | `wemini_auth_login`（微信静默登录） |
| 注册 | `authRegister` | `POST /api/user/auth/register` | `mobile_code_register`（手机验证码注册）、`wemini_mobile_register`（微信手机号快捷注册） |

> **注意：** API 文档（[API文档.md:1547-1551](file:///e:/code-github/baocun/daidaiUser/API文档.md#L1547-L1551)）中"手机号登录流程"描述的是调用 `authRegister`，说明后端注册接口原本可能设计为"注册或登录"一体。但实际后端对已注册手机号返回了错误，说明后端行为与文档不符，或后端已改为注册/登录分离。前端需要适配这一变化。
>
> **风险点：** `authLogin` 接口目前只文档记录了 `wemini_auth_login` scene，不确定后端是否支持 `mobile_code_login` scene。若不支持，需要后端配合新增。详见下方"风险分析"章节。

### request.js 拦截器行为

[request.js:61-80](file:///e:/code-github/baocun/daidaiUser/common/utils/request.js#L61-L80) 的响应拦截器逻辑：

- `response.data.code === 401`：调用 `redirect()` 登出并跳转登录页
- `response.data.code !== 200`：通过节流函数弹出 `response.data.msg` 错误提示，然后 `Promise.reject(response)`
- `response.data.code === 200`：返回 `response.data`

**关键：** 当注册接口返回非 200 时，拦截器会**自动弹出错误提示**（如"该手机号已被注册"），然后 reject。我们的 `.catch()` 处理器在拦截器之后执行。因此在 catch 中尝试登录时，用户会短暂看到"该手机号已被注册"提示，随后被 loading 覆盖。这是可接受的行为。

---

## File Structure

| Action | File Path | Responsibility |
|--------|-----------|---------------|
| Modify | `pages/login/index.vue` | 修改 `submit()` 方法，新增 `tryLogin()` 方法 |

---

### Task 1: 新增 `tryLogin()` 方法 — 已注册手机号的登录回退

**Files:**
- Modify: `pages/login/index.vue`（在 `submit()` 方法之前插入新方法）

**作用：** 当注册接口返回"手机号已被注册"时，刷新微信 code 并调用 `authLogin` 登录接口完成登录。

- [ ] **Step 1: 在 `methods` 中新增 `tryLogin()` 方法**

在 `submit()` 方法之前（当前约第 144 行 `submit() {` 之前）插入以下代码：

```javascript
// 手机号已注册时的登录回退流程
async tryLogin() {
    uni.showLoading({
        title: "登录中...",
        mask: true
    })
    try {
        // 刷新微信code（注册请求已消耗上一个code）
        await this.getSession()
        const Ldata = {
            scene: "mobile_code_login",
            mobile: this.query.mobile,
            smsCode: this.query.yzm,
            // #ifdef MP-WEIXIN
            weminiJsCode: this.session,
            // #endif
            // #ifdef MP-ALIPAY
            aliAuthCode: this.session
            // #endif
        }
        const res = await authLogin(Ldata)
        uni.hideLoading()
        uni.showToast({
            icon: 'none',
            title: res.msg || '登录成功'
        })
        if (res.code == 200) {
            this.$store.commit('user/SET_TOKEN', res.token)
            this.$store.commit('user/SET_USERINFO', res.member)
            // #ifdef MP-WEIXIN
            uni.switchTab({
                url: '/pages/index/index'
            })
            // #endif
            // #ifdef MP-ALIPAY
            uni.reLaunch({
                url: '/pages/index/index'
            })
            // #endif
        }
    } catch (loginErr) {
        uni.hideLoading()
        // 登录也失败了，刷新code供下次重试
        this.getSession()
        uni.showToast({
            icon: 'none',
            title: (loginErr && loginErr.data && loginErr.data.msg) || '登录失败'
        })
    }
},
```

- [ ] **Step 2: 确认 `authLogin` 已在文件顶部引入**

检查 [login/index.vue:48-51](file:///e:/code-github/baocun/daidaiUser/pages/login/index.vue#L48-L51)，确认 import 语句中已包含 `authLogin`：

```javascript
import {
    authLogin,
    authRegister
} from '@/api/user.js'
```

> 已确认：`authLogin` 已在第 49 行引入，无需修改。

---

### Task 2: 修改 `submit()` 方法 — 添加 `.catch()` 和登录回退

**Files:**
- Modify: `pages/login/index.vue:144-191`（`submit()` 方法）

**作用：** 为 `authRegister` 调用添加 `.catch()` 错误处理。在 catch 中判断错误是否为"手机号已注册"，若是则调用 `tryLogin()` 回退到登录流程；其他错误则刷新 code 供下次重试。

- [ ] **Step 1: 在 `authRegister(Pdata).then(...)` 链式调用末尾添加 `.catch()`**

将当前 `submit()` 方法（第 144-191 行）替换为以下完整代码：

```javascript
submit() {
    if (this.showMode) {
        uni.showLoading({
            title: "登录中...",
            mask: true
        })
        const Pdata  = {
            scene: "mobile_code_register",
            mobile: this.query.mobile,
            password: "",
            smsCode: this.query.yzm,
            uuid: this.sn,
            promoterId: uni.getStorageSync('promoterId') || '',
            runnerUserId: uni.getStorageSync('offline') || '',
            // #ifdef MP-WEIXIN
            weminiJsCode: this.session,
            // #endif
            // #ifdef MP-ALIPAY
            aliAuthCode: this.session
            // #endif
        }
        authRegister(Pdata).then(res => {
            //console.log(Pdata,PPdata555555555555111111)
            uni.hideLoading()
            uni.showToast({
                icon: 'none',
                title: res.msg
            })
            if (res.code == 200) {
                this.$store.commit('user/SET_TOKEN', res.token)
                this.$store.commit('user/SET_USERINFO', res.member)
                // #ifdef MP-WEIXIN
                uni.switchTab({
                    url: '/pages/index/index'
                })
                // #endif
                // #ifdef MP-ALIPAY
                uni.reLaunch({
                    url: '/pages/index/index'
                })
                // #endif
            }
        }).catch((err) => {
            const errMsg = (err && err.data && err.data.msg) || ''
            // 手机号已注册/已存在，回退到登录接口
            if (errMsg.indexOf('注册') !== -1 || errMsg.indexOf('已存在') !== -1) {
                this.tryLogin()
            } else {
                // 其他错误（如验证码错误），刷新code供下次重试
                uni.hideLoading()
                this.getSession()
            }
        })
    } else {
        this.showTips()
    }
},
```

**变更说明（与原代码的 diff）：**

1. **第 186 行后新增 `.catch()`**：原代码 `authRegister(Pdata).then(res => { ... })` 后没有 `.catch()`，新增 `.catch((err) => { ... })`
2. **catch 逻辑**：
   - 从 `err.data.msg` 提取错误信息（`err` 是 request.js 拦截器 reject 的 `response` 对象，`err.data` 是后端返回的 `{ code, msg }`）
   - 若错误信息包含"注册"或"已存在"关键词，说明手机号已注册，调用 `this.tryLogin()` 回退到登录流程
   - 其他错误（如验证码错误、网络错误），调用 `uni.hideLoading()` 关闭 loading，并调用 `this.getSession()` 刷新微信 code 供下次重试
3. **原 `then` 内代码不变**：注册成功（新用户）的逻辑完全保留

- [ ] **Step 2: 检查代码无语法错误**

在 HBuilder X 或微信开发者工具中打开 `pages/login/index.vue`，确认：
- `tryLogin()` 方法在 `submit()` 之前，两者之间有逗号分隔
- `submit()` 方法末尾有逗号（与后面的 `showTips` 方法分隔）
- `authLogin` 和 `authRegister` 都在顶部 import 中

---

### Task 3: 手动验证 — 全场景测试

**Files:**
- 无文件修改，仅手动测试

**测试环境：** 微信开发者工具 + 后端测试环境

- [ ] **Step 1: 测试新用户注册流程（正向流程不应被破坏）**

1. 使用一个未注册的手机号
2. 进入登录页，点击"手机短信登录/注册"
3. 输入手机号，点击"获取验证码"
4. 输入验证码，勾选用户协议
5. 点击"登录/注册"按钮
6. **预期：** 注册成功，跳转到首页
7. **验证：** 后端创建了新用户，前端获取到 token 和用户信息

- [ ] **Step 2: 测试已注册用户登录流程（核心修复点）**

1. 使用 Step 1 中已注册的手机号
2. 退出登录，回到登录页
3. 点击"手机短信登录/注册"
4. 输入已注册的手机号，获取验证码
5. 输入验证码，勾选用户协议
6. 点击"登录/注册"按钮
7. **预期：** 短暂显示"该手机号已被注册"提示后，自动切换到登录流程，最终登录成功跳转首页
8. **验证：** 前端获取到 token 和用户信息，首页正常显示用户数据

- [ ] **Step 3: 测试二次点击不再报 code been used（核心修复点）**

1. 使用已注册手机号，输入错误的验证码
2. 点击"登录/注册"按钮
3. **预期：** 显示错误提示（如"验证码错误"），不报 `40163 code been used`
4. 不修改验证码，再次点击"登录/注册"按钮
5. **预期：** 再次显示错误提示，仍然不报 `40163 code been used`
6. 修正验证码后点击"登录/注册"按钮
7. **预期：** 登录成功，跳转首页

- [ ] **Step 4: 测试未勾选用户协议**

1. 不勾选底部的用户协议复选框
2. 点击"登录/注册"按钮
3. **预期：** 显示"请勾选用户协议与隐私政策"提示，不发起网络请求

- [ ] **Step 5: 测试手机号快捷登录不受影响**

1. 点击"手机号快捷登录"按钮（非短信登录）
2. **预期：** 正常弹出微信手机号授权，功能不受本次修改影响

---

## 修复后的完整闭环分析

### 流程图

```
用户点击"登录/注册"
  ↓
勾选了用户协议？
  ├─ 否 → 提示"请勾选用户协议与隐私政策" → 结束
  └─ 是 ↓
     调用 authRegister（注册接口），传入 this.session（微信code）
       ↓
     返回 code == 200？
       ├─ 是 → 注册成功 → 存储 token → 跳转首页 → 结束 ✓
       └─ 否（Promise reject）↓
          catch 处理器：检查 errMsg
            ├─ 包含"注册"/"已存在" → 手机号已注册
            │   ↓
            │   调用 tryLogin()
            │     ↓
            │   刷新微信 code（getSession）
            │     ↓
            │   调用 authLogin（登录接口），传入新 code
            │     ↓
            │   返回 code == 200？
            │     ├─ 是 → 登录成功 → 存储 token → 跳转首页 → 结束 ✓
            │     └─ 否 → 显示错误 → 刷新 code → 用户可重试 ✓
            │           ↓
            │         tryLogin 的 catch → 显示错误 → 刷新 code → 用户可重试 ✓
            │
            └─ 不含"注册"（如验证码错误）
                ↓
                hideLoading + getSession（刷新code）
                  ↓
                用户可重新点击 → 使用全新 code → 不会报 40163 ✓
```

### 闭环验证清单

| 场景 | 注册接口结果 | 登录接口结果 | 最终状态 | 闭环？ |
|------|------------|------------|---------|--------|
| 新用户注册 | 成功 (200) | 不调用 | 登录成功 | ✓ |
| 已注册用户登录 | 失败（已被注册） | 成功 (200) | 登录成功 | ✓ |
| 已注册用户 + 登录接口也不支持 | 失败（已被注册） | 失败 | 显示登录错误，code已刷新，可重试 | ✓ |
| 验证码错误 | 失败（验证码错误） | 不调用 | 显示错误，code已刷新，可重试 | ✓ |
| 网络异常 | 失败（网络错误） | 不调用 | 显示错误，code已刷新，可重试 | ✓ |
| 二次点击（任何失败后） | 使用新 code | — | 不会报 40163 | ✓ |
| 未勾选协议 | 不发请求 | 不调用 | 提示勾选协议 | ✓ |

---

## 风险分析

### 风险1：后端可能不支持 `mobile_code_login` scene（中等风险）

**描述：** `authLogin` 接口（`/api/user/auth/login`）在 API 文档中只记录了 `wemini_auth_login` scene。后端是否支持 `mobile_code_login` scene 需要确认。

**影响：** 若后端不支持该 scene，登录接口会返回错误（如"不支持的场景"或"参数错误"），已注册用户无法通过短信验证码登录。

**缓解措施：**
1. 实施前与后端开发确认 `/api/user/auth/login` 接口是否支持 `mobile_code_login` scene
2. 若不支持，需要后端新增该 scene 的处理逻辑（验证手机号 + 短信验证码，返回 token）
3. 前端代码结构已做好兼容：即使登录接口失败，也会正确显示错误并刷新 code，不会产生新 bug

**备选方案（若后端不支持 `mobile_code_login`）：**
- 方案 B：后端修改 `authRegister` 接口，对已注册手机号改为登录逻辑（返回 token 而非报错），即"注册或登录"一体化。这样前端无需改动 `submit()` 的 then 逻辑。
- 方案 C：后端新增一个独立的短信登录接口，前端调用新接口。

### 风险2：错误关键词匹配可能不精准（低风险）

**描述：** catch 中通过 `errMsg.indexOf('注册') !== -1 || errMsg.indexOf('已存在') !== -1` 判断是否为"手机号已注册"错误。这依赖后端返回的 `msg` 文案。

**影响：** 若后端返回的"已注册"错误文案不包含"注册"或"已存在"关键词（如"该手机号已使用"），则不会触发登录回退，用户无法登录。

**缓解措施：**
1. 实施时通过实际测试确认后端返回的具体 `msg` 文案
2. 若文案不匹配，在 catch 的关键词列表中补充对应关键词
3. 最坏情况：错误不匹配时，走 else 分支，刷新 code，用户可重试。不会产生新 bug，只是已注册用户仍无法登录（与修复前状态一致）

### 风险3：拦截器 toast 与登录流程的 UX 闪烁（极低风险）

**描述：** 注册失败时，`request.js` 拦截器会先弹出"该手机号已被注册"提示，随后 `tryLogin()` 中 `uni.showLoading()` 会覆盖该提示。

**影响：** 用户可能短暂看到"该手机号已被注册"字样，然后变为"登录中..."loading。属于轻微的视觉闪烁，不影响功能。

**缓解措施：** 可接受，无需额外处理。`uni.showLoading` 会立即覆盖 toast。

---

## 不修改的文件（确认无副作用）

| 文件 | 原因 |
|------|------|
| [api/user.js](file:///e:/code-github/baocun/daidaiUser/api/user.js) | `authLogin` 和 `authRegister` 接口定义已存在，无需修改 |
| [common/utils/request.js](file:///e:/code-github/baocun/daidaiUser/common/utils/request.js) | 拦截器逻辑不需要修改，其错误提示行为可接受 |
| [common/utils/xunHelper.js](file:///e:/code-github/baocun/daidaiUser/common/utils/xunHelper.js) | `getWxLoginCode()` 方法已存在且工作正常 |
| [store/modules/user.js](file:///e:/code-github/baocun/daidaiUser/store/modules/user.js) | `wxUserLogin` action 不涉及本次修复 |
| `submit()` 的 `then` 分支 | 新用户注册成功逻辑完全保留，不做任何改动 |

---

## 范围外事项（不在本次修复中处理）

1. **"手机号快捷登录"按钮的类似问题：** `getphonenumber()` 方法（[login/index.vue:195-248](file:///e:/code-github/baocun/daidaiUser/pages/login/index.vue#L195-L248)）同样只调用 `authRegister`，对已注册用户也会返回错误。但它已有 `.catch()` + `this.getSession()` 的 code 刷新逻辑，不会出现 `40163` 报错。是否需要为它也添加登录回退，取决于后端 `wemini_mobile_register` scene 是否也拒绝已注册用户。如有需要，可参照本方案的模式另行处理。

2. **后端 `authRegister` 接口行为修复：** 若后端能将注册接口改为"注册或登录"一体化（对已注册手机号直接返回 token），则前端无需回退逻辑。但这属于后端改动，不在本计划范围内。

3. **自动化测试：** 本项目无前端测试框架（无 Jest/Vitest 配置），验证方式为手动测试。
