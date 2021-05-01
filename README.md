## 项目介绍
木兰湾图片分享是基于人脸识别、人脸比对的图片分享系统。用户上传照片系统自动识别出人脸，并通过人脸比对搜索相似人脸的照片。系统还可以通过爬虫模块爬取网络照片，以检索相似人脸照片的网页信息。

该系统是前后端分离的项目，当前项目mulanbay-face-mobile为前端移动版本，需要结合后端项目才能完整访问。

后端项目：
* 服务器端[mulanbay-face-server](https://github.com/mulanbay-face/mulanbay-face-server)

前端项目：

* 后台管理(PC端) [mulanbay-face-admin](https://github.com/mulanbay-face/mulanbay-face-admin)
* 图片分享(移动端) [mulanbay-face-mobile](https://github.com/mulanbay-face/mulanbay-face-mobile)

[木兰湾项目说明](https://gitee.com/mulanbay-face)

## 开发说明

### 所用技术

Vue、Element UI、Echarts

### 开发环境

```bash
# 克隆项目

# 进入项目目录
cd mulanbay-face-admin

# 安装依赖
npm install

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

### 正式环境

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```
## 项目截图
<table>
    <tr>
        <td><img src="https://images.gitee.com/uploads/images/2021/0501/083208_81b75cf1_352331.png"/></td>
        <td><img src="https://images.gitee.com/uploads/images/2021/0501/083222_d112a48a_352331.png"/></td>
    </tr>

</table>