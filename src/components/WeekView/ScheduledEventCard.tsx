import { type ScheduledEvent, durationToSlots, formatDuration } from './constants'

interface ScheduledEventCardProps {
  event: ScheduledEvent
  onRemove: (eventId: string) => void
}

export function ScheduledEventCard({ event, onRemove }: ScheduledEventCardProps) {
  const slotsOccupied = durationToSlots(event.duration)

  return (
    <div
      className="absolute inset-x-0 z-10 bg-primary text-primary-foreground rounded-sm p-1 overflow-hidden cursor-pointer hover:bg-primary/90 transition-colors border-2 border-white"
      style={{
        top: 0,
        height: `calc(${slotsOccupied} * 100% - 1px)`,
      }}
      onClick={() => onRemove(event.id)}
      title="Clique para remover"
    >
      <div className="font-medium text-xs truncate">{event.templateName}</div>
      <div className="text-xs opacity-80">{formatDuration(event.duration)}</div>
    </div>
  )
}
