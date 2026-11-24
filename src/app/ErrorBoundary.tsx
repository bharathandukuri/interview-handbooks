import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Application error boundary caught:", error, info)
  }

  private handleReset = (): void => {
    this.setState({ error: null })
  }

  render(): ReactNode {
    if (!this.state.error) {
      return this.props.children
    }

    return (
      <div className="flex min-h-svh items-center justify-center bg-background p-6 text-foreground">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-(--shadow-card)">
          <div className="mb-3 flex items-center gap-2 text-hard">
            <AlertTriangle className="size-5" aria-hidden="true" />
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Something went wrong
            </h1>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            {this.state.error.message ||
              "An unexpected rendering error occurred."}
          </p>
          <Button onClick={this.handleReset} variant="outline" size="sm">
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Try again
          </Button>
        </div>
      </div>
    )
  }
}
