import { useState, useCallback } from 'react'
import { DRAG_DATA_TYPE, parseDragData, type DragData } from '../constants'

interface UseDropTargetOptions {
  onDrop: (data: DragData) => void
  canDrop: (data: DragData) => boolean
}

export function useDropTarget({ onDrop, canDrop }: UseDropTargetOptions) {
  const [isOver, setIsOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes(DRAG_DATA_TYPE)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes(DRAG_DATA_TYPE)) return
    e.preventDefault()
    setIsOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setIsOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsOver(false)

      const raw = e.dataTransfer.getData(DRAG_DATA_TYPE)
      const data = parseDragData(raw)
      if (!data) return

      if (canDrop(data)) {
        onDrop(data)
      }
    },
    [canDrop, onDrop]
  )

  return {
    dropProps: {
      onDragOver: handleDragOver,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
    isOver,
  }
}
