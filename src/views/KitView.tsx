import { useState } from "react"
import { useFormatForDisplay } from "@tanstack/react-hotkeys"
import { Link } from "@tanstack/react-router"
import { ArrowLeft, Check, Flame, Search, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useCommandPalette } from "@/app/providers"
import { CardRenderer } from "@/components/cards/CardRenderer"
import { CodeBlock } from "@/components/features/CodeBlock"
import { MermaidDiagram } from "@/components/features/MermaidDiagram"
import { StatusToggle } from "@/components/features/StatusToggle"
import { ThemeToggle } from "@/components/features/ThemeToggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Callout } from "@/components/ui/callout"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { Input } from "@/components/ui/input"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { appHotkeys } from "@/lib/keyboard"
import type { CardStatus } from "@/lib/types"
import {
  applyHandbookAccent,
  getContrastForeground,
  getContrastRatio,
} from "@/lib/utils"
import {
  useSettingsStore,
  type FontScaleSetting,
} from "@/store/useSettingsStore"
import { KIT_SAMPLE_CARDS } from "@/views/kitFixtures"

interface TokenRow {
  token: string
  label: string
  darkValue: string
  lightValue: string
  isBorder?: boolean
}

const CORE_TOKENS: ReadonlyArray<TokenRow> = [
  {
    token: "--bg",
    label: "Background",
    darkValue: "#0B0D12",
    lightValue: "#FAFAF8",
  },
  {
    token: "--surface",
    label: "Surface",
    darkValue: "#11141B",
    lightValue: "#FFFFFF",
  },
  {
    token: "--surface-2",
    label: "Surface 2",
    darkValue: "#171B24",
    lightValue: "#F3F4F6",
  },
  {
    token: "--border",
    label: "Border",
    darkValue: "#232836",
    lightValue: "#E5E7EB",
    isBorder: true,
  },
  {
    token: "--text",
    label: "Text",
    darkValue: "#E8EAF0",
    lightValue: "#12141A",
  },
  {
    token: "--text-muted",
    label: "Text muted",
    darkValue: "#9AA3B5",
    lightValue: "#5B6475",
  },
  {
    token: "--text-faint",
    label: "Text faint",
    darkValue: "#6B7385",
    lightValue: "#8A93A5",
  },
  {
    token: "--easy",
    label: "Easy",
    darkValue: "#34D399",
    lightValue: "#059669",
  },
  {
    token: "--medium",
    label: "Medium",
    darkValue: "#FBBF24",
    lightValue: "#B45309",
  },
  {
    token: "--hard",
    label: "Hard",
    darkValue: "#F87171",
    lightValue: "#DC2626",
  },
]

const ACCENT_PRESETS = [
  { id: "python", name: "Python", accent: "#4A90E2", accent2: "#FFD43B" },
  { id: "java", name: "Java", accent: "#EA580C", accent2: "#38BDF8" },
  { id: "sql", name: "SQL", accent: "#10B981", accent2: "#818CF8" },
  { id: "rust", name: "Systems", accent: "#F97316", accent2: "#FACC15" },
] as const

const TYPE_SCALE = [
  { px: 12, token: "--text-xs", label: "Metadata / captions" },
  { px: 14, token: "--text-sm", label: "UI labels & code" },
  { px: 16, token: "--text-base", label: "Body default" },
  { px: 17, token: "--text-reading", label: "Reading prose (lh 1.7)" },
  { px: 18, token: "--text-lg", label: "Card lead" },
  { px: 22, token: "--text-xl", label: "Card title" },
  { px: 28, token: "--text-2xl", label: "Section heading" },
  { px: 36, token: "--text-3xl", label: "Chapter heading" },
  { px: 48, token: "--text-4xl", label: "Handbook hero" },
] as const

const FONT_SCALES: ReadonlyArray<FontScaleSetting> = [0.9, 1, 1.1, 1.2]

export function KitView() {
  const fontScale = useSettingsStore((s) => s.fontScale)
  const setFontScale = useSettingsStore((s) => s.setFontScale)
  const reducedMotion = useSettingsStore((s) => s.reducedMotion)
  const setReducedMotion = useSettingsStore((s) => s.setReducedMotion)
  const [activePreset, setActivePreset] = useState<string>("python")
  const [previewAccent, setPreviewAccent] = useState<string>("#4A90E2")
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>(["easy"])
  const [standaloneStatus, setStandaloneStatus] = useState<
    CardStatus | undefined
  >("known")
  const [cardStatuses, setCardStatuses] = useState<
    Record<string, CardStatus | undefined>
  >({})
  const [cardBookmarks, setCardBookmarks] = useState<Record<string, boolean>>(
    {}
  )
  const formatForDisplay = useFormatForDisplay()
  const { openPalette } = useCommandPalette()

  const fgHex = getContrastForeground(previewAccent)
  const contrastRatio = getContrastRatio(fgHex, previewAccent).toFixed(2)

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              aria-label="Back to home"
            >
              <Link to="/">
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold tracking-tight">
                  Design System Kit
                </h1>
                <Badge variant="outline" className="font-mono text-[11px]">
                  dev-only /#/_kit
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Tokens, typography, elevation, and shadcn/ui primitives
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Scale</span>
              <ToggleGroup
                type="single"
                size="sm"
                value={String(fontScale)}
                onValueChange={(v) => {
                  if (v) setFontScale(Number(v) as FontScaleSetting)
                }}
              >
                {FONT_SCALES.map((scale) => (
                  <ToggleGroupItem key={scale} value={String(scale)}>
                    {scale}×
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setReducedMotion(reducedMotion === true ? null : true)
              }
            >
              Motion: {reducedMotion === true ? "Reduced" : "Auto"}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openPalette}
              className="h-9 w-48 justify-between bg-surface-2 px-3 text-sm text-muted-foreground hover:border-[var(--accent-ring)] hover:text-foreground sm:w-64"
            >
              <span className="inline-flex items-center gap-2">
                <Search className="size-3.5" aria-hidden="true" />
                <span>Search...</span>
              </span>
              <Kbd>
                {formatForDisplay(appHotkeys["palette.open"].hotkey ?? "Mod+K")}
              </Kbd>
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-8">
        {/* Accent presets & WCAG AA check */}
        <section aria-labelledby="kit-accents" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2
                id="kit-accents"
                className="text-xl font-semibold tracking-tight"
              >
                Handbook Accent Tokens
              </h2>
              <p className="text-sm text-muted-foreground">
                Set per handbook on <code>:root</code>; soft tint (12%), ring,
                and WCAG AA foreground are derived automatically.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {ACCENT_PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  type="button"
                  size="sm"
                  variant={activePreset === preset.id ? "default" : "outline"}
                  onClick={() => {
                    setActivePreset(preset.id)
                    setPreviewAccent(preset.accent)
                    applyHandbookAccent(preset.accent, preset.accent2)
                  }}
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: preset.accent }}
                    aria-hidden="true"
                  />
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-surface p-4 shadow-(--shadow-card)">
              <div
                className="mb-3 flex h-16 items-center justify-between rounded-lg px-4 font-medium"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-fg)",
                }}
              >
                <span>--accent</span>
                <span className="font-mono text-xs">{contrastRatio}:1 AA</span>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                fg: {fgHex} · bg: {previewAccent}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4 shadow-(--shadow-card)">
              <div
                className="mb-3 flex h-16 items-center justify-between rounded-lg px-4 font-medium text-[#0b0d12]"
                style={{ backgroundColor: "var(--accent-2)" }}
              >
                <span>--accent-2</span>
                <Sparkles className="size-4" aria-hidden="true" />
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                Secondary compare & highlight strip
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4 shadow-(--shadow-card)">
              <div
                className="mb-3 flex h-16 items-center justify-between rounded-lg border px-4 font-medium"
                style={{
                  backgroundColor: "var(--accent-soft)",
                  borderColor: "var(--accent-ring)",
                  color: "var(--accent)",
                }}
              >
                <span>--accent-soft</span>
                <span className="font-mono text-xs">12%</span>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                Derived via color-mix(in srgb)
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4 shadow-(--shadow-card)">
              <div
                className="mb-3 flex h-16 items-center justify-between rounded-lg bg-surface-2 px-4 font-medium"
                style={{ outline: "2px solid var(--accent-ring)" }}
              >
                <span>--accent-ring</span>
                <Check className="size-4 text-brand" aria-hidden="true" />
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                Focus ring & card hover outline
              </p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Live theme palette + side-by-side Dark/Light reference */}
        <section aria-labelledby="kit-palette" className="space-y-4">
          <div>
            <h2
              id="kit-palette"
              className="text-xl font-semibold tracking-tight"
            >
              Colour Token Palette (Dark & Light)
            </h2>
            <p className="text-sm text-muted-foreground">
              Live swatches respond to the active theme; side-by-side dark &
              light previews inspect both palettes simultaneously.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CORE_TOKENS.map((item) => (
              <div
                key={item.token}
                className="rounded-xl border border-border bg-surface p-3 shadow-(--shadow-card) transition-shadow duration-200 hover:shadow-(--shadow-card-hover)"
              >
                <div
                  className="mb-3 h-12 w-full rounded-lg border border-border"
                  style={{
                    backgroundColor: `var(${item.token})`,
                  }}
                />
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <code className="font-mono text-xs text-muted-foreground">
                    {item.token}
                  </code>
                </div>
                <div className="mt-1 flex justify-between font-mono text-[11px] text-text-faint">
                  <span>D: {item.darkValue}</span>
                  <span>L: {item.lightValue}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Side-by-side Dark vs Light surface preview */}
          <div className="grid gap-4 md:grid-cols-2">
            {(["dark", "light"] as const).map((mode) => (
              <div
                key={mode}
                className={`${mode} rounded-2xl border border-border bg-background p-5 text-foreground shadow-(--shadow-card)`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {mode} theme snapshot
                  </span>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: "var(--easy-soft)",
                      color: "var(--easy)",
                    }}
                  >
                    <Flame className="size-3" aria-hidden="true" />
                    WCAG AA ready
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-surface p-4 shadow-(--shadow-card)">
                  <p className="text-base font-semibold tracking-tight">
                    Mutable vs immutable: why does it matter?
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Surface container on background canvas with secondary chip
                    below.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-md bg-surface-2 px-2 py-1 font-mono text-xs text-muted-foreground">
                      surface-2
                    </span>
                    <span
                      className="rounded-md px-2 py-1 font-mono text-xs"
                      style={{
                        backgroundColor: "var(--medium-soft)",
                        color: "var(--medium)",
                      }}
                    >
                      medium
                    </span>
                    <span
                      className="rounded-md px-2 py-1 font-mono text-xs"
                      style={{
                        backgroundColor: "var(--hard-soft)",
                        color: "var(--hard)",
                      }}
                    >
                      hard
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Typography & Reading column */}
        <section aria-labelledby="kit-typography" className="space-y-4">
          <div>
            <h2
              id="kit-typography"
              className="text-xl font-semibold tracking-tight"
            >
              Typography & Reading Column
            </h2>
            <p className="text-sm text-muted-foreground">
              Space Grotesk Variable for headings, Plus Jakarta Sans Variable
              for UI and reading (17px / 1.7), Fira Code Variable with ligatures
              for code (14px), 720px max column.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card)">
              {TYPE_SCALE.map((step) => (
                <div
                  key={step.token}
                  className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2 last:border-none last:pb-0"
                >
                  <span
                    className="truncate font-medium tracking-tight"
                    style={{ fontSize: `${step.px}px`, lineHeight: 1.25 }}
                  >
                    {step.label}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {step.px}px · {step.token}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card)">
              <div className="prose-card">
                <h3>Prose Reading Specimen</h3>
                <p>
                  An immutable object cannot change after creation, so any
                  update creates a fresh instance. Names in Python like{" "}
                  <code>items = [1, 2]</code> bind references rather than
                  copying memory.
                </p>
                <pre
                  className="shiki shiki-themes github-dark github-light border border-border bg-surface-2 p-3"
                  style={
                    {
                      "--shiki-dark": "#e1e4e8",
                      "--shiki-light": "#24292e",
                    } as React.CSSProperties
                  }
                >
                  <code
                    dangerouslySetInnerHTML={{
                      __html: `<span class="line"><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">function</span><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1"> greet</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">(</span><span style="--shiki-dark:#FFAB70;--shiki-light:#E36209">name</span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">:</span><span style="--shiki-dark:#79B8FF;--shiki-light:#005CC5"> string</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">)</span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">:</span><span style="--shiki-dark:#79B8FF;--shiki-light:#005CC5"> string</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> {</span></span>\n<span class="line"><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">  return</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> name </span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">!==</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> ""</span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49"> ?</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> \`Hello, </span><span style="--shiki-dark:#79B8FF;--shiki-light:#005CC5">\${</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">name</span><span style="--shiki-dark:#79B8FF;--shiki-light:#005CC5">}</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62">\`</span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49"> :</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> "Hi"</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">;</span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">}</span></span>`,
                    }}
                  />
                </pre>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Radii, Spacing & Primitives */}
        <section aria-labelledby="kit-primitives" className="space-y-4">
          <div>
            <h2
              id="kit-primitives"
              className="text-xl font-semibold tracking-tight"
            >
              Radii, Elevation & shadcn/ui Primitives
            </h2>
            <p className="text-sm text-muted-foreground">
              Keyboard shortcuts formatted with TanStack Hotkeys{" "}
              <code>useFormatForDisplay</code>.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { r: "8px", name: "--radius-sm" },
              { r: "12px", name: "--radius-md" },
              { r: "16px", name: "--radius-lg (cards)" },
              { r: "24px", name: "--radius-xl" },
            ].map((item) => (
              <div
                key={item.name}
                className="flex h-20 flex-col justify-between border border-border bg-surface p-4 shadow-(--shadow-card) transition-shadow duration-200 hover:shadow-(--shadow-card-hover)"
                style={{ borderRadius: item.r }}
              >
                <span className="text-sm font-medium">{item.r}</span>
                <code className="font-mono text-xs text-muted-foreground">
                  {item.name}
                </code>
              </div>
            ))}
          </div>

          <div className="grid gap-6 rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card) md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: "var(--easy)",
                    color: "var(--easy)",
                    backgroundColor: "var(--easy-soft)",
                  }}
                >
                  easy
                </Badge>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: "var(--medium)",
                    color: "var(--medium)",
                    backgroundColor: "var(--medium-soft)",
                  }}
                >
                  medium
                </Badge>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: "var(--hard)",
                    color: "var(--hard)",
                    backgroundColor: "var(--hard-soft)",
                  }}
                >
                  hard
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <KbdGroup>
                  <Kbd>{formatForDisplay("Mod+K")}</Kbd>
                  <span className="text-xs text-muted-foreground">Search</span>
                </KbdGroup>
                <KbdGroup>
                  <Kbd>
                    {formatForDisplay(appHotkeys["theme.toggle"].hotkey ?? "D")}
                  </Kbd>
                  <span className="text-xs text-muted-foreground">Theme</span>
                </KbdGroup>
                <KbdGroup>
                  <Kbd>{formatForDisplay("Space")}</Kbd>
                  <span className="text-xs text-muted-foreground">Reveal</span>
                </KbdGroup>
              </div>

              <ToggleGroup
                type="multiple"
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
                variant="outline"
              >
                <ToggleGroupItem value="easy">Easy</ToggleGroupItem>
                <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
                <ToggleGroupItem value="hard">Hard</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-4">
              <Input placeholder="Search cards, tags, or concepts..." />

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Chapter progress</span>
                  <span className="font-mono">68%</span>
                </div>
                <Progress value={68} aria-label="Chapter progress" />
              </div>

              <Tabs defaultValue="answer">
                <TabsList>
                  <TabsTrigger value="answer">Answer</TabsTrigger>
                  <TabsTrigger value="why">Why interviewers ask</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="answer"
                  className="pt-2 text-muted-foreground"
                >
                  Tab panel content styled with surface and border tokens.
                </TabsContent>
                <TabsContent value="why" className="pt-2 text-muted-foreground">
                  Checks mental model of references vs values.
                </TabsContent>
                <TabsContent
                  value="code"
                  className="pt-2 text-muted-foreground"
                >
                  Pre-highlighted Shiki HTML snippet slot.
                </TabsContent>
              </Tabs>

              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      Hover tooltip
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tooltip using theme tokens</TooltipContent>
                </Tooltip>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Open dialog
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Radix Focus-Trapped Dialog</DialogTitle>
                      <DialogDescription>
                        Accessible modal primitive with focus trap and Escape
                        support.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                <Skeleton className="h-7 w-24 rounded-md" />
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* M2 Feature Primitives: DifficultyBadge, StatusToggle, Callout, CodeBlock */}
        <section aria-labelledby="kit-m2-primitives" className="space-y-4">
          <div>
            <h2
              id="kit-m2-primitives"
              className="text-xl font-semibold tracking-tight"
            >
              Card Feature Primitives
            </h2>
            <p className="text-sm text-muted-foreground">
              DifficultyBadge, StatusToggle (3-state), Callout variants, and
              CodeBlock with copy, wrap toggle, and optional output panel.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 shadow-(--shadow-card)">
            <div className="flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty="easy" />
              <DifficultyBadge difficulty="medium" />
              <DifficultyBadge difficulty="hard" />
            </div>

            <StatusToggle
              status={standaloneStatus}
              onChange={setStandaloneStatus}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Callout variant="tip" title="Pro tip">
              Keep explanations conversational and under 150 words per card.
            </Callout>
            <Callout variant="pitfall" title="Watch out">
              Shared mutable state can cause subtle aliasing across calls.
            </Callout>
            <Callout variant="insight" title="Interview insight">
              Follow up by contrasting space complexity against latency gains.
            </Callout>
            <Callout variant="complexity">
              Average lookup is <code>O(1)</code>; worst-case rehash is{" "}
              <code>O(n)</code>.
            </Callout>
          </div>

          <CodeBlock
            language="typescript"
            title="CodeBlock with Output & Line Numbers"
            html='<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">const</span><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1"> sum</span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49"> =</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> (</span><span style="--shiki-dark:#FFAB70;--shiki-light:#E36209">a</span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">:</span><span style="--shiki-dark:#79B8FF;--shiki-light:#005CC5"> number</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">, </span><span style="--shiki-dark:#FFAB70;--shiki-light:#E36209">b</span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">:</span><span style="--shiki-dark:#79B8FF;--shiki-light:#005CC5"> number</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">) </span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">=&gt;</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> a </span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">+</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> b;</span></span>&#10;<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">console.</span><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1">log</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">(</span><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1">sum</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">(</span><span style="--shiki-dark:#79B8FF;--shiki-light:#005CC5">2</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">, </span><span style="--shiki-dark:#79B8FF;--shiki-light:#005CC5">3</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">));</span></span></code></pre>'
            outputHtml="<pre><code>5</code></pre>"
          />

          <MermaidDiagram
            title="Theme-Synced Mermaid Diagram"
            code={`flowchart LR
  A["Markdown \`\`\`mermaid"] --> B["Vite Content Plugin"]
  B --> C["RichContent Hydrator"]
  C --> D["Mermaid SVG (Theme + Accent)"]`}
          />
        </section>

        <Separator />

        {/* M2 Interactive Card Showcase (All 6 card types + variants) */}
        <section aria-labelledby="kit-cards" className="space-y-6">
          <div>
            <h2 id="kit-cards" className="text-xl font-semibold tracking-tight">
              All 6 Interactive Card Components
            </h2>
            <p className="text-sm text-muted-foreground">
              Tab into any card and press <Kbd>Space</Kbd> to reveal,{" "}
              <Kbd>K</Kbd> for Known, or <Kbd>R</Kbd> for Revisit.
            </p>
          </div>

          <div className="mx-auto max-w-[var(--reading-max-width)] space-y-6">
            {KIT_SAMPLE_CARDS.map((card) => (
              <CardRenderer
                key={card.id}
                card={card}
                status={cardStatuses[card.id]}
                bookmarked={Boolean(cardBookmarks[card.id])}
                onStatusChange={(next) =>
                  setCardStatuses((prev) => ({ ...prev, [card.id]: next }))
                }
                onToggleBookmark={() =>
                  setCardBookmarks((prev) => ({
                    ...prev,
                    [card.id]: !prev[card.id],
                  }))
                }
                onSelectRelated={(id) =>
                  toast.info(`Selected related card: ${id}`)
                }
                diagramSlot={
                  card.type === "concept" ? (
                    <MermaidDiagram
                      title="Sliding Window Flow"
                      className="my-0"
                      code={`flowchart LR
  L["left pointer"] --> W["Valid window?"]
  W -->|Yes| R["Expand right"]
  W -->|No| S["Shrink left"]`}
                    />
                  ) : undefined
                }
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
