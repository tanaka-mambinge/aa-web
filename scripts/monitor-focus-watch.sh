#!/usr/bin/env bash
set -euo pipefail

focus_key='org.gnome.desktop.wm.preferences'
focus_mode_key='focus-mode'
click_mode='click'
hover_mode='sloppy'
display_bus='org.gnome.Mutter.DisplayConfig'
display_path='/org/gnome/Mutter/DisplayConfig'

has_external_monitor() {
  gdbus call --session \
    --dest "$display_bus" \
    --object-path "$display_path" \
    --method org.freedesktop.DBus.Properties.Get "$display_bus" HasExternalMonitor \
    | grep -q true
}

apply_focus_mode() {
  local target_mode

  if has_external_monitor; then
    target_mode="$hover_mode"
  else
    target_mode="$click_mode"
  fi

  if [[ "$(gsettings get "$focus_key" "$focus_mode_key")" != "'$target_mode'" ]]; then
    gsettings set "$focus_key" "$focus_mode_key" "$target_mode"
    printf 'Set focus mode to %s\n' "$target_mode"
  fi
}

apply_focus_mode

gdbus monitor --session --dest "$display_bus" | while IFS= read -r line; do
  case "$line" in
    *MonitorsChanged*)
      apply_focus_mode
      ;;
  esac
done
