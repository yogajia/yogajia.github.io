---
title: "个人博客搭建完整方案文档"
description: "面向 macOS 用户的 Hugo + Stack 主题博客搭建指南，涵盖部署、评论、图床与日常写作"
date: 2026-06-30
draft: false
tags:
  - 学习
  - Hugo
  - GitHub Pages
  - 博客搭建
---
# 个人博客搭建完整方案文档（最终版）

> **文档说明**：本文档面向所有 AI 智能体，提供完整、可执行的个人博客搭建方案。
> 用户环境：macOS，无自定义域名，使用 GitHub 用户名访问地址。
> 所有步骤均按顺序执行，完整走完即可得到一个功能齐全的个人博客。

---

## 一、最终技术栈

| 层级 | 选型 | 说明 |
|------|------|------|
| 静态网站生成器 | Hugo Extended | 必须是 Extended 版本 |
| 主题 | Stack | 原生支持标签、相册、时间轴、搜索 |
| 代码托管 + 网站托管 | GitHub Pages | 访问地址：`https://用户名.github.io` |
| 自动部署 | GitHub Actions | 推送代码后自动构建发布 |
| 评论系统 | Giscus | 基于 GitHub Discussions，免费 |
| 图片存储 | Cloudflare R2 + PicGo | 免费 10GB，防止仓库臃肿 |
| 访问统计 | 不蒜子（Busuanzi） | 无需注册，两行代码接入 |

### 网站功能清单
- 文章发布（Markdown 写作）
- 标签管理（统一的主题索引）
- 相册 Gallery 页面
- 读书笔记 / 学习笔记专栏
- 时间轴归档页面
- 标签云
- 全文搜索
- 评论与留言功能（Giscus）
- 说说 / 碎碎念（短内容记录）
- 友情链接页面
- 文章阅读量统计（不蒜子）
- 深色 / 浅色模式切换

---

## 二、环境准备（macOS）

### 2.1 安装 Homebrew（如已安装跳过）

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2.2 安装 Hugo Extended

```bash
brew install hugo
```

**验证安装，输出中必须包含 "extended"：**

```bash
hugo version
# 正确示例：hugo v0.124.0+extended darwin/arm64
```

⚠️ 如果输出中没有 "extended"，说明安装的是普通版，Stack 主题的样式将无法编译。此时执行：
```bash
brew uninstall hugo
brew install hugo --HEAD
```

### 2.3 安装 Git（macOS 通常已自带）

```bash
git --version   # 有输出则说明已安装

# 未安装则执行：
brew install git
```

**配置 Git 用户信息：**

```bash
git config --global user.name "你的名字"
git config --global user.email "你的GitHub注册邮箱"
```

### 2.4 安装 VS Code（推荐编辑器）

前往 https://code.visualstudio.com 下载安装。

**推荐安装的 VS Code 插件：**

| 插件名 | 用途 |
|--------|------|
| Markdown All in One | Markdown 编写增强 |
| YAML | 配置文件语法检查，错误实时标红 |
| Front Matter CMS | 可视化管理文章元数据 |
| GitLens | Git 历史可视化 |

---

## 三、创建 Hugo 项目

### 3.1 初始化项目

```bash
# 在你希望存放项目的目录下执行（例如 ~/Documents）
cd ~/Documents

# 创建新网站，my-blog 可替换为你喜欢的名字
hugo new site my-blog
cd my-blog

# 初始化 Git 仓库
git init
```

### 3.2 安装 Stack 主题

⚠️ 必须通过 `git submodule` 安装，不要手动复制文件。

```bash
git submodule add https://github.com/CaiJimmy/hugo-theme-stack themes/hugo-theme-stack
```

### 3.3 复制示例配置

```bash
# 将主题内置的示例网站配置复制到项目根目录
cp -r themes/hugo-theme-stack/exampleSite/config.yaml .
cp -r themes/hugo-theme-stack/exampleSite/content .
```

---

## 四、配置文件（config.yaml）

删除根目录下原有的 `config.toml`（如有），使用以下完整 `config.yaml` 替换：

⚠️ 将所有 `你的用户名` 替换为你的真实 GitHub 用户名。

```yaml
baseurl: https://你的用户名.github.io/
languageCode: zh-cn
title: 我的个人博客
theme: hugo-theme-stack
paginate: 10

defaultContentLanguage: zh-cn
hasCJKLanguage: true

outputs:
  home:
    - HTML
    - RSS
    - JSON        # 搜索功能需要

params:
  mainSections:
    - post

  # 个人信息（显示在侧边栏）
  author:
    name: 你的名字
    bio: 一段简短的个人介绍
    avatar: img/avatar.png    # 头像放在 static/img/avatar.png

  # 页脚
  footer:
    since: 2026
    customText: ""

  # 文章默认设置
  article:
    math: false
    toc: true
    readingTime: true
    license:
      enabled: false

  # 评论（Giscus，参数在第八节获取后填入）
  comments:
    enabled: true
    provider: giscus
    giscus:
      repo: 你的用户名/你的用户名.github.io
      repoID: 从giscus.app获取后填入
      category: Announcements
      categoryID: 从giscus.app获取后填入
      mapping: pathname
      lightTheme: light
      darkTheme: dark_dimmed
      lang: zh-CN

  # 侧边栏小部件
  widgets:
    homepage:
      - type: search
      - type: archives
        params:
          limit: 5
      - type: tag-cloud
        params:
          limit: 12

  # 色彩主题
  colorScheme:
    toggle: true
    default: auto    # auto 跟随系统，可改为 light 或 dark

  # 图片处理
  imageProcessing:
    cover:
      enabled: true
    content:
      enabled: true

# 分类法：只保留标签，避免"分类 + 标签"双重体系
taxonomies:
  tag: tags

# 菜单
menu:
  main:
    - name: 首页
      url: /
      weight: 10
      params:
        icon: home
    - name: 归档
      url: /page/archives/
      weight: 20
      params:
        icon: archives
    - name: 标签
      url: /tags/
      weight: 30
      params:
        icon: tag
    - name: 相册
      url: /page/gallery/
      weight: 40
      params:
        icon: album
    - name: 友链
      url: /page/friends/
      weight: 50
      params:
        icon: link
    - name: 碎碎念
      url: /moments/
      weight: 60
      params:
        icon: messages
    - name: 关于
      url: /page/about/
      weight: 70
      params:
        icon: user
```

> **为什么没有"分类"？** 分类（categories）和标签（tags）功能高度重叠，双重体系容易混乱。本站只用标签：每篇文章打 1 个栏目级标签（技术 / 学习 / 读书 / 生活 / 娱乐）+ 1~3 个主题关键词标签（如 Hugo、Git）。文章按栏目放进 `content/post/` 的子目录，仅作文件整理，不参与 URL 和索引。

---

## 五、GitHub Actions 自动部署配置

### 5.1 创建工作流文件

```bash
mkdir -p .github/workflows
```

创建文件 `.github/workflows/deploy.yml`，内容如下：

```yaml
name: Deploy Hugo site to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive      # 关键：拉取主题 submodule
          fetch-depth: 0

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.157.0'    # 与本地版本保持一致
          extended: true             # 必须开启

      - name: Build
        run: hugo --gc --minify

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

⚠️ `hugo-version` 的值必须与本地 `hugo version` 输出的版本号一致。该工作流使用官方 `actions/deploy-pages` 直接发布构建产物，不再需要 `gh-pages` 分支。

---

## 六、内容目录结构

```
content/
├── post/                      # 博客文章（子目录仅作文件整理，索引靠标签）
│   ├── tech/                  # 技术
│   ├── study/                 # 学习笔记
│   ├── reading/               # 读书笔记
│   ├── life/                  # 生活随笔
│   └── enjoyment/             # 兴趣娱乐
├── moments/                   # 碎碎念（一条一个 .md 文件）
│   └── 2026-03-01.md
└── page/                      # 独立页面
    ├── about/                 # 关于
    ├── archives/              # 归档（时间轴）
    ├── friends/               # 友链（数据在 data/friends.yaml）
    ├── gallery/               # 相册（图片放进目录即自动成网格）
    └── search/                # 搜索
```

### 静态资源目录

```
static/
├── images/
│   ├── favicon.png            # 网站图标
│   └── thinking.jpg           # 头像
└── index.html                 # 自定义首页
```

---

## 七、文章写作规范

### 7.1 Front Matter 模板

**普通文章：**

```yaml
---
title: "文章标题"
description: "文章简介，显示在列表页"
date: 2026-02-28T10:00:00+08:00
draft: false
tags:
  - 技术        # 第 1 个标签写栏目：技术 / 学习 / 读书 / 生活 / 娱乐
  - Hugo        # 后面跟 1~3 个主题关键词
  - Git
image: https://你的R2域名/images/cover.jpg   # 封面图使用 R2 链接
---

正文从这里开始...
```

**标签使用规则：**

| 层级 | 作用 | 示例 | 数量 |
|------|------|------|------|
| 栏目标签 | 对应 `content/post/` 的子目录，标明文章属于哪个大类 | 技术、学习、读书、生活、娱乐 | 每篇 1 个 |
| 主题标签 | 描述文章讲了什么，方便同主题聚合 | Hugo、Git、活着、旅行 | 每篇 1~3 个 |

新起主题标签前先到 `/tags/` 页面看看有没有含义相近的旧标签，能复用就复用，避免"Git / git / Git基础"这类碎片化。

**相册：** 不需要写文章，把图片文件直接放进 `content/page/gallery/` 目录，相册页会自动生成网格并支持点击看大图。

**碎碎念：**

```yaml
---
title: ""
date: 2026-03-01T10:00:00+08:00
draft: false
---

今天读完了《活着》，心情很复杂...
```

碎碎念不需要标题和标签，一条一个文件，放在 `content/moments/` 下（建议以日期命名，如 `2026-03-01.md`）。除了本地写完 push，也可以点击碎碎念页面顶部的"在 GitHub 发布一条"按钮，直接在 GitHub 网页端新建文件并提交——只有拥有仓库写权限的账号（也就是你自己）才能提交，提交后 Actions 自动构建发布。

### 7.2 草稿管理

```bash
# 本地预览（含草稿）
hugo server -D

# 本地预览（不含草稿，与线上一致）
hugo server

# 新建文章（archetypes 模板会自动填好 front matter）
hugo new post/tech/文章标题/index.md

# 新建一条碎碎念
hugo new moments/2026-03-01.md
```

---

## 八、Giscus 评论系统配置

### 8.1 前置条件

1. 博客仓库必须是**公开仓库（Public）**
2. 进入仓库页面 → Settings → Features → 勾选 **Discussions**

### 8.2 安装 Giscus App

访问 https://github.com/apps/giscus，点击 Install，选择你的博客仓库。

### 8.3 获取配置参数

1. 访问 https://giscus.app
2. 在 "Repository" 填入：`你的用户名/你的用户名.github.io`
3. Discussion Category 选择 **Announcements**
4. 页面下方会生成配置代码，从中复制 `repoID` 和 `categoryID` 填入 `config.yaml`

---

## 九、不蒜子访问统计配置

创建文件 `layouts/_partials/head/custom.html`（目录不存在则新建），加入统计脚本：

```html
<script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
```

创建文件 `layouts/_partials/footer/custom.html`，在页脚展示全站统计：

```html
<div style="text-align: center; font-size: 0.85em; color: #999; margin-top: 10px;">
  本站总访问量 <span id="busuanzi_value_site_pv"></span> 次 &nbsp;|&nbsp;
  总访客数 <span id="busuanzi_value_site_uv"></span> 人
</div>
```

> 注意：Hugo 0.146+ 的自定义模板目录是 `layouts/_partials/`（带下划线），旧教程里的 `layouts/partials/` 路径已失效。

---

## 十、Cloudflare R2 图床配置

### 10.1 开通 R2

1. 登录 https://cloudflare.com，进入 "R2 Object Storage"
2. 需要绑定信用卡（扣 $0 验证，不产生费用）
3. 点击 "Create bucket"，命名为 `blog-images`，地区选 `APAC`（亚太，国内更快）
4. 进入 bucket → Settings → Public Access → 点击 "Allow Access"，获得公开访问域名（格式：`pub-xxx.r2.dev`）

### 10.2 创建 API Token

1. 进入 Cloudflare 右上角头像 → "My Profile" → "API Tokens"
2. 点击 "Create Token" → "Create Custom Token"
3. 权限设置：
   - Account → R2 Storage → Edit
4. 点击创建，**保存好 Token ID 和 Token Secret（只显示一次）**

### 10.3 安装并配置 PicGo

1. 下载 PicGo：https://github.com/Molunerfinn/PicGo/releases
   - macOS 下载 `.dmg` 文件
2. 打开 PicGo → 插件设置 → 搜索 `s3` → 安装 `picgo-plugin-s3`
3. 图床设置 → Amazon S3 → 填入：

| 字段 | 填入内容 |
|------|----------|
| AccessKeyId | R2 API Token ID |
| SecretAccessKey | R2 API Token Secret |
| Bucket | blog-images |
| Endpoint | `https://你的账户ID.r2.cloudflarestorage.com` |
| UrlPrefix | `https://pub-xxx.r2.dev/`（你的 R2 公开域名） |
| PathStyleAccess | 开启 |

4. 设为默认图床，点击确认

### 10.4 使用方式

- 截图后直接 **Command+Shift+P** 呼出 PicGo 上传剪贴板图片
- 或拖拽图片文件到 PicGo 窗口
- 上传成功后自动复制 Markdown 格式链接到剪贴板，直接粘贴到文章即可

---

## 十一、推送到 GitHub 并首次部署

### 11.1 在 GitHub 创建仓库

1. 登录 GitHub，点击右上角 "+" → "New repository"
2. **仓库名必须填写：`你的用户名.github.io`**（格式固定）
3. 设置为 **Public（公开）**
4. 不要勾选任何初始化选项，直接创建

### 11.2 推送代码

```bash
# 在项目根目录执行
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git
git add .
git commit -m "初始化博客"
git push -u origin main
```

### 11.3 设置 GitHub Pages

推送成功后：

1. 进入仓库页面 → Settings → Pages
2. Source 选择：**GitHub Actions**

⚠️ 本方案通过 `actions/deploy-pages` 直接发布构建产物，不会创建 `gh-pages` 分支，Source 必须选 GitHub Actions 而不是 Deploy from a branch。

### 11.4 验证部署

- 进入仓库 → "Actions" 标签页，查看工作流运行状态
- 绿色对勾 = 部署成功
- 访问 `https://你的用户名.github.io` 查看网站

---

## 十二、日常写作工作流

```bash
# 1. 新建文章（放进对应栏目目录：tech / study / reading / life / enjoyment）
hugo new post/tech/文章标题/index.md

# 2. 用 VS Code 打开项目编写文章
code .

# 3. 图片通过 PicGo 上传到 R2，复制链接粘贴到文章

# 4. 本地预览
hugo server

# 5. 确认无误，发布
git add .
git commit -m "新增文章：文章标题"
git push

# GitHub Actions 自动触发，1-3 分钟后网站更新
```

---

## 十三、常见报错与解决方案

| 报错现象 | 原因 | 解决方法 |
|----------|------|----------|
| 样式完全不加载，页面空白 | 安装了普通版 Hugo，不是 Extended | 重装 Hugo Extended |
| Actions 报错 "theme not found" | submodule 没有被拉取 | 确认 `deploy.yml` 中 `submodules: recursive` 存在 |
| Actions 报错 template 错误 | 本地与 Actions 的 Hugo 版本不一致 | 修改 `deploy.yml` 中 `hugo-version` 与本地一致 |
| `config.yaml` 修改后网站崩溃 | YAML 格式错误（缩进或冒号） | 用 VS Code YAML 插件检查，错误会实时标红 |
| Giscus 评论框不显示 | 仓库非公开、未开启 Discussions、未安装 App | 按第八节步骤逐一检查 |
| PicGo 上传失败 | R2 配置参数错误 | 检查 Endpoint 和 Bucket 名称是否正确 |
| 推送后网站没更新 | Actions 还在运行或构建失败 | 到仓库 Actions 页查看运行日志 |
| 自定义模板不生效 | 模板放在旧路径 `layouts/partials/` | Hugo 0.146+ 应放在 `layouts/_partials/` |

---

## 十四、项目完整文件结构

```
你的用户名.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # 自动部署配置
├── config.yaml                 # 主配置文件
├── archetypes/                 # hugo new 模板（post / moments / page）
├── assets/
│   └── scss/
│       └── custom.scss         # 全站配色与样式覆盖
├── content/
│   ├── post/                   # 博客文章（tech / study / reading / life / enjoyment）
│   ├── moments/                # 碎碎念
│   └── page/                   # 独立页面（about / archives / friends / gallery / search）
├── data/
│   └── friends.yaml            # 友链数据
├── layouts/
│   ├── archives.html           # 归档页（年份时间轴）
│   ├── _default/               # 标签索引页 + 单个标签页
│   ├── moments/                # 碎碎念时间轴
│   ├── page/                   # 友链、相册模板
│   └── _partials/
│       ├── head/custom.html    # 注入统计代码
│       └── footer/custom.html  # 页脚全站统计
├── static/
│   ├── images/                 # favicon、头像
│   └── index.html              # 自定义首页
└── themes/
    └── hugo-theme-stack/       # 主题（submodule，不要手动修改）
```

---

## 十五、参考资源

| 资源 | 地址 |
|------|------|
| Hugo 官方文档 | https://gohugo.io/documentation/ |
| Stack 主题文档 | https://stack.jimmycai.com/ |
| Stack 主题 GitHub | https://github.com/CaiJimmy/hugo-theme-stack |
| Giscus 官网 | https://giscus.app |
| PicGo 下载 | https://github.com/Molunerfinn/PicGo/releases |
| 不蒜子统计 | https://busuanzi.ibruce.info |
| Cloudflare R2 文档 | https://developers.cloudflare.com/r2/ |
| GitHub Pages 文档 | https://docs.github.com/en/pages |

---

*文档版本：3.0（2026-09 架构重构后同步：移除背景音乐，分类与标签合并为单一标签体系）*
*适用系统：macOS | 适用 Hugo 版本：0.157.0+ Extended | 无自定义域名，使用 GitHub Pages 免费托管*
