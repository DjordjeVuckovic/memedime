FROM oven/bun AS builder

WORKDIR /src

ENV NODE_ENV=production

COPY package.json ./
COPY bun.lock bun.lock
COPY apps/server/package.json apps/server/package.json

RUN bun install

COPY apps/server/ ./apps/server/

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile server \
	apps/server/src/index.ts

FROM gcr.io/distroless/base AS final

WORKDIR /src

ENV NODE_ENV=production

COPY --from=builder /src/server server

ENTRYPOINT ["./server"]
