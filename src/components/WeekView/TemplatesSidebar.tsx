import { TEMPLATES, formatDuration, type Template } from './constants'
import { useDragSource } from './hooks'

interface TemplateCardProps {
  template: Template
}

function TemplateCard({ template }: TemplateCardProps) {
  const { dragProps } = useDragSource({
    data: {
      templateId: template.id,
      templateName: template.name,
      duration: template.duration,
    },
  })

  return (
    <div
      {...dragProps}
      className="p-3 bg-muted rounded-md border border-border cursor-grab hover:ring-2 hover:ring-ring active:cursor-grabbing"
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
