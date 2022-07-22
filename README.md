# Netless App Template

[Netless App 文档](https://github.com/netless-io/window-manager/blob/master/docs/develop-app.md)

## 快速开始

前置条件：至少需要安装了 `git`、`node 16`、`npm 8`。

1.  点击右上角 `Use this template` 生成一个属于你自己的仓库

    如果需要选用原生以外的模版，请勾上 `Include all branches`

    > 如果你安装了 [GitHub CLI](https://cli.github.com)，也可以用这个命令一键生成并 clone 本仓库
    >
    >     gh repo create your-app-name --template netless-io/community-apps --include-all-branches

2.  在 .env 文件里配置白板房间 UUID 和 Token

    请将本目录下的 .env.example 文件复制一份，重命名为 .env 或 .env.local 后，在里面填写必须的白板配置信息。你可以在 [Netless Workshop](https://workshop.netless.link) 申请专用的白板配置。

3.  执行 `npm install` 安装依赖

4.  执行 `npm start` 进行本地开发

## 提交到社区 App 列表

开发完 App 后，可以在 [Community Apps](https://github.com/netless-io/community-apps) 仓库提交你的项目，方便更多人发现和使用。

## 基础清单

- [x] 添加 .env 或 .env.local
- [x] 修改 package.json 里的 `name`，`private` 等字段
- [ ] (可选) 发布 npm 包
- [ ] 添加 License
- [x] 修改 README
- [x] (可选) 添加 Logo

## 开发清单

- [x] 基础布局完成
- [x] 点击鼠标，交互+音表现正确
- [x] 点击键盘，交互+音表现正确
- [x] 关闭/最小化时禁用键盘/鼠标事件
- [ ] 添加白板
- [ ] 支持外接设备
- [ ] 区分演奏模式及教学模式
- [ ] 内置基础歌曲词谱
- [ ] 切换乐器类型
- [ ] 不同键盘的适配
- [ ] 点击触摸板，交互+音表现正确（移动端，暂时不考虑）

## bug修复清单

- [x] 修复黑键active时样式不对的问题
- [x] 修复窗口关闭后仍然可以听到声音的 bug

## 优化

- [ ] 禁用窗口内部的全局 keydown 等事件
- [ ] 不允许多窗口
