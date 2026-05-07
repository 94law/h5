#!/bin/bash

target=$NVM_DIR/nvm.sh
matched=$(grep "\$NVM_NODEJS_ORG_ARCH" "$target")

if [ -z "$matched" ]; then
  # 对nvm.sh文件进行修改，支持通过$NVM_NODEJS_ORG_ARCH 环境变量指定架构
  sed -i 's/nvm_get_arch()[ \t]*{/nvm_get_arch() \{\n if [ -n "$NVM_NODEJS_ORG_ARCH" ]; then\n  nvm_echo "$NVM_NODEJS_ORG_ARCH"\n  return\n fi\n/g' "$target"
fi
