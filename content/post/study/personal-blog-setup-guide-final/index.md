---
title: "个人博客搭建完整方案文档"
description: "面向 macOS 用户的完整 Hugo + Stack 主题博客搭建指南，涵盖部署、评论、图床、音乐播放器等"
date: 2026-06-30
draft: false
categories:
  - 学习
tags:
  - Hugo
  - GitHub Pages
  - 博客搭建
  - Stack主题
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
| 背景音乐 | 本地 APlayer | 音频文件自己托管，稳定不受版权限制 |
| 图片存储 | Cloudflare R2 + PicGo | 免费 10GB，防止仓库臃肿 |
| 访问统计 | 不蒜子（Busuanzi） | 无需注册，两行代码接入 |

### 网站功能清单
- 文章发布（Markdown 写作）
- 标签（Tags）与分类（Categories）管理
- 相册 Gallery 页面
- 读书笔记 / 学习笔记专栏
- 时间轴归档页面
- 标签云
- 全文搜索
- 背景音乐播放器（悬浮固定组件）
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
      - type: categories
        params:
          limit: 10
      - type: tag-cloud
        params:
          limit: 20

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

# 菜单
menu:
  main:
    - name: 首页
      url: /
      weight: 1
      params:
        icon: home
    - name: 归档
      url: /archives/
      weight: 2
      params:
        icon: archives
    - name: 相册
      url: /gallery/
      weight: 3
      params:
        icon: photo
    - name: 读书笔记
      url: /categories/读书笔记/
      weight: 4
      params:
        icon: book
    - name: 学习笔记
      url: /categories/学习笔记/
      weight: 5
      params:
        icon: pencil
    - name: 说说
      url: /shuoshuo/
      weight: 6
      params:
        icon: message
    - name: 友链
      url: /links/
      weight: 7
      params:
        icon: link
    - name: 关于
      url: /about/
      weight: 8
      params:
        icon: user

# 分类法
taxonomies:
  category: categories
  tag: tags
  series: series
```

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
  contents: write

jobs:
  deploy:
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
          hugo-version: '0.124.0'    # 必须与本地版本一致
          extended: true             # 必须开启

      - name: Build
        run: hugo --minify

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          cname: ""                  # 无自定义域名留空
```

⚠️ `hugo-version` 的值必须与本地 `hugo version` 输出的版本号一致。

---

## 六、内容目录结构

```
content/
├── post/                      # 博客文章（主要内容）
│   ├── 我的第一篇文章/
│   │   ├── index.md
│   │   └── cover.jpg          # 封面图（通过 PicGo 上传到 R2 后粘贴链接）
│   ├── 读书笔记-活着/
│   │   ├── index.md
│   │   └── cover.jpg
│   └── 学习笔记-Git基础/
│       └── index.md
├── gallery/                   # 相册页面
│   └── index.md
├── shuoshuo/                  # 说说/碎碎念
│   └── index.md
├── about/                     # 关于页面
│   └── index.md
└── links/                     # 友情链接
    └── index.md
```

### 静态资源目录

```
static/
├── img/
│   └── avatar.png             # 头像文件（放这里）
├── music/
│   ├── song1.mp3              # 本地音频文件
│   └── cover1.jpg             # 音频封面图
└── favicon.ico                # 网站图标
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
lastmod: 2026-02-28T10:00:00+08:00
draft: false
categories:
  - 读书笔记
tags:
  - 标签1
  - 标签2
image: https://你的R2域名/images/cover.jpg   # 封面图使用 R2 链接
---

正文从这里开始...
```

**相册文章：**

```yaml
---
title: "2026年春天"
date: 2026-03-01T10:00:00+08:00
draft: false
categories:
  - 相册
tags:
  - 2026
  - 春天
---

![照片描述](https://你的R2域名/images/photo1.jpg)
![照片描述](https://你的R2域名/images/photo2.jpg)
```

**说说（碎碎念）：**

```yaml
---
title: "2026-03-01"
date: 2026-03-01T10:00:00+08:00
draft: false
categories:
  - 说说
---

今天读完了《活着》，心情很复杂...
```

### 7.2 草稿管理

```bash
# 本地预览（含草稿）
hugo server -D

# 本地预览（不含草稿，与线上一致）
hugo server

# 新建文章
hugo new post/文章标题/index.md
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

## 九、APlayer 背景音乐配置

### 9.1 准备音频文件

将 `.mp3` 音频文件和封面图放入 `static/music/` 目录：

```
static/music/
├── song1.mp3
├── song2.mp3
└── cover.jpg
```

### 9.2 注入播放器代码

创建文件 `layouts/partials/custom/head.html`（目录不存在则新建）：

```html
<!-- APlayer 背景音乐播放器 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css">
<script src="https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js"></script>

<div id="aplayer"></div>
<script>
const ap = new APlayer({
  container: document.getElementById('aplayer'),
  fixed: true,        // 固定在页面底部
  mini: true,         // 默认迷你模式
  autoplay: false,    // 默认不自动播放（部分浏览器会拦截自动播放）
  loop: 'all',        // 循环播放
  order: 'random',    // 随机播放
  volume: 0.4,
  audio: [
    {
      name: '歌曲名1',
      artist: '歌手名',
      url: '/music/song1.mp3',
      cover: '/music/cover.jpg'
    },
    {
      name: '歌曲名2',
      artist: '歌手名',
      url: '/music/song2.mp3',
      cover: '/music/cover.jpg'
    }
  ]
});
</script>
```

---

## 十、不蒜子访问统计配置

在 `layouts/partials/custom/head.html` 中追加以下代码（紧接在 APlayer 代码后面）：

```html
<!-- 不蒜子访问统计 -->
<script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
```

在文章模板中需要显示阅读量的位置（Stack 主题通常在 `layouts/partials/article/meta.html`）添加：

```html
<span>
  阅读量：<span id="busuanzi_value_page_pv"></span> 次
</span>
```

在页脚添加全站统计：

```html
<span>本站总访问量 <span id="busuanzi_value_site_pv"></span> 次</span>
```

---

## 十一、Cloudflare R2 图床配置

### 11.1 开通 R2

1. 登录 https://cloudflare.com，进入 "R2 Object Storage"
2. 需要绑定信用卡（扣 $0 验证，不产生费用）
3. 点击 "Create bucket"，命名为 `blog-images`，地区选 `APAC`（亚太，国内更快）
4. 进入 bucket → Settings → Public Access → 点击 "Allow Access"，获得公开访问域名（格式：`pub-xxx.r2.dev`）

### 11.2 创建 API Token

1. 进入 Cloudflare 右上角头像 → "My Profile" → "API Tokens"
2. 点击 "Create Token" → "Create Custom Token"
3. 权限设置：
   - Account → R2 Storage → Edit
4. 点击创建，**保存好 Token ID 和 Token Secret（只显示一次）**

### 11.3 安装并配置 PicGo

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

### 11.4 使用方式

- 截图后直接 **Command+Shift+P** 呼出 PicGo 上传剪贴板图片
- 或拖拽图片文件到 PicGo 窗口
- 上传成功后自动复制 Markdown 格式链接到剪贴板，直接粘贴到文章即可

---

## 十二、推送到 GitHub 并首次部署

### 12.1 在 GitHub 创建仓库

1. 登录 GitHub，点击右上角 "+" → "New repository"
2. **仓库名必须填写：`你的用户名.github.io`**（格式固定）
3. 设置为 **Public（公开）**
4. 不要勾选任何初始化选项，直接创建

### 12.2 推送代码

```bash
# 在项目根目录执行
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git
git add .
git commit -m "初始化博客"
git push -u origin main
```

### 12.3 设置 GitHub Pages

推送成功后：

1. 进入仓库页面 → Settings → Pages
2. Source 选择：**Deploy from a branch**
3. Branch 选择：`gh-pages` / `/(root)`
4. 点击 Save

⚠️ `gh-pages` 分支是第一次 GitHub Actions 运行成功后自动创建的。推送代码后等待 1-3 分钟，Actions 跑完后刷新 Settings → Pages 即可看到该分支。

### 12.4 验证部署

- 进入仓库 → "Actions" 标签页，查看工作流运行状态
- 绿色对勾 = 部署成功
- 访问 `https://你的用户名.github.io` 查看网站

---

## 十三、日常写作工作流

```bash
# 1. 新建文章
hugo new post/文章标题/index.md

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

## 十四、常见报错与解决方案

| 报错现象 | 原因 | 解决方法 |
|----------|------|----------|
| 样式完全不加载，页面空白 | 安装了普通版 Hugo，不是 Extended | 重装 Hugo Extended |
| Actions 报错 "theme not found" | submodule 没有被拉取 | 确认 `deploy.yml` 中 `submodules: recursive` 存在 |
| Actions 报错 template 错误 | 本地与 Actions 的 Hugo 版本不一致 | 修改 `deploy.yml` 中 `hugo-version` 与本地一致 |
| `config.yaml` 修改后网站崩溃 | YAML 格式错误（缩进或冒号） | 用 VS Code YAML 插件检查，错误会实时标红 |
| Giscus 评论框不显示 | 仓库非公开、未开启 Discussions、未安装 App | 按第八节步骤逐一检查 |
| 音乐播放器不显示 | `head.html` 路径不对 | 确认文件在 `layouts/partials/custom/head.html` |
| PicGo 上传失败 | R2 配置参数错误 | 检查 Endpoint 和 Bucket 名称是否正确 |
| 首次推送后 Pages 看不到 gh-pages 分支 | Actions 还未跑完 | 等待 1-3 分钟后刷新 |

---

## 十五、项目完整文件结构

```
你的用户名.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # 自动部署配置
├── config.yaml                 # 主配置文件
├── content/
│   ├── post/                   # 博客文章
│   ├── gallery/                # 相册
│   ├── shuoshuo/               # 说说
│   ├── about/                  # 关于
│   └── links/                  # 友情链接
├── static/
│   ├── img/
│   │   └── avatar.png          # 头像
│   ├── music/                  # 本地音频
│   │   ├── song1.mp3
│   │   └── cover.jpg
│   └── favicon.ico
├── layouts/
│   └── partials/
│       └── custom/
│           └── head.html       # 注入音乐播放器 + 统计代码
└── themes/
    └── hugo-theme-stack/       # 主题（submodule，不要手动修改）
```

---

## 十六、参考资源

| 资源 | 地址 |
|------|------|
| Hugo 官方文档 | https://gohugo.io/documentation/ |
| Stack 主题文档 | https://stack.jimmycai.com/ |
| Stack 主题 GitHub | https://github.com/CaiJimmy/hugo-theme-stack |
| Giscus 官网 | https://giscus.app |
| APlayer 文档 | https://aplayer.js.org |
| PicGo 下载 | https://github.com/Molunerfinn/PicGo/releases |
| 不蒜子统计 | https://busuanzi.ibruce.info |
| Cloudflare R2 文档 | https://developers.cloudflare.com/r2/ |
| GitHub Pages 文档 | https://docs.github.com/en/pages |

---

*文档版本：2.0 最终版 | 适用系统：macOS | 适用 Hugo 版本：0.120.0+ Extended*
*用户条件：无自定义域名，使用 GitHub Pages 免费托管*
