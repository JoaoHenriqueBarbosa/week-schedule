import { TEMPLATES, formatDuration } from './constants'

export function TemplatesSidebar() {
  return (
    <div className="w-64 shrink-0 bg-card p-4 flex flex-col gap-2">
      <h2 className="font-semibold text-foreground mb-2">Templates</h2>
      {TEMPLATES.map((template) => (
        <div
          key={template.id}
          className="p-3 bg-muted rounded-md border border-border cursor-pointer hover:ring-2 hover:ring-ring"
        >
          <div className="font-medium text-foreground">{template.name}</div>
          <div className="text-xs text-muted-foreground">{formatDuration(template.duration)}</div>
        </div>
      ))}
    </div>
  )
}
