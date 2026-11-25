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
  "shortcuts.open": {
    hotkey: "Shift+/",
    scope: "global",
    meta: {
      name: "Keyboard shortcuts",
      description: "Open the keyboard shortcuts dialog",
    },
    options: { ignoreInputs: true },
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
  "Shift+/": "?",
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

export interface ShortcutItem {
  id: string
  name: string
  description: string
  keys: string[]
  mode: "single" | "sequence" | "alternatives"
}

export interface ShortcutGroup {
  id: string
  title: string
  items: ShortcutItem[]
}

export function getShortcutGroups(
  formatForDisplay?: (hk: Hotkey) => string
): ShortcutGroup[] {
  const fmt = (hk: Hotkey) => formatHotkeyLabel(hk, formatForDisplay)
  const navHomeSeq = appHotkeys["nav.home"].hotkey
  const navHomeKeys = Array.isArray(navHomeSeq)
    ? navHomeSeq.map((part) => fmt(part as Hotkey))
    : [fmt(navHomeSeq ?? "G")]

  return [
    {
      id: "global",
      title: "Global & navigation",
      items: [
        {
          id: "palette.open",
          name: appHotkeys["palette.open"].meta?.name ?? "Command palette",
          description:
            appHotkeys["palette.open"].meta?.description ??
            "Open quick search and actions",
          keys: [fmt(appHotkeys["palette.open"].hotkey ?? "Mod+K")],
          mode: "single",
        },
        {
          id: "shortcuts.open",
          name: appHotkeys["shortcuts.open"].meta?.name ?? "Keyboard shortcuts",
          description:
            appHotkeys["shortcuts.open"].meta?.description ??
            "Open the keyboard shortcuts dialog",
          keys: [fmt(appHotkeys["shortcuts.open"].hotkey ?? "Shift+/")],
          mode: "single",
        },
        {
          id: "theme.toggle",
          name: appHotkeys["theme.toggle"].meta?.name ?? "Toggle theme",
          description:
            appHotkeys["theme.toggle"].meta?.description ??
            "Switch between dark and light theme",
          keys: [fmt(appHotkeys["theme.toggle"].hotkey ?? "D")],
          mode: "single",
        },
        {
          id: "nav.home",
          name: appHotkeys["nav.home"].meta?.name ?? "Go home",
          description:
            appHotkeys["nav.home"].meta?.description ??
            "Navigate to handbook home",
          keys: navHomeKeys,
          mode: "sequence",
        },
      ],
    },
    {
      id: "card",
      title: "Card reader",
      items: [
        {
          id: "card.reveal",
          name: appHotkeys["card.reveal"].meta?.name ?? "Reveal answer",
          description:
            appHotkeys["card.reveal"].meta?.description ??
            "Reveal hidden answer or output",
          keys: [fmt(appHotkeys["card.reveal"].hotkey ?? "Space")],
          mode: "single",
        },
        {
          id: "card.known",
          name: appHotkeys["card.known"].meta?.name ?? "Mark known",
          description:
            appHotkeys["card.known"].meta?.description ??
            "Mark current card as known",
          keys: [fmt(appHotkeys["card.known"].hotkey ?? "K")],
          mode: "single",
        },
        {
          id: "card.revisit",
          name: appHotkeys["card.revisit"].meta?.name ?? "Mark revisit",
          description:
            appHotkeys["card.revisit"].meta?.description ??
            "Mark current card for revisit",
          keys: [fmt(appHotkeys["card.revisit"].hotkey ?? "R")],
          mode: "single",
        },
        {
          id: "card.prev",
          name: appHotkeys["card.prev"].meta?.name ?? "Previous card",
          description:
            appHotkeys["card.prev"].meta?.description ??
            "Navigate to previous card",
          keys: [fmt(appHotkeys["card.prev"].hotkey ?? "ArrowLeft"), "P"],
          mode: "alternatives",
        },
        {
          id: "card.next",
          name: appHotkeys["card.next"].meta?.name ?? "Next card",
          description:
            appHotkeys["card.next"].meta?.description ??
            "Navigate to next card",
          keys: [fmt(appHotkeys["card.next"].hotkey ?? "ArrowRight"), "N"],
          mode: "alternatives",
        },
        {
          id: "card.back",
          name: appHotkeys["card.back"].meta?.name ?? "Back to chapter",
          description:
            appHotkeys["card.back"].meta?.description ??
            "Return to chapter list",
          keys: [fmt(appHotkeys["card.back"].hotkey ?? "B")],
          mode: "single",
        },
      ],
    },
  ]
}

export type AppHotkeyKey = keyof typeof appHotkeys
