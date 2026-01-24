import { TIME_SLOTS, TIME_COLUMN_WIDTH, borderRight, getSlotBottomBorder } from './constants'

export function TimeColumn() {
  return (
    <div className={`${TIME_COLUMN_WIDTH} shrink-0 ${borderRight} flex flex-col`}>
      {TIME_SLOTS.map((slot, i) => (
        <div
          key={slot.id}
          className={`flex-1 relative text-xs text-black bg-muted ${getSlotBottomBorder(i)}`}
        >
          {slot.isHourStart && (
            <span className={`absolute right-1 ${i === 0 ? 'top-1' : '-top-2'}`}>
              {slot.label}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
