import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ErrorBoundary } from './ErrorBoundary'

const SearchButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [DialogComp, setDialogComp] = useState<
    | null
    | React.ComponentType<{ open: boolean; onOpenChange: (open: boolean) => void }>
  >(null)
  const [isDialogLoading, setIsDialogLoading] = useState(false)

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !isInput) {
        e.preventDefault()
        handleOpen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const loadDialog = async () => {
    if (DialogComp || isDialogLoading) return
    try {
      setIsDialogLoading(true)
      const mod = await import('./SearchDialog')
      setDialogComp(() => mod.default)
    } finally {
      setIsDialogLoading(false)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    loadDialog()
  }

  // Prefetch dialog on idle to reduce first-open latency without blocking FCP
  useEffect(() => {
    const idle = (window as any).requestIdleCallback
    const handle = idle
      ? idle(() => loadDialog())
      : window.setTimeout(() => loadDialog(), 1200)
    return () => {
      if (idle && typeof (window as any).cancelIdleCallback === 'function') {
        ;(window as any).cancelIdleCallback(handle)
      } else {
        clearTimeout(handle as number)
      }
    }
  }, [])

  return (
    <ErrorBoundary>
      <button
        onClick={handleOpen}
        onMouseEnter={loadDialog}
        onFocus={loadDialog}
        className={cn(
          'group hidden md:flex items-center gap-2 rounded-full border border-border/40 bg-foreground/[0.03] px-3.5 py-1.5 text-sm text-foreground/50 transition-all hover:bg-foreground/[0.06] hover:border-border/80 focus:outline-none focus:ring-2 focus:ring-ring/20 md:w-40 lg:w-56',
        )}
        title="Search (グ~/Ctrl + K)"
        aria-label="Search blog posts"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Search className="h-4 w-4 shrink-0 transition-colors group-hover:text-foreground/80" />
        <span className="flex-1 text-left truncate transition-colors group-hover:text-foreground/80">
          Search...
        </span>

        <kbd className="pointer-events-none hidden lg:flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-background/50 px-1.5 font-mono text-[10px] font-medium opacity-60 group-hover:opacity-100 transition-opacity">
          <span className="text-xs">グ~</span>K
        </kbd>
      </button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleOpen}
        onMouseEnter={loadDialog}
        onFocus={loadDialog}
        className="size-9 md:hidden"
        title="Search (グ~/Ctrl + K)"
        aria-label="Search blog posts"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>

      {DialogComp && (
        <ErrorBoundary>
          <DialogComp open={isOpen} onOpenChange={setIsOpen} />
        </ErrorBoundary>
      )}
      {!DialogComp && isDialogLoading && (
        <div className="hidden" aria-hidden="true" />
      )}
    </ErrorBoundary>
  )
}

export default SearchButton
