#!/bin/bash - 
#===============================================================================
#
#          FILE: build_docker.sh
# 
#         USAGE: KEY_NAME=<git_private_key_name> ./build_docker.sh 
# 
#   DESCRIPTION: 
# 
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: YOUR NAME (), 
#  ORGANIZATION: 
#       CREATED: 12/28/2020 16:10
#      REVISION:  ---
#===============================================================================

set -o nounset                              # Treat unset variables as an error

PRIVATE_KEY=$(< ~/.ssh/"$KEY_NAME")

if [[ -n $PRIVATE_KEY ]]; then
    GIT_SSH_KEY="$PRIVATE_KEY" docker-compose build
else
    echo "Please set KEY_NAME with the name of the private key to use"
    exit 1
fi
