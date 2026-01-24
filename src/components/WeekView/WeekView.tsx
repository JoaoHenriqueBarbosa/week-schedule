import { DAYS, type DragData } from './constants'
import { WeekHeader } from './WeekHeader'
import { TimeColumn } from './TimeColumn'
import { DayColumn } from './DayColumn'
import { TemplatesSidebar } from './TemplatesSidebar'
import { useScheduledEvents } from './hooks'

export function WeekView() {
  const { addEvent, removeEvent, checkCollision, getEventsForDay } = useScheduledEvents()

  const handleDrop = (dayIndex: number, slotIndex: number, data: DragData) => {
    addEvent(dayIndex, slotIndex, data)
  }

  return (
    <div className="h-screen bg-background p-4 flex">
      <div className="bg-card rounded-lg shadow overflow-hidden border border-border flex-1 flex flex-col">
        <WeekHeader />
        <div className="flex flex-1">
          <TimeColumn />
          {DAYS.map((day, i) => (
            <DayColumn
              key={day}
              isLast={i === DAYS.length - 1}
              events={getEventsForDay(i)}
              onDrop={(slotIndex, data) => handleDrop(i, slotIndex, data)}
              onRemoveEvent={removeEvent}
              checkCollision={(slotIndex, slotsRequired) =>
                checkCollision(i, slotIndex, slotsRequired)
              }
            />
          ))}
        </div>
      </div>
      <TemplatesSidebar />
    </div>
  )
}
