FROM oven/bun AS builder

WORKDIR /src

ENV NODE_ENV=production

COPY package.json ./
COPY bun.lock bun.lock
COPY apps/api/package.json apps/api/package.json

RUN bun install

COPY apps/api/ ./apps/api/

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile api \
	apps/api/src/index.ts

FROM gcr.io/distroless/base AS final

WORKDIR /src

ENV NODE_ENV=production

COPY --from=builder /src/api api

ENTRYPOINT ["./api"]
