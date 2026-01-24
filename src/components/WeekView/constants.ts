export const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const
export type Day = (typeof DAYS)[number]

export const START_HOUR = 7
export const SLOTS_PER_HOUR = 2
export const TOTAL_HOURS = 12
export const TOTAL_SLOTS = TOTAL_HOURS * SLOTS_PER_HOUR

export interface TimeSlot {
  id: number
  label: string
  isHourStart: boolean
}

export const TIME_SLOTS: TimeSlot[] = Array.from({ length: TOTAL_SLOTS }, (_, i) => {
  const hour = Math.floor(i / SLOTS_PER_HOUR) + START_HOUR
  const minutes = (i % SLOTS_PER_HOUR) * (60 / SLOTS_PER_HOUR)
  return {
    id: i,
    label: `${hour}:${minutes.toString().padStart(2, '0')}`,
    isHourStart: i % SLOTS_PER_HOUR === 0,
  }
})

export const TIME_COLUMN_WIDTH = 'w-16'

export const borderRight = 'shadow-[inset_-1px_0_0_var(--border)]'
export const borderBottom = 'shadow-[inset_0_-1px_0_var(--border)]'
export const borderBottomThick = 'shadow-[inset_0_-2px_0_var(--border)]'

export const getBorderRight = (isLast: boolean): string => isLast ? '' : borderRight

export const getSlotBottomBorder = (index: number): string => {
  if (index >= TOTAL_SLOTS - 1) return ''
  const isHourLine = index % SLOTS_PER_HOUR === SLOTS_PER_HOUR - 1
  return isHourLine ? borderBottomThick : borderBottom
}

export interface Template {
  id: number
  name: string
  duration: number
}

export const TEMPLATES: Template[] = [
  { id: 1, name: 'Cálculo I', duration: 90 },
  { id: 2, name: 'Física I', duration: 90 },
  { id: 3, name: 'Programação', duration: 120 },
  { id: 4, name: 'Álgebra Linear', duration: 60 },
  { id: 5, name: 'Química', duration: 90 },
]

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}min`
  if (mins === 0) return `${hours}h`
  return `${hours}h${mins}`
}

// ========== DRAG AND DROP ==========

export const DRAG_DATA_TYPE = 'application/schedule-template'

export interface DragData {
  templateId: number
  templateName: string
  duration: number
  eventId?: string
}

export interface ScheduledEvent {
  id: string
  templateId: number
  templateName: string
  dayIndex: number
  startSlotIndex: number
  duration: number
}

export const durationToSlots = (minutes: number): number => {
  const slotDuration = 60 / SLOTS_PER_HOUR
  return Math.ceil(minutes / slotDuration)
}

export const slotsToHeight = (slotsCount: number): string =>
  `calc(${slotsCount} * 100% - 1px)`

export const generateEventId = (): string =>
  `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const serializeDragData = (data: DragData): string => JSON.stringify(data)

export const parseDragData = (data: string): DragData | null => {
  try {
    return JSON.parse(data) as DragData
  } catch {
    return null
  }
}
