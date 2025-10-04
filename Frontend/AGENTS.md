# Configuração de Agentes AI - Projeto React SPA

## Agentes e Responsabilidades

### Frontend Agent (Instance 1)
**Responsável por**: Componentes React, UI, styling, interações client-side
**Workspace**: `~/projects/frontend` ou `frontend-worktree`
**Branch**: `feature/frontend-*`
**Tools**: React, TypeScript, CSS Modules, React Router
**Modelo**: Claude Sonnet 4.5

### Backend Agent (Instance 2)
**Responsável por**: APIs REST, lógica de negócio, integração com banco
**Workspace**: `~/projects/backend` ou `backend-worktree`
**Branch**: `feature/backend-*`
**Tools**: Node.js, Express, TypeScript, PostgreSQL
**Modelo**: Claude Sonnet 4.5

### Testing Agent (Instance 3)
**Responsável por**: Testes unitários, integração, E2E, cobertura
**Workspace**: `~/projects/integration` ou `tests-worktree`
**Branch**: `feature/tests-*`
**Tools**: Jest, React Testing Library, Playwright
**Modelo**: Claude Sonnet 4.5

## Coordination Rules

### File Ownership (evitar conflitos)
- Frontend Agent: Apenas arquivos em `src/`, `public/`, `components/`
- Backend Agent: Apenas arquivos em `server/`, `api/`, `database/`
- Testing Agent: Apenas arquivos em `__tests__/`, `e2e/`, `*.test.ts`

### Communication Protocol
- Usar `coordination/active_work_registry.json` para tracking
- Atualizar status: "in_progress", "blocked", "ready_for_review"
- Notificar dependencies via arquivo de status

### Merge Strategy
1. Cada agente trabalha em feature branch isolada
2. Testes devem passar localmente antes de push
3. CI/CD valida antes de merge
4. Code review obrigatório (humano + CodeRabbit)
5. Merge para `develop`, depois `main`

## Specification-Driven Development Workflow

### 1. Constitution Phase
- Ler `specs/.specify/memory/constitution.md`
- Entender princípios e padrões do projeto

### 2. Specify Phase
- Consultar `specs/[feature]/spec.md`
- Entender requisitos funcionais
- Identificar dependencies entre agentes

### 3. Plan Phase
- Revisar `specs/[feature]/plan.md`
- Entender arquitetura técnica
- Coordenar interfaces entre frontend/backend

### 4. Tasks Phase
- Seguir `specs/[feature]/tasks.md`
- Executar tasks na ordem definida
- Respeitar dependencies

### 5. Implement Phase
- TDD: testes primeiro, implementação depois
- Commits frequentes (após cada task)
- Atualizar status de progresso

### 6. Review Phase
- Self-review via `/review` command
- Esperar code review humano
- Iterar se necessário

## Parallel Execution Guidelines

### Independent Tasks (executar em paralelo):
- Frontend UI components + Backend API endpoints
- Diferentes features sem overlapping de arquivos
- Frontend styling + Backend database migrations

### Sequential Tasks (executar em ordem):
- API design → Frontend integration
- Database schema → Backend models → Frontend types
- Authentication backend → Frontend auth UI

## Error Handling

### Agent encontra blocker:
1. Marcar task como "blocked" no registry
2. Documentar blocker em `coordination/blockers.md`
3. Notificar agentes dependentes
4. Solicitar intervenção humana se não resolver em 15min

### Merge conflicts:
1. Git worktrees minimizam mas não eliminam conflicts
2. Ao detectar conflict: pausar, notificar humano
3. Humano resolve conflict manualmente ou via AI merge tools
4. Após resolução: continuar com próxima task

## Quality Gates

### Antes de considerar feature completa:
- [ ] Todos os 3 agentes completaram suas tasks
- [ ] Integration tests passando
- [ ] Build de produção funcional
- [ ] Performance dentro dos SLAs
- [ ] Security scan sem vulnerabilidades críticas
- [ ] Code coverage > 80%
- [ ] Documentação atualizada
- [ ] PR aprovado por humano

## Model Selection Strategy

- **Claude Sonnet 4.5**: Padrão para desenvolvimento geral
- **Claude Opus**: Para tasks complexas de arquitetura
- Usar `/model` command para alternar se necessário

## Monitoring

### Métricas a trackear:
- Tempo de conclusão por task
- Taxa de sucesso de tasks
- Frequência de blockers
- Cobertura de testes
- Qualidade de código (linter score)

### Logs:
- Cada agente loga em `logs/agent-[name]-[date].log`
- Centralizar via Grafana/Prometheus (opcional)
