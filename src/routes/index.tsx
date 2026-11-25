import { createFileRoute, redirect } from "@tanstack/react-router"
import { getHandbooksMeta } from "@/lib/content"
import { HandbookPicker } from "@/views/HandbookPicker"

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const handbooks = getHandbooksMeta()
    if (handbooks.length === 1) {
      throw redirect({
        to: "/$hb",
        params: { hb: handbooks[0].id },
        replace: true,
      })
    }
  },
  component: HandbookPicker,
})
