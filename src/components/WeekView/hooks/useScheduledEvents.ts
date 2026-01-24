import { useState, useCallback } from 'react'
import {
  type ScheduledEvent,
  type DragData,
  durationToSlots,
  generateEventId,
  TOTAL_SLOTS,
} from '../constants'

export function useScheduledEvents() {
  const [events, setEvents] = useState<ScheduledEvent[]>([])

  const checkCollision = useCallback(
    (
      dayIndex: number,
      startSlotIndex: number,
      slotsRequired: number,
      excludeEventId?: string
    ): boolean => {
      const endSlotIndex = startSlotIndex + slotsRequired - 1

      if (endSlotIndex >= TOTAL_SLOTS) return true

      return events.some((event) => {
        if (event.dayIndex !== dayIndex) return false
        if (excludeEventId && event.id === excludeEventId) return false

        const eventEndSlot = event.startSlotIndex + durationToSlots(event.duration) - 1

        return !(endSlotIndex < event.startSlotIndex || startSlotIndex > eventEndSlot)
      })
    },
    [events]
  )

  const addEvent = useCallback(
    (dayIndex: number, startSlotIndex: number, data: DragData): boolean => {
      const slotsRequired = durationToSlots(data.duration)

      if (checkCollision(dayIndex, startSlotIndex, slotsRequired)) {
        return false
      }

      const newEvent: ScheduledEvent = {
        id: generateEventId(),
        templateId: data.templateId,
        templateName: data.templateName,
        dayIndex,
        startSlotIndex,
        duration: data.duration,
      }

      setEvents((prev) => [...prev, newEvent])
      return true
    },
    [checkCollision]
  )

  const removeEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
  }, [])

  const getEventsForDay = useCallback(
    (dayIndex: number): ScheduledEvent[] => {
      return events.filter((e) => e.dayIndex === dayIndex)
    },
    [events]
  )

  return {
    events,
    addEvent,
    removeEvent,
    checkCollision,
    getEventsForDay,
  }
}
