# Yoga's Blog

基于 [Hugo](https://gohugo.io/) + [Stack 主题](https://github.com/CaiJimmy/hugo-theme-stack) 的个人博客，部署在 GitHub Pages。

## 项目结构

```
.
├── archetypes/          # 内容模板
├── assets/icons/        # 自定义图标
├── content/
│   ├── moments/         # 碎碎念（短内容）
│   ├── page/            # 独立页面：关于、归档、相册、友链、搜索
│   │   ├── about/
│   │   ├── archives/
│   │   ├── friends/
│   │   ├── gallery/
│   │   └── search/
│   └── post/            # 博客文章
│       ├── life/        # 生活
│       ├── reading/     # 阅读
│       ├── study/       # 学习
│       └── tech/        # 技术
├── data/
│   └── friends.yaml     # 友链数据
├── layouts/             # 自定义布局
│   ├── moments/list.html
│   ├── page/friends.html
│   └── page/gallery.html
├── static/              # 静态资源
│   └── index.html       # 自定义首页（保留）
└── config.yaml          # 站点配置
```

## 常用命令

```bash
# 本地预览
hugo server -D

# 构建（与 CI 一致）
hugo --minify
```

## 添加内容

```bash
# 写一篇博客
hugo new content post/tech/my-post/index.md

# 添加一条碎碎念
hugo new content moments/hello.md

# 添加一张照片到相册
# 将图片放入 content/page/gallery/ 即可自动展示

# 添加友链
# 编辑 data/friends.yaml，按现有示例添加
```

## 标签规则

现在只使用一套标签，不再区分“分类”和“标签”：

- `tags` 既表示文章方向，也表示具体主题，例如 `技术`、`学习`、`Hugo`、`部署`。
- 一篇文章建议使用 2—5 个标签；第一个可以写较大的方向，后面写具体技术或主题。
- `content/post/tech/`、`content/post/reading/` 等目录只是文件整理方式，不会自动生成分类页面。
- 标签名称尽量保持统一，例如始终使用 `GitHub Pages`，不要同时创建 `GitHubPages`。

文章示例：

```yaml
tags:
  - 技术
  - Hugo
  - GitHub Pages
  - 部署
```

## 发布碎碎念

碎碎念文件放在 `content/moments/`，适合记录短想法、当天状态和临时灵感。可以在本地创建：

```bash
hugo new content moments/today.md
```

编辑生成的 Markdown，把 `draft: true` 改成 `draft: false`，然后提交并推送：

```bash
git add content/moments/today.md
git commit -m "新增碎碎念"
git push origin main
```

碎碎念页面上的“在 GitHub 发布一条”按钮会打开仓库的新建文件页面。GitHub 会要求登录，只有拥有仓库写权限的账号才能直接提交；博客前端不保存 Token，也不会把编辑权限暴露给访客。

## 已启用功能

- 自定义首页（`static/index.html`）
- 标签索引 / 时间线归档
- 全文搜索
- Giscus 评论
- 不蒜子访问统计
- 响应式相册页面
- 友链页面
- 碎碎念时间轴
- 深色 / 浅色模式
- CC BY-NC-SA 4.0 文章许可

## 部署

推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 GitHub Pages。
