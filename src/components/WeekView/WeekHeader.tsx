import { DAYS, TIME_COLUMN_WIDTH, borderRight, borderBottom, getBorderRight } from './constants'

export function WeekHeader() {
  return (
    <div className={`flex ${borderBottom}`}>
      <div className={`${TIME_COLUMN_WIDTH} shrink-0 p-2 ${borderRight} bg-muted`} />
      {DAYS.map((day, i) => (
        <div
          key={day}
          className={`flex-1 p-2 text-center font-semibold bg-muted text-foreground ${getBorderRight(i === DAYS.length - 1)}`}
        >
          {day}
        </div>
      ))}
    </div>
  )
}
