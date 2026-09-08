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
│   ├── friends.yaml     # 友链数据
│   └── music.yaml       # 背景音乐播放列表
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

## 已启用功能

- 自定义首页（`static/index.html`）
- 分类 / 标签 / 归档
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
