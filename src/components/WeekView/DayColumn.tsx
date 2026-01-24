import { useMemo } from 'react'
import {
  TIME_SLOTS,
  getBorderRight,
  getSlotBottomBorder,
  durationToSlots,
  slotsToHeight,
  DRAG_DATA_TYPE,
  parseDragData,
  type ScheduledEvent,
} from './constants'
import { useScheduleStore } from './store'
import { ScheduledEventCard } from './ScheduledEventCard'

interface DayColumnProps {
  dayIndex: number
  isLast: boolean
}

function buildEventsBySlot(events: ScheduledEvent[]) {
  const map = new Map<number, { event: ScheduledEvent; isStart: boolean }>()
  for (const event of events) {
    const slots = durationToSlots(event.duration)
    for (let i = 0; i < slots; i++) {
      map.set(event.startSlotIndex + i, { event, isStart: i === 0 })
    }
  }
  return map
}

function hasValidDragType(e: React.DragEvent): boolean {
  return Array.from(e.dataTransfer.types).includes(DRAG_DATA_TYPE)
}

export function DayColumn({ dayIndex, isLast }: DayColumnProps) {
  const allEvents = useScheduleStore((s) => s.events)
  const dropPreview = useScheduleStore((s) => s.dropPreview)
  const setDropPreview = useScheduleStore((s) => s.setDropPreview)
  const clearDropPreview = useScheduleStore((s) => s.clearDropPreview)
  const addEvent = useScheduleStore((s) => s.addEvent)
  const moveEvent = useScheduleStore((s) => s.moveEvent)

  const events = useMemo(
    () => allEvents.filter((e) => e.dayIndex === dayIndex),
    [allEvents, dayIndex]
  )

  const eventsBySlot = buildEventsBySlot(events)
  const isPreviewForThisDay = dropPreview?.dayIndex === dayIndex

  const handleDragOver = (e: React.DragEvent) => {
    if (!hasValidDragType(e)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e: React.DragEvent, slotIndex: number) => {
    if (!hasValidDragType(e)) return
    e.preventDefault()
    setDropPreview(dayIndex, slotIndex)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    clearDropPreview()
  }

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault()
    clearDropPreview()

    const raw = e.dataTransfer.getData(DRAG_DATA_TYPE)
    const data = parseDragData(raw)
    if (!data) return

    if (data.eventId) {
      moveEvent(data.eventId, dayIndex, slotIndex)
    } else {
      addEvent(dayIndex, slotIndex, data)
    }
  }

  return (
    <div
      className={`flex-1 flex flex-col ${getBorderRight(isLast)}`}
      onDragLeave={handleDragLeave}
    >
      {TIME_SLOTS.map((slot, i) => {
        const slotData = eventsBySlot.get(i)
        const isPreviewStart = isPreviewForThisDay && dropPreview?.startSlot === i

        return (
          <div
            key={slot.id}
            className={`flex-1 relative ${getSlotBottomBorder(i)}`}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, i)}
            onDrop={(e) => handleDrop(e, i)}
          >
            {slotData?.isStart && (
              <ScheduledEventCard event={slotData.event} />
            )}
            {isPreviewStart && dropPreview && (
              <div
                className={`absolute inset-x-0 z-5 rounded-sm pointer-events-none ${dropPreview.isValid ? 'bg-primary/30' : 'bg-destructive/30'}`}
                style={{ top: 0, height: slotsToHeight(dropPreview.slotsCount) }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
