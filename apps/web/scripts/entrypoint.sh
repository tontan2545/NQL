#!/bin/bash
# no verbose
set +x
# config
envFilename='./apps/web/.env.production'
nextFolder='./apps/web/.next/'

echo "Apply path"

while read -r line; do
  # no comment or not empty
  echo "Check: $line"
  if [ "${line:0:1}" == "#" ] || [ "${line}" == "" ]; then
    continue
  fi

  # split
  configName="$(cut -d'=' -f1 <<<"$line")"
  configValue="$(cut -d'=' -f2 <<<"$line")"
  # get system env
  envValue=$(env | grep "^$configName=" | grep -oe '[^=]*$')

  echo "Config: ${configName} = ${configValue}"

  # if config found
  if [ -n "$configValue" ] && [ -n "$envValue" ]; then
    # replace all
    echo "Replace: ${configValue} with: ${envValue}"
    find $nextFolder \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#$configValue#$envValue#g"
  fi
done <$envFilename

echo "Starting Nextjs"
node ./apps/web/server.js
