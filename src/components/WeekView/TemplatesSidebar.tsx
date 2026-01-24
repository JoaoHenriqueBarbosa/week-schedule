import { TEMPLATES, DRAG_DATA_TYPE, parseDragData } from './constants'
import { TemplateCard } from './TemplateCard'
import { useScheduleStore } from './store'

export function TemplatesSidebar() {
  const removeEvent = useScheduleStore((s) => s.removeEvent)

  const handleDragOver = (e: React.DragEvent) => {
    if (!Array.from(e.dataTransfer.types).includes(DRAG_DATA_TYPE)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const raw = e.dataTransfer.getData(DRAG_DATA_TYPE)
    const data = parseDragData(raw)
    if (!data?.eventId) return
    removeEvent(data.eventId)
  }

  return (
    <div
      className="w-64 shrink-0 bg-card p-4 flex flex-col gap-2"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2 className="font-semibold text-foreground mb-2">Templates</h2>
      {TEMPLATES.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  )
}
