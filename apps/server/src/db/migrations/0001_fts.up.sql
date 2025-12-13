CREATE VIRTUAL TABLE IF NOT EXISTS coins_fts USING fts5
(
    name,
    ticker,
    tagline,
    description,
    content='coins',
    content_rowid='id',
    tokenize="porter unicode61 remove_diacritics 2 tokenchars '_-'",
    prefix='2 3',
    detail= full
);
--> statement-breakpoint

INSERT INTO coins_fts(rowid, name, ticker, tagline, description)
SELECT id,
       name,
       ticker,
       COALESCE(tagline, ''),
       COALESCE(description, '')
FROM coins
WHERE deleted_at IS NULL;
--> statement-breakpoint

CREATE TRIGGER coins_ai
    AFTER INSERT
    ON coins
    WHEN new.deleted_at IS NULL
BEGIN
    INSERT INTO coins_fts(rowid, name, ticker, tagline, description)
    VALUES (new.id,
            new.name,
            new.ticker,
            COALESCE(new.tagline, ''),
            COALESCE(new.description, ''));
END;
--> statement-breakpoint

CREATE TRIGGER coins_au
    AFTER UPDATE
    ON coins
    WHEN old.name IS NOT new.name
        OR old.ticker IS NOT new.ticker
        OR old.tagline IS NOT new.tagline
        OR old.description IS NOT new.description
        OR old.deleted_at IS NOT new.deleted_at
BEGIN
    INSERT INTO coins_fts(coins_fts, rowid, name, ticker, tagline, description)
    VALUES ('delete',
            old.id,
            old.name,
            old.ticker,
            COALESCE(old.tagline, ''),
            COALESCE(old.description, ''));

    INSERT INTO coins_fts(rowid, name, ticker, tagline, description)
    SELECT new.id,
           new.name,
           new.ticker,
           COALESCE(new.tagline, ''),
           COALESCE(new.description, '')
    WHERE new.deleted_at IS NULL;
END;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_coins_deleted_at ON coins(deleted_at) WHERE deleted_at IS NULL;
