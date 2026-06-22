.PHONY: setup dev dev-backend dev-mobile build test lint typecheck \
        migrate migrate-prod seed docker-up docker-down studio \
        orchestrator-setup pipeline-install pipeline-start pipeline-resume pipeline-dashboard

# ── Bootstrap ─────────────────────────────────────────────────────────────────
setup:
	pnpm install
	cp -n apps/backend/.env.example apps/backend/.env || true
	cp -n apps/mobile/.env.example apps/mobile/.env || true
	make docker-up
	sleep 3
	make migrate

# ── Development ───────────────────────────────────────────────────────────────
dev:
	make docker-up
	turbo run dev --parallel

dev-backend:
	make docker-up
	cd apps/backend && pnpm dev

dev-mobile:
	cd apps/mobile && EXPO_PUBLIC_API_URL=http://$$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo localhost):3001 pnpm dev

# ── Database ──────────────────────────────────────────────────────────────────
docker-up:
	docker compose up -d

docker-down:
	docker compose down

migrate:
	cd apps/backend && pnpm prisma migrate dev

migrate-prod:
	cd apps/backend && pnpm prisma migrate deploy

seed:
	cd apps/backend && pnpm prisma db seed

studio:
	cd apps/backend && pnpm prisma studio

# ── Quality ────────────────────────────────────────────────────────────────────
test:
	turbo run test

lint:
	turbo run lint

typecheck:
	turbo run typecheck

# ── Build ──────────────────────────────────────────────────────────────────────
build:
	turbo run build

# ── Pipeline ─────────────────────────────────────────────────────────────────
orchestrator-setup:
	@test -n "$(STACK)" || (echo "Usage: make orchestrator-setup STACK=web|mobile"; exit 1)
	git submodule update --init
	sh prototype-orchestrator/setup.sh "$(STACK)"

pipeline-install:
	cd prototype-orchestrator && npm install

pipeline-start:
	@test -n "$(FEATURE)" || (echo "Usage: make pipeline-start FEATURE=\"<flow name>\" [SCOPE=backend|mobile|both]"; exit 1)
	cd prototype-orchestrator && npm run pipeline -- start "$(FEATURE)" $(if $(SCOPE),--scope $(SCOPE),)

pipeline-resume:
	@test -n "$(THREAD)" || (echo "Usage: make pipeline-resume THREAD=<threadId>"; exit 1)
	cd prototype-orchestrator && npm run pipeline -- resume "$(THREAD)"

pipeline-dashboard:
	cd prototype-orchestrator && npm run dashboard
