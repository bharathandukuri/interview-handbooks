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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
    <div className="inline-flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggleTheme}
            aria-label={`Switch to ${resolved === "dark" ? "light" : "dark"} theme`}
          >
            {resolved === "dark" ? (
              <Moon className="size-4" aria-hidden="true" />
            ) : (
              <Sun className="size-4" aria-hidden="true" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <span>Toggle theme</span>
          <Kbd>{shortcutLabel}</Kbd>
        </TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Theme mode options"
            className="gap-1.5 text-xs text-muted-foreground"
          >
            <span className="capitalize">{theme}</span>
            <Kbd>{shortcutLabel}</Kbd>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
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
    </div>
  )
}
