import { useEffect, type ReactNode } from "react"
import { HotkeysProvider, useHotkey } from "@tanstack/react-hotkeys"
import { MotionConfig } from "motion/react"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { appHotkeys } from "@/lib/keyboard"
import { resolveTheme, useSettingsStore } from "@/store/useSettingsStore"

function SettingsDomSync() {
  const theme = useSettingsStore((s) => s.theme)
  const fontScale = useSettingsStore((s) => s.fontScale)
  const reducedMotion = useSettingsStore((s) => s.reducedMotion)
  const toggleTheme = useSettingsStore((s) => s.toggleTheme)

  useHotkey(appHotkeys["theme.toggle"], () => {
    toggleTheme()
  })

  useEffect(() => {
    const apply = () => {
      const root = document.documentElement
      const resolved = resolveTheme(theme)
      root.classList.remove("dark", "light")
      root.classList.add(resolved)
    }

    apply()

    if (theme !== "system") return undefined

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--font-scale", String(fontScale))
  }, [fontScale])

  useEffect(() => {
    const root = document.documentElement
    if (reducedMotion === true) {
      root.setAttribute("data-reduced-motion", "true")
    } else if (reducedMotion === false) {
      root.setAttribute("data-reduced-motion", "false")
    } else {
      root.removeAttribute("data-reduced-motion")
    }
  }, [reducedMotion])

  return null
}

export function Providers({ children }: { children: ReactNode }) {
  const reducedMotion = useSettingsStore((s) => s.reducedMotion)
  const motionPolicy =
    reducedMotion === true
      ? "always"
      : reducedMotion === false
        ? "never"
        : "user"

  return (
    <HotkeysProvider appHotkeys={appHotkeys}>
      <MotionConfig reducedMotion={motionPolicy}>
        <TooltipProvider delayDuration={150}>
          <SettingsDomSync />
          {children}
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </MotionConfig>
    </HotkeysProvider>
  )
}
