# Week Schedule

Aplicação de agendamento semanal com interface drag and drop para organização de horários de cursos.

## Funcionalidades

- Visualização de grade semanal com slots de 30 minutos
- Templates de cursos com durações configuráveis
- Drag and drop para adicionar eventos na grade
- Movimentação de eventos entre dias e horários
- Remoção de eventos arrastando para a sidebar
- Validação de colisões entre eventos
- Preview visual durante o arraste

## Tecnologias

- React 19
- TypeScript
- Vite (Rolldown)
- Tailwind CSS 4
- Zustand (gerenciamento de estado)

## Instalação

```bash
bun install
```

## Desenvolvimento

```bash
bun run dev
```

## Build

```bash
bun run build
```

## Estrutura

```
src/
├── components/
│   └── WeekView/
│       ├── constants.ts      # Constantes, tipos e utilitários
│       ├── store.ts          # Estado global (Zustand)
│       ├── WeekView.tsx      # Componente principal
│       ├── WeekHeader.tsx    # Cabeçalho com dias da semana
│       ├── TimeColumn.tsx    # Coluna de horários
│       ├── DayColumn.tsx     # Coluna de cada dia
│       ├── TemplatesSidebar.tsx  # Sidebar com templates
│       ├── TemplateCard.tsx  # Card de template draggable
│       └── ScheduledEventCard.tsx  # Evento agendado
├── App.tsx
├── main.tsx
└── index.css
```

## Licença

MIT
