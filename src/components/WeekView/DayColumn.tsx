import { TIME_SLOTS, getBorderRight, getSlotBottomBorder } from './constants'

interface DayColumnProps {
  isLast: boolean
}

export function DayColumn({ isLast }: DayColumnProps) {
  return (
    <div className={`flex-1 flex flex-col ${getBorderRight(isLast)}`}>
      {TIME_SLOTS.map((slot, i) => (
        <div key={slot.id} className={`flex-1 ${getSlotBottomBorder(i)}`} />
      ))}
    </div>
  )
}
