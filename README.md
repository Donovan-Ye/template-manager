# @meta-carbon/mpm

CLI工具用于处理私有源的相关配置。

## Usage

目前仅支持`init`命令，在当前项目下初始化 .npmrc 和 package.json 文件，添加私有源下载和发布的相关配置。

```bash
# npm
npx @meta-carbon/mpm init

# pnpm
pnpm dlx @meta-carbon/mpm init
```

或者下载安装包后使用：

```bash
npm install -g @meta-carbon/mpm
```

```bash
mpm init
```
