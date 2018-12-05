#!/bin/bash
defaultHookPath=".git/hooks"
projectHookPath="bin/hooks"
if [ -d ${projectHookPath} -a -d ${defaultHookPath} ]
then
  echo -e "\nHook directory exists"
  echo -e "\nSymlinking git hook"
  for file in `ls ${projectHookPath}`;
    do ln -sf "../../${projectHookPath}/${file}" "${defaultHookPath}/${file}";
    echo -e "\nRemoving sample hooks"
    rm -f "${defaultHookPath}/${file}.sample";
  done;
  # git config core.hooksPath ${projectHookPath};
else
    echo -e "\nHook directory not present"
fi
