#!/usr/bin/env bash
set -euo pipefail

BRANCH="${RELEASE_BRANCH:-main}"
REMOTE="${RELEASE_REMOTE:-origin}"

versioned=false
if [ -n "$(find .changeset -maxdepth 1 -name '*.md' ! -name README.md -print -quit)" ]; then
  npx changeset version
  git add .changeset package.json CHANGELOG.md
  git commit --no-verify -m "chore: version packages"
  git push --no-verify "$REMOTE" "HEAD:$BRANCH"
  versioned=true
fi

#NOTE: 0.0.0 means the package has never been released. A push with no changeset must not publish it.
version="$(node -p "require('./package.json').version")"
if [ "$versioned" = false ] && [ "$version" = "0.0.0" ]; then
  echo "No pending changesets and no release yet, nothing to publish."
  exit 0
fi

#NOTE: publish runs even when no changeset was consumed. It skips versions already on npm, so it also finishes a release whose publish step failed after the version commit landed.
npx changeset publish
git tag --points-at HEAD | xargs -r git push --no-verify "$REMOTE"
