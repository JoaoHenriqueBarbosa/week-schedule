import {
  TIME_SLOTS,
  getBorderRight,
  getSlotBottomBorder,
  durationToSlots,
  type ScheduledEvent,
  type DragData,
} from './constants'
import { useDropTarget } from './hooks'
import { ScheduledEventCard } from './ScheduledEventCard'

interface SlotCellProps {
  slotIndex: number
  event?: ScheduledEvent
  isEventStart: boolean
  onDrop: (data: DragData) => void
  onRemoveEvent: (eventId: string) => void
  canDrop: (data: DragData) => boolean
}

function SlotCell({
  slotIndex,
  event,
  isEventStart,
  onDrop,
  onRemoveEvent,
  canDrop,
}: SlotCellProps) {
  const { dropProps, isOver } = useDropTarget({ onDrop, canDrop })

  const dropFeedbackClass = isOver
    ? canDrop({ templateId: 0, templateName: '', duration: 30 })
      ? 'bg-primary/20'
      : 'bg-destructive/20'
    : ''

  return (
    <div
      {...dropProps}
      className={`flex-1 relative ${getSlotBottomBorder(slotIndex)} ${dropFeedbackClass} transition-colors`}
    >
      {event && isEventStart && (
        <ScheduledEventCard event={event} onRemove={onRemoveEvent} />
      )}
    </div>
  )
}

interface DayColumnProps {
  isLast: boolean
  events: ScheduledEvent[]
  onDrop: (slotIndex: number, data: DragData) => void
  onRemoveEvent: (eventId: string) => void
  checkCollision: (slotIndex: number, slotsRequired: number) => boolean
}

export function DayColumn({
  isLast,
  events,
  onDrop,
  onRemoveEvent,
  checkCollision,
}: DayColumnProps) {
  const eventsBySlot = new Map<number, ScheduledEvent>()
  events.forEach((event) => {
    const slots = durationToSlots(event.duration)
    for (let i = 0; i < slots; i++) {
      eventsBySlot.set(event.startSlotIndex + i, event)
    }
  })

  return (
    <div className={`flex-1 flex flex-col ${getBorderRight(isLast)}`}>
      {TIME_SLOTS.map((slot, i) => {
        const event = eventsBySlot.get(i)
        const isEventStart = event?.startSlotIndex === i

        return (
          <SlotCell
            key={slot.id}
            slotIndex={i}
            event={event}
            isEventStart={isEventStart}
            onDrop={(data) => onDrop(i, data)}
            onRemoveEvent={onRemoveEvent}
            canDrop={(data) => !checkCollision(i, durationToSlots(data.duration))}
          />
        )
      })}
    </div>
  )
}
