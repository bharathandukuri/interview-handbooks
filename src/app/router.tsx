import { createHashHistory, createRouter } from "@tanstack/react-router"
import { routeTree } from "@/routeTree.gen"
import { NotFound } from "@/views/NotFound"

const hashHistory = createHashHistory()

export const router = createRouter({
  routeTree,
  history: hashHistory,
  defaultPreload: "intent",
  defaultNotFoundComponent: () => <NotFound />,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
