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
  removeEvent: (eventId: string) => void
  checkCollision: (dayIndex: number, startSlotIndex: number, slotsRequired: number) => boolean
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
    const isValid = !checkCollision(dayIndex, startSlot, slotsCount)
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

  removeEvent: (eventId) => {
    set((state) => ({ events: state.events.filter((e) => e.id !== eventId) }))
  },

  checkCollision: (dayIndex, startSlotIndex, slotsRequired) => {
    const { events } = get()
    const endSlotIndex = startSlotIndex + slotsRequired - 1

    if (endSlotIndex >= TOTAL_SLOTS) return true

    return events.some((event) => {
      if (event.dayIndex !== dayIndex) return false
      const eventEndSlot = event.startSlotIndex + durationToSlots(event.duration) - 1
      return !(endSlotIndex < event.startSlotIndex || startSlotIndex > eventEndSlot)
    })
  },
}))
