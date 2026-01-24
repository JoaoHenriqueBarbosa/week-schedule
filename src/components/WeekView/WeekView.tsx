import { DAYS } from './constants'
import { WeekHeader } from './WeekHeader'
import { TimeColumn } from './TimeColumn'
import { DayColumn } from './DayColumn'
import { TemplatesSidebar } from './TemplatesSidebar'

export function WeekView() {
  return (
    <div className="h-screen bg-background p-4 flex">
      <div className="bg-card rounded-lg shadow overflow-hidden border border-border flex-1 flex flex-col">
        <WeekHeader />
        <div className="flex flex-1">
          <TimeColumn />
          {DAYS.map((day, i) => (
            <DayColumn
              key={day}
              dayIndex={i}
              isLast={i === DAYS.length - 1}
            />
          ))}
        </div>
      </div>
      <TemplatesSidebar />
    </div>
  )
}
