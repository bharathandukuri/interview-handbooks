import { Check, Monitor, Moon, Sun } from "lucide-react"
import { useFormatForDisplay } from "@tanstack/react-hotkeys"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd"
import { appHotkeys } from "@/lib/keyboard"
import {
  resolveTheme,
  useSettingsStore,
  type ThemeSetting,
} from "@/store/useSettingsStore"

const THEME_OPTIONS: ReadonlyArray<{
  value: ThemeSetting
  label: string
  icon: typeof Moon
}> = [
  { value: "dark", label: "Dark", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
]

export function ThemeToggle() {
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const toggleTheme = useSettingsStore((s) => s.toggleTheme)
  const formatForDisplay = useFormatForDisplay()
  const resolved = resolveTheme(theme)
  const shortcutLabel = formatForDisplay(
    appHotkeys["theme.toggle"].hotkey ?? "D"
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={`Color theme (${theme})`}
          className="h-8 gap-1.5 bg-surface-2 px-2.5 text-xs text-muted-foreground hover:text-foreground sm:h-9"
        >
          {resolved === "dark" ? (
            <Moon className="size-3.5 text-foreground" aria-hidden="true" />
          ) : (
            <Sun className="size-3.5 text-foreground" aria-hidden="true" />
          )}
          <span className="hidden capitalize sm:inline">{theme}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon
          const selected = theme === option.value
          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => setTheme(option.value)}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="flex-1">{option.label}</span>
              {selected && (
                <Check className="size-3.5 text-brand" aria-hidden="true" />
              )}
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={toggleTheme}>
          <span className="flex-1 text-muted-foreground">Quick toggle</span>
          <Kbd>{shortcutLabel}</Kbd>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
