import { defineAppHotkeys, type Hotkey } from "@tanstack/react-hotkeys"

export const appHotkeys = defineAppHotkeys({
  "palette.open": {
    hotkey: "Mod+K",
    scope: "global",
    meta: {
      name: "Command palette",
      description: "Open quick search and actions",
    },
    options: {
      preventDefault: true,
      stopPropagation: true,
      ignoreInputs: false,
    },
  },
  "theme.toggle": {
    hotkey: "D",
    scope: "global",
    meta: {
      name: "Toggle theme",
      description: "Switch between dark and light theme",
    },
    options: { ignoreInputs: true },
  },
  "card.reveal": {
    hotkey: "Space",
    scope: "card",
    meta: {
      name: "Reveal answer",
      description: "Reveal hidden answer or output",
    },
    options: { ignoreInputs: true, preventDefault: true },
  },
  "card.known": {
    hotkey: "K",
    scope: "card",
    meta: { name: "Mark known", description: "Mark current card as known" },
    options: { ignoreInputs: true },
  },
  "card.revisit": {
    hotkey: "R",
    scope: "card",
    meta: {
      name: "Mark revisit",
      description: "Mark current card for revisit",
    },
    options: { ignoreInputs: true },
  },
  "card.prev": {
    hotkey: "ArrowLeft",
    scope: "card",
    meta: { name: "Previous card", description: "Navigate to previous card" },
    options: { ignoreInputs: true },
  },
  "card.next": {
    hotkey: "ArrowRight",
    scope: "card",
    meta: { name: "Next card", description: "Navigate to next card" },
    options: { ignoreInputs: true },
  },
  "card.back": {
    hotkey: "B",
    scope: "card",
    meta: { name: "Back to chapter", description: "Return to chapter list" },
    options: { ignoreInputs: true },
  },
  "nav.home": {
    hotkey: ["G", "H"],
    scope: "global",
    meta: { name: "Go home", description: "Navigate to handbook home" },
    options: { ignoreInputs: true, timeout: 800 },
  },
})

const HOTKEY_DISPLAY_OVERRIDES: Record<string, string> = {
  Space: "Space",
  ArrowLeft: "←",
  ArrowRight: "→",
  Backspace: "⌫",
}

export function formatHotkeyLabel(
  hotkey: Hotkey,
  formatForDisplay?: (hk: Hotkey) => string
): string {
  if (typeof hotkey === "string" && hotkey in HOTKEY_DISPLAY_OVERRIDES) {
    return HOTKEY_DISPLAY_OVERRIDES[hotkey]
  }
  const formatted = formatForDisplay
    ? formatForDisplay(hotkey)
    : Array.isArray(hotkey)
      ? hotkey.join(" ")
      : String(hotkey)
  return (
    formatted.trim() ||
    (Array.isArray(hotkey) ? hotkey.join(" ") : String(hotkey))
  )
}

export type AppHotkeyKey = keyof typeof appHotkeys
