import {
  type ScheduledEvent,
  durationToSlots,
  formatDuration,
  slotsToHeight,
  DRAG_DATA_TYPE,
  serializeDragData,
} from './constants'
import { useScheduleStore } from './store'

interface ScheduledEventCardProps {
  event: ScheduledEvent
  onRemove: (eventId: string) => void
}

export function ScheduledEventCard({ event, onRemove }: ScheduledEventCardProps) {
  const setDragging = useScheduleStore((s) => s.setDragging)
  const slotsOccupied = durationToSlots(event.duration)

  const handleDragStart = (e: React.DragEvent) => {
    const data = {
      templateId: event.templateId,
      templateName: event.templateName,
      duration: event.duration,
      eventId: event.id,
    }

    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const clone = target.cloneNode(true) as HTMLElement
    clone.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: ${rect.width}px;
      height: ${rect.height}px;
      background-color: hsl(var(--primary));
      border: none;
      border-radius: 0.125rem;
    `
    document.body.appendChild(clone)
    e.dataTransfer.setDragImage(clone, e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    requestAnimationFrame(() => document.body.removeChild(clone))

    e.dataTransfer.setData(DRAG_DATA_TYPE, serializeDragData(data))
    e.dataTransfer.effectAllowed = 'copyMove'
    setDragging(data)
  }

  const handleDragEnd = () => {
    setDragging(null)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="absolute inset-x-0 z-10 bg-primary text-primary-foreground rounded-sm p-1 overflow-hidden cursor-grab active:cursor-grabbing hover:bg-primary/90 border-2 border-white"
      style={{
        top: 0,
        height: slotsToHeight(slotsOccupied),
      }}
      onClick={() => onRemove(event.id)}
      title="Arraste para mover ou clique para remover"
    >
      <div className="font-medium text-xs truncate">{event.templateName}</div>
      <div className="text-xs opacity-80">{formatDuration(event.duration)}</div>
    </div>
  )
}
