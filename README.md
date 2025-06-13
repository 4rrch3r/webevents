# Webevents

Overall, project is monorepo nest js app, that has such main modules:

- **Gateway** — receives webhook events from a publisher and publishes them to corresponding nats topics
- **Collectors (FB & TT)** — subscribe to topics, process incoming events, and persist data to PostgreSQL via Prisma
- **Reporter** — exposes structured API endpoints to generate reports on event stats, revenue, and user demographics
- **Prometheus & Grafana** — used for monitoring metrics like accepted, failed, and processed events, as well as API latency.

And such custom libs:

- **Metrics-core** — monitoring metrics like accepted, failed, and processed events, as well as API latency.
- **Nats-wrapper** — custom wrapper to pub/sub streams in nats
- **Prisma module** — to serve requests, work with schemas, migrations etc.

Technical requirements are listed here : https://opaque-production-68e.notion.site/Universe-Group-1c9ce9899cb7803181a0f3dde873fa31

## Technologies Used

- **NestJS (TypeScript)**
- **NATS JetStream**
- **PostgreSQL + Prisma**
- **Prometheus + Grafana**
- **Docker & Docker Compose**

## How to run app

1. Prepopulate .env file (from .env.sample)
2. Run `npm run start:dev:all` (only dev mode)

## Docs

Swagger documentation for **Reporter** module is listed here : `<REPORTER_PORT>/api/docs`

## Notes

I wanted to centralize metrics logic into a shared NestJS library. This turned out to be trickier than expected due to dynamic service registration and decorator limitations. I also spent significant time experimenting with Docker compatibility and configuration across services, especially for Grafana and NATS connectivity.

If I had more time, I would add more tests, create shared constants for error messages and fields, improve Docker with healthchecks and better startup/shutdown and refactor some parts of the code to make it cleaner (e.g. metrics)
