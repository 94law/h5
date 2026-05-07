#!/bin/bash

# 部署目录
deploy_dir=$(dirname $(cd $(dirname $0); pwd))
# 归档目录
archive_dir=${deploy_dir}/archive
# pod名称
pod_name=$([ -z "$MY_POD_NAME" ] && hostname || echo "$MY_POD_NAME" )
# pod组名
pod_group_name=$(echo $pod_name | awk -F '-' '{print$(NF-1)}')
# pod分组文件路径
pod_group_file=${archive_dir}/pod_group/${pod_group_name}

merge_archive() {
  local pod_group_dir=$(dirname ${pod_group_file})

  if [ ! -d ${pod_group_dir} ]; then
    mkdir -p ${pod_group_dir}
  fi

  if [ ! -d ${archive_dir}/dist ]; then
    mkdir -p ${archive_dir}/dist
  fi

  if [ -f ${pod_group_file} ]; then
    echo "${pod_group_file} already exists, will ignore merging the archive file."
  else
    touch ${pod_group_file}
    cd ${deploy_dir}/dist && tar -cf - * | tar -C ${archive_dir}/dist -xf - && cd -
  fi

  rm -rf ${deploy_dir}/dist
  ln -s ${archive_dir}/dist ${deploy_dir}/dist

  echo "Merged the archive file successfully."
}

if [ -d ${archive_dir} ]; then
  merge_archive
else
  echo "\"${archive_dir}\" not found, please check if the directory is mounted."
fi
