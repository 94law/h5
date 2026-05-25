# 纯运行环境，没有任何打包、安装依赖逻辑
FROM nginx:stable-alpine

# 直接复制你【本地已经打包好的 dist 文件夹】
COPY dist /usr/share/nginx/html/

# 复制你的 nginx 配置（正确路径，别写错）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]