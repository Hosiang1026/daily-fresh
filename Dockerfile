# 使用官方 Node.js 镜像作为基础镜像
FROM node:18.12.1

# 创建并设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件到工作目录
COPY . .

# 暴露应用程序端口
EXPOSE 5000

# 启动应用程序
CMD ["node", "app.js"]
