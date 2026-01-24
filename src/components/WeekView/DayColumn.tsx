import { useShallow } from 'zustand/react/shallow'
import {
  TIME_SLOTS,
  getBorderRight,
  getSlotBottomBorder,
  durationToSlots,
  DRAG_DATA_TYPE,
  parseDragData,
} from './constants'
import { useScheduleStore } from './store'
import { ScheduledEventCard } from './ScheduledEventCard'

interface DayColumnProps {
  dayIndex: number
  isLast: boolean
}

export function DayColumn({ dayIndex, isLast }: DayColumnProps) {
  const events = useScheduleStore(useShallow((s) => s.events.filter((e) => e.dayIndex === dayIndex)))
  const dropPreview = useScheduleStore((s) => s.dropPreview)
  const setDropPreview = useScheduleStore((s) => s.setDropPreview)
  const clearDropPreview = useScheduleStore((s) => s.clearDropPreview)
  const addEvent = useScheduleStore((s) => s.addEvent)
  const removeEvent = useScheduleStore((s) => s.removeEvent)

  const eventsBySlot = new Map<number, { event: typeof events[0]; isStart: boolean }>()
  events.forEach((event) => {
    const slots = durationToSlots(event.duration)
    for (let i = 0; i < slots; i++) {
      eventsBySlot.set(event.startSlotIndex + i, {
        event,
        isStart: i === 0,
      })
    }
  })

  const handleDragOver = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes(DRAG_DATA_TYPE)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDragEnter = (e: React.DragEvent, slotIndex: number) => {
    if (!e.dataTransfer.types.includes(DRAG_DATA_TYPE)) return
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

    addEvent(dayIndex, slotIndex, data)
  }

  const isPreviewForThisDay = dropPreview?.dayIndex === dayIndex

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
              <ScheduledEventCard event={slotData.event} onRemove={removeEvent} />
            )}
            {isPreviewStart && dropPreview && (
              <div
                className={`absolute inset-x-0 z-5 rounded-sm pointer-events-none ${dropPreview.isValid ? 'bg-primary/30' : 'bg-destructive/30'}`}
                style={{
                  top: 0,
                  height: `calc(${dropPreview.slotsCount} * 100% - 1px)`,
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
