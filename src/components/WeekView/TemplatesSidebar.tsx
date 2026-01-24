import { TEMPLATES } from './constants'
import { TemplateCard } from './TemplateCard'

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
