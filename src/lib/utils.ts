export { cn } from "cn"

function parseHexColor(hex: string): [number, number, number] | null {
  const cleaned = hex.trim().replace(/^#/, "")
  if (cleaned.length === 3) {
    const r = Number.parseInt(cleaned[0] + cleaned[0], 16)
    const g = Number.parseInt(cleaned[1] + cleaned[1], 16)
    const b = Number.parseInt(cleaned[2] + cleaned[2], 16)
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
    return [r, g, b]
  }
  if (cleaned.length === 6) {
    const r = Number.parseInt(cleaned.slice(0, 2), 16)
    const g = Number.parseInt(cleaned.slice(2, 4), 16)
    const b = Number.parseInt(cleaned.slice(4, 6), 16)
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
    return [r, g, b]
  }
  return null
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (c: number) => {
    const srgb = c / 255
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/**
 * Returns a WCAG AA-passing foreground hex color (#0b0d12 or #ffffff)
 * for text placed directly on top of the given hex background color.
 */
export function getContrastForeground(backgroundHex: string): string {
  const rgb = parseHexColor(backgroundHex)
  if (!rgb) return "#0b0d12"

  const bgLum = relativeLuminance(rgb)
  const darkLum = relativeLuminance([11, 13, 18])
  const lightLum = 1

  const contrastDark =
    (Math.max(bgLum, darkLum) + 0.05) / (Math.min(bgLum, darkLum) + 0.05)
  const contrastLight =
    (Math.max(bgLum, lightLum) + 0.05) / (Math.min(bgLum, lightLum) + 0.05)

  return contrastDark >= contrastLight ? "#0b0d12" : "#ffffff"
}

export function getContrastRatio(
  foregroundHex: string,
  backgroundHex: string
): number {
  const fg = parseHexColor(foregroundHex)
  const bg = parseHexColor(backgroundHex)
  if (!fg || !bg) return 1
  const l1 = relativeLuminance(fg)
  const l2 = relativeLuminance(bg)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

export const DEFAULT_ACCENT = "#4a90e2"
export const DEFAULT_ACCENT_2 = "#ffd43b"

/**
 * Applies per-handbook accent CSS variables to document root while keeping
 * --accent-fg compliant with WCAG AA text contrast.
 */
export function applyHandbookAccent(
  accent = DEFAULT_ACCENT,
  accent2 = DEFAULT_ACCENT_2
): void {
  const root = document.documentElement
  root.style.setProperty("--accent", accent)
  root.style.setProperty("--accent-2", accent2)
  root.style.setProperty("--accent-fg", getContrastForeground(accent))
}

export function resetHandbookAccent(): void {
  applyHandbookAccent(DEFAULT_ACCENT, DEFAULT_ACCENT_2)
}
