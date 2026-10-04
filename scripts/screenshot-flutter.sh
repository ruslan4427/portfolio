#!/usr/bin/env bash
# Capture the current iOS Simulator state into public/case-studies/<slug>/.
# Usage:
#   scripts/screenshot-flutter.sh boot                 # boot + open Simulator
#   scripts/screenshot-flutter.sh launch <app-dir>     # cd <app-dir> && flutter run
#   scripts/screenshot-flutter.sh capture <slug> <name>  # grab current frame
#
# Example flow:
#   scripts/screenshot-flutter.sh boot
#   scripts/screenshot-flutter.sh launch ~/fieldmark &
#   # (navigate the app in Simulator to the screen you want)
#   scripts/screenshot-flutter.sh capture fieldmark home.png
#   scripts/screenshot-flutter.sh capture fieldmark annotate.png

set -euo pipefail

DEVICE_NAME="${DEVICE_NAME:-iPhone 16 Pro}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

device_udid() {
  xcrun simctl list devices available \
    | grep -E "^[[:space:]]+${DEVICE_NAME} \(" \
    | head -1 \
    | sed -E 's/.*\(([0-9A-F-]+)\).*/\1/'
}

cmd_boot() {
  local udid
  udid="$(device_udid)"
  if [[ -z "$udid" ]]; then
    echo "error: no booted '${DEVICE_NAME}' found" >&2
    exit 1
  fi
  echo "booting ${DEVICE_NAME} (${udid})"
  xcrun simctl boot "$udid" 2>/dev/null || true
  open -a Simulator
}

cmd_launch() {
  local app_dir="${1:-}"
  if [[ -z "$app_dir" ]]; then
    echo "usage: $0 launch <flutter-app-dir>" >&2
    exit 2
  fi
  cd "$app_dir"
  flutter run -d "$(device_udid)"
}

cmd_capture() {
  local slug="${1:-}"
  local name="${2:-}"
  if [[ -z "$slug" || -z "$name" ]]; then
    echo "usage: $0 capture <slug> <name.png>" >&2
    exit 2
  fi
  local out_dir="${REPO_ROOT}/public/case-studies/${slug}"
  mkdir -p "$out_dir"
  local out_path="${out_dir}/${name}"
  xcrun simctl io booted screenshot --type=png "$out_path"
  echo "✓ ${out_path}"
}

case "${1:-}" in
  boot)    shift; cmd_boot "$@" ;;
  launch)  shift; cmd_launch "$@" ;;
  capture) shift; cmd_capture "$@" ;;
  *)
    echo "usage: $0 {boot|launch <app-dir>|capture <slug> <name>}" >&2
    exit 2
    ;;
esac
