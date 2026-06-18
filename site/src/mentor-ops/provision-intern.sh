#!/usr/bin/env bash
# provision-intern.sh — create a private per-intern exercise repo from a template, in-org.
#
# Replaces GitHub Classroom (sunset Aug 2026). Fully in-org, no external service.
# Requires: gh authenticated as an org owner/admin with `repo` scope (creating repos + adding the
# intern). The optional `mentors`-team grant needs `admin:org` — if that scope is missing it's
# skipped with a warning (you, the owner, already have access; run `gh auth refresh -s admin:org`
# to enable the team grant for OTHER mentors).
#
# Usage:
#   ./provision-intern.sh <github-username> <template> [<template> ...]
# Example:
#   ./provision-intern.sh danacohen exercise-gate1 exercise-final-backend
#
# What it does per template:
#   1. Creates  even-alpha-academy/<template>-<username>  (PRIVATE) from the template repo.
#   2. Grants the intern PUSH access to *their* repo only.
#   3. Grants the `mentors` team review (push) access.
#   4. (alpha-mobile read-bridge) grants the intern read (pull) on the open/stub alpha-mobile
#      reference repo. Needs admin on even-alpha/alpha-mobile; skipped with a warning otherwise.
#
# Isolation comes from the org setting base-permission=None (already set): a member can't see
# any private repo they weren't explicitly added to — so interns never see each other's work.

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
