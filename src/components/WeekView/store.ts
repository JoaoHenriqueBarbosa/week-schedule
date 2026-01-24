import { create } from 'zustand'
import {
  type ScheduledEvent,
  type DragData,
  durationToSlots,
  generateEventId,
  TOTAL_SLOTS,
} from './constants'

interface DropPreview {
  dayIndex: number
  startSlot: number
  slotsCount: number
  isValid: boolean
}

interface ScheduleState {
  events: ScheduledEvent[]
  dragging: DragData | null
  dropPreview: DropPreview | null

  setDragging: (data: DragData | null) => void
  setDropPreview: (dayIndex: number, startSlot: number) => void
  clearDropPreview: () => void

  addEvent: (dayIndex: number, startSlotIndex: number, data: DragData) => boolean
  moveEvent: (eventId: string, dayIndex: number, startSlotIndex: number) => boolean
  removeEvent: (eventId: string) => void
  checkCollision: (dayIndex: number, startSlotIndex: number, slotsRequired: number, excludeEventId?: string) => boolean
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  events: [],
  dragging: null,
  dropPreview: null,

  setDragging: (data) => set({ dragging: data }),

  setDropPreview: (dayIndex, startSlot) => {
    const { dragging, checkCollision } = get()
    if (!dragging) {
      set({ dropPreview: null })
      return
    }
    const slotsCount = durationToSlots(dragging.duration)
    const isValid = !checkCollision(dayIndex, startSlot, slotsCount, dragging.eventId)
    set({ dropPreview: { dayIndex, startSlot, slotsCount, isValid } })
  },

  clearDropPreview: () => set({ dropPreview: null }),

  addEvent: (dayIndex, startSlotIndex, data) => {
    const { checkCollision } = get()
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

    set((state) => ({ events: [...state.events, newEvent] }))
    return true
  },

  moveEvent: (eventId, dayIndex, startSlotIndex) => {
    const { events, checkCollision } = get()
    const event = events.find((e) => e.id === eventId)
    if (!event) return false

    const slotsRequired = durationToSlots(event.duration)
    if (checkCollision(dayIndex, startSlotIndex, slotsRequired, eventId)) {
      return false
    }

    set((state) => ({
      events: state.events.map((e) =>
        e.id === eventId ? { ...e, dayIndex, startSlotIndex } : e
      ),
    }))
    return true
  },

  removeEvent: (eventId) => {
    set((state) => ({ events: state.events.filter((e) => e.id !== eventId) }))
  },

  checkCollision: (dayIndex, startSlotIndex, slotsRequired, excludeEventId) => {
    const { events } = get()
    const endSlotIndex = startSlotIndex + slotsRequired - 1

    if (endSlotIndex >= TOTAL_SLOTS) return true

    return events.some((event) => {
      if (excludeEventId && event.id === excludeEventId) return false
      if (event.dayIndex !== dayIndex) return false
      const eventEndSlot = event.startSlotIndex + durationToSlots(event.duration) - 1
      return !(endSlotIndex < event.startSlotIndex || startSlotIndex > eventEndSlot)
    })
  },
}))
