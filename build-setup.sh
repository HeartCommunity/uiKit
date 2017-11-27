#!/usr/bin/env bash

# These are used to sign commits when pushing back to Bitbucket
# No auth is required as we use ssh from pipelines instead
git config --global user.email "$BOT_ACCOUNT_EMAIL"
git config --global user.name "$BOT_ACCOUNT_NAME"
git config --global push.default simple

# we rebase at the very top of build so that we'll get any missing release commits.
# This can introduce a tiny race condition where anything that was merged between us
# starting and this rebase will get pulled in and released in this build. This is much
# better than the alternative of pulling later and not testing the code
if [ "$BITBUCKET_BRANCH" = "master" ]; then
  echo "Rebasing on master to ensure we have all release commits from master..."
  git fetch
  git pull --rebase origin master
fi

# NOTE: the node image comes with a version of yarn installed already in /opt/yarn
# We put our yarn path at the front of the PATH var so that we use our version instead of theirs
curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.2.1
export PATH=$HOME/.yarn/bin:$PATH

## Installing bolt - we grab the range specified in the package.json so that we install the latest
## version that satisfies that
BOLT_VERSION=`node -e 'console.log(require("./package.json").bolt.version)'`
echo "Installing bolt@$BOLT_VERSION"
yarn global add bolt@$BOLT_VERSION


# $NPM_TOKEN is the auth token for the "atlaskit" user
npm set //registry.npmjs.org/:_authToken=$NPM_TOKEN
# For some reason, the npm dist-tag commands are hitting yarnpkg and not npmjs
npm set //registry.yarnpkg.com/:_authToken=$NPM_TOKEN

# Forces `chalk` to display colored output in pipelines
export FORCE_COLOR=1
yarn config set color always

# zip for website deploy
apt-get -y update
apt-get -y install zip
