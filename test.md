---
import { ScrollArea } from '@/components/ui/scroll-area'
import type { WikiNode } from '@/lib/data-utils'
import { cn } from '@/lib/utils'
import { Icon } from 'astro-icon/components'

interface Props {
  tree: WikiNode[]
  currentPostId: string
  title?: string
}

const { tree, currentPostId, title = 'Sections' } = Astro.props

const renderNode = (node: WikiNode, depth = 0) => {
  const isCurrent = node.id === currentPostId
  const hasChildren = node.children.length > 0
  return (
    <li class="flex flex-col">
^
      <a
        href={`/wiki/${node.id}`}
        class={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
          isCurrent
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-foreground/80 hover:bg-muted/50 hover:text-foreground',
          depth > 0 && 'pl-3'
        )}
        style={{ marginLeft: `${depth * 0.5}rem` }}
      >
        <Icon
          name={hasChildren ? 'lucide:folder' : 'lucide:file-text'}
          class="size-4 text-muted-foreground shrink-0"
        />
        <span class="break-all hyphens-auto leading-snug">{node.title}</span>
      </a>
      {hasChildren && (
        <ul class="ml-2 mt-1 flex flex-col gap-1">
          {node.children.map((child) => renderNode(child, depth + 1))}
        </ul>
      )}
    </li>
  )
}
---

{tree.length > 0 && (
  <div class="xl:hidden sticky top-16 z-30 -mx-4 px-4">
    <details class="group w-full rounded-lg border bg-card/90 backdrop-blur">
      <summary class="flex items-center gap-2 px-4 py-3 text-sm font-medium cursor-pointer">
        <Icon name="lucide:list-tree" class="size-4 text-muted-foreground" />
        <span class="truncate">{title}</span>
        <span class="flex-1 truncate text-right text-xs text-muted-foreground">
          {tree.find((n) => n.id === currentPostId)?.title || ''}
        </span>
        <Icon
          name="lucide:chevron-down"
          class="size-4 transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <ScrollArea
        client:visible
        className="max-h-[40vh]"
        type="hover"
      >
        <ul class="flex flex-col gap-1 px-2 pb-3 pt-1">
          {tree.map((node) => renderNode(node))}
        </ul>
      </ScrollArea>
    </details>
  </div>
)}

Error: Transform failed with 1 error:
C:/Users/DELL/Documents/Projects/pingbytes/src/components/MobileSections.astro:19:8: ERROR: Expected ">" but found "class"
    at failureErrorWithLog (C:\Users\DELL\Documents\Projects\pingbytes\node_modules\esbuild\lib\main.js:1467:15)
    at C:\Users\DELL\Documents\Projects\pingbytes\node_modules\esbuild\lib\main.js:736:50
    at responseCallbacks.<computed> (C:\Users\DELL\Documents\Projects\pingbytes\node_modules\esbuild\lib\main.js:603:9)
    at handleIncomingPacket (C:\Users\DELL\Documents\Projects\pingbytes\node_modules\esbuild\lib\main.js:658:12)
    at Socket.readFromStdout (C:\Users\DELL\Documents\Projects\pingbytes\node_modules\esbuild\lib\main.js:581:7)
    at Socket.emit (node:events:519:28)
    at addChunk (node:internal/streams/readable:561:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
    at Readable.push (node:internal/streams/readable:392:5)
    at Pipe.onStreamRead (node:internal/stream_base_commons:189:23)
    at Pipe.callbackTrampoline (node:internal/async_hooks:130:17)

    20:39:39 watching for file changes...
20:39:46 [200] / 507ms
20:39:46 [200] / 95ms
20:39:48 [200] /about 33ms
20:39:48 [ERROR] Expected ">" but found "class"
  Stack trace:
    at C:/Users/DELL/Documents/Projects/pingbytes/src/components/MobileSections.astro:19:8
    [...] See full stack trace in the browser, or rerun with --verbose.
20:39:48 [ERROR] Expected ">" but found "class"
  Stack trace:
    at failureErrorWithLog (C:\Users\DELL\Documents\Projects\pingbytes\node_modules\esbuild\lib\main.js:1467:15)
    [...] See full stack trace in the browser, or rerun with --verbose.
20:39:49 [ERROR] Expected ">" but found "class"
  Stack trace:
    at failureErrorWithLog (C:\Users\DELL\Documents\Projects\pingbytes\node_modules\esbuild\lib\main.js:1467:15)
    [...] See full stack trace in the browser, or rerun with --verbose.