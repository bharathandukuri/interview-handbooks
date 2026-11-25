import {
  Suspense,
  createContext,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { HotkeysProvider, useHotkey } from "@tanstack/react-hotkeys"
import { MotionConfig } from "motion/react"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { appHotkeys } from "@/lib/keyboard"
import { resolveTheme, useSettingsStore } from "@/store/useSettingsStore"

const LazyCommandPalette = lazy(() =>
  import("@/components/features/CommandPalette").then((m) => ({
    default: m.CommandPalette,
  }))
)

interface CommandPaletteContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  openPalette: () => void
}

const CommandPaletteContext = createContext<CommandPaletteContextValue>({
  open: false,
  setOpen: () => {},
  openPalette: () => {},
})

export function useCommandPalette() {
  return useContext(CommandPaletteContext)
}

function GlobalEffectsAndHotkeys({
  onTogglePalette,
}: {
  onTogglePalette: () => void
}) {
  const theme = useSettingsStore((s) => s.theme)
  const fontScale = useSettingsStore((s) => s.fontScale)
  const reducedMotion = useSettingsStore((s) => s.reducedMotion)
  const toggleTheme = useSettingsStore((s) => s.toggleTheme)

  useHotkey(appHotkeys["theme.toggle"], () => {
    toggleTheme()
  })

  useHotkey(appHotkeys["palette.open"], () => {
    onTogglePalette()
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
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [hasOpenedPalette, setHasOpenedPalette] = useState(false)

  const setOpen = useCallback((nextOpen: boolean) => {
    if (nextOpen) setHasOpenedPalette(true)
    setPaletteOpen(nextOpen)
  }, [])

  const openPalette = useCallback(() => {
    setHasOpenedPalette(true)
    setPaletteOpen(true)
  }, [])

  const togglePalette = useCallback(() => {
    setHasOpenedPalette(true)
    setPaletteOpen((prev) => !prev)
  }, [])

  const paletteContextValue = useMemo(
    () => ({ open: paletteOpen, setOpen, openPalette }),
    [paletteOpen, setOpen, openPalette]
  )

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
          <CommandPaletteContext.Provider value={paletteContextValue}>
            <GlobalEffectsAndHotkeys onTogglePalette={togglePalette} />
            {children}
            {hasOpenedPalette && (
              <Suspense fallback={null}>
                <LazyCommandPalette open={paletteOpen} onOpenChange={setOpen} />
              </Suspense>
            )}
            <Toaster position="bottom-right" />
          </CommandPaletteContext.Provider>
        </TooltipProvider>
      </MotionConfig>
    </HotkeysProvider>
  )
}
