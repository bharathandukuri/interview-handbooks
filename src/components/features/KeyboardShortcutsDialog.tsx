import { Fragment } from "react"
import { useFormatForDisplay } from "@tanstack/react-hotkeys"
import { Keyboard } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { getShortcutGroups } from "@/lib/keyboard"

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: KeyboardShortcutsDialogProps) {
  const formatForDisplay = useFormatForDisplay()
  const groups = getShortcutGroups(formatForDisplay)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="size-4 text-brand" aria-hidden="true" />
            <span>Keyboard shortcuts</span>
          </DialogTitle>
          <DialogDescription>
            Move through cards, track progress, and open search without leaving
            your keyboard.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[65vh] space-y-5 overflow-y-auto pr-1">
          {groups.map((group) => (
            <section key={group.id} className="space-y-2">
              <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {group.title}
              </h3>

              <div className="divide-y divide-border rounded-xl border border-border bg-surface-2/40">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-3.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground">
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </div>

                    <KbdGroup className="shrink-0">
                      {item.keys.map((keyLabel, idx) => (
                        <Fragment key={`${item.id}-${idx}-${keyLabel}`}>
                          {idx > 0 && (
                            <span className="text-[11px] text-text-faint">
                              {item.mode === "sequence" ? "then" : "/"}
                            </span>
                          )}
                          <Kbd className="border border-border bg-surface text-foreground">
                            {keyLabel}
                          </Kbd>
                        </Fragment>
                      ))}
                    </KbdGroup>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
