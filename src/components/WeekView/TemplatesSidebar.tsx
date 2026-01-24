import { TEMPLATES, formatDuration, type Template } from './constants'
import { useScheduleStore } from './store'

interface TemplateCardProps {
  template: Template
}

function TemplateCard({ template }: TemplateCardProps) {
  const setDragging = useScheduleStore((s) => s.setDragging)

  const handleDragStart = (e: React.DragEvent) => {
    const data = {
      templateId: template.id,
      templateName: template.name,
      duration: template.duration,
    }

    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const styles = getComputedStyle(target)
    const clone = target.cloneNode(true) as HTMLElement
    clone.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: ${rect.width}px;
      height: ${rect.height}px;
      background-color: ${styles.backgroundColor};
      border-radius: 0;
      border: ${styles.border};
      box-shadow: none;
    `
    document.body.appendChild(clone)
    e.dataTransfer.setDragImage(clone, e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    requestAnimationFrame(() => document.body.removeChild(clone))

    e.dataTransfer.setData('application/schedule-template', JSON.stringify(data))
    e.dataTransfer.effectAllowed = 'copy'
    setDragging(data)
  }

  const handleDragEnd = () => {
    setDragging(null)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="p-3 bg-muted rounded-md border border-border cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-ring"
      style={{ transition: 'none' }}
    >
      <div className="font-medium text-foreground">{template.name}</div>
      <div className="text-xs text-muted-foreground">{formatDuration(template.duration)}</div>
    </div>
  )
}

export function TemplatesSidebar() {
  return (
    <div className="w-64 shrink-0 bg-card p-4 flex flex-col gap-2">
      <h2 className="font-semibold text-foreground mb-2">Templates</h2>
      {TEMPLATES.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  )
}
