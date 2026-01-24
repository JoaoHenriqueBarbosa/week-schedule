import { useCallback } from 'react'
import { DRAG_DATA_TYPE, serializeDragData, type DragData } from '../constants'

interface UseDragSourceOptions {
  data: DragData
  onDragStart?: () => void
  onDragEnd?: () => void
}

export function useDragSource({ data, onDragStart, onDragEnd }: UseDragSourceOptions) {
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData(DRAG_DATA_TYPE, serializeDragData(data))
      e.dataTransfer.effectAllowed = 'copy'
      onDragStart?.()
    },
    [data, onDragStart]
  )

  const handleDragEnd = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.clearData()
      onDragEnd?.()
    },
    [onDragEnd]
  )

  return {
    dragProps: {
      draggable: true as const,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
    },
  }
}
