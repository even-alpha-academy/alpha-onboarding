#!/usr/bin/env bash
# provision-intern.sh — create private per-intern exercise repos from templates, in-org,
# and wire access: intern push (own repo only), mentors-team review, alpha-mobile read-bridge.
# Full explanation + how to run it: the "כלי החופף" page on the onboarding site.
#
# Usage:   bash provision-intern.sh <github-username> <template> [<template> ...]
# Example: bash provision-intern.sh danacohen exercise-gate1 exercise-final-backend final-project-app
# Requires: gh authenticated as an even-alpha-academy owner/admin.

set -euo pipefail
ORG="even-alpha-academy"
REF_ORG="even-alpha"           # where the open/stub alpha-mobile lives
REF_REPO="alpha-mobile"

USER_LOGIN="${1:?usage: provision-intern.sh <username> <template> [<template> ...]}"; shift
[ "$#" -ge 1 ] || { echo "give at least one template (e.g. exercise-gate1)"; exit 2; }

for TPL in "$@"; do
  NEW="${TPL}-${USER_LOGIN}"
  echo "==> $ORG/$NEW  (from template $ORG/$TPL)"
  gh repo create "$ORG/$NEW" --private --template "$ORG/$TPL" >/dev/null
  # intern: push to their own repo only
  gh api -X PUT "repos/$ORG/$NEW/collaborators/$USER_LOGIN" -f permission=push >/dev/null
  echo "    ✓ created + intern invited (push)."
  # mentors team: review access (needs admin:org — non-fatal if missing)
  if gh api -X PUT "orgs/$ORG/teams/mentors/repos/$ORG/$NEW" -f permission=push >/dev/null 2>&1; then
    echo "    ✓ mentors team granted."
  else
    echo "    ⚠ mentors-team grant skipped (needs admin:org; you already have owner access)."
  fi
done

echo ""
echo "==> alpha-mobile read-bridge ($REF_ORG/$REF_REPO, read/pull)"
if gh api -X PUT "repos/$REF_ORG/$REF_REPO/collaborators/$USER_LOGIN" -f permission=pull >/dev/null 2>&1; then
  echo "    ✓ $USER_LOGIN invited with read (pull) on $REF_ORG/$REF_REPO."
else
  echo "    ⚠ read-bridge not granted (you need admin on $REF_ORG/$REF_REPO). Run manually:"
  echo "      gh api -X PUT repos/$REF_ORG/$REF_REPO/collaborators/$USER_LOGIN -f permission=pull"
fi

echo ""
echo "Done. $USER_LOGIN must ACCEPT the repo invitations before they can clone."
echo "Share with them: their repo URLs above + the onboarding site."
