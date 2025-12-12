-- Create FTS5 virtual table for coins
CREATE VIRTUAL TABLE IF NOT EXISTS coins_fts USING fts5
(
    name,
    ticker,
    tagline,
    description,
    content='coins',
    content_rowid='id',
    tokenize='porter unicode61'
);
--> statement-breakpoint
INSERT INTO coins_fts(rowid, name, ticker, tagline, description)
SELECT id, name, ticker, tagline, description
FROM coins
WHERE deleted_at IS NULL;
--> statement-breakpoint
CREATE TRIGGER coins_ai
    AFTER INSERT
    ON coins
BEGIN
    INSERT INTO coins_fts(rowid, name, ticker, tagline, description)
    VALUES (new.id, new.name, new.ticker, new.tagline, new.description);
END;
--> statement-breakpoint
CREATE TRIGGER coins_ad
    AFTER DELETE
    ON coins
BEGIN
    DELETE FROM coins_fts WHERE rowid = old.id;
END;
--> statement-breakpoint
CREATE TRIGGER coins_au
    AFTER UPDATE
    ON coins
BEGIN
    DELETE FROM coins_fts WHERE rowid = old.id;

    INSERT INTO coins_fts(rowid, name, ticker, tagline, description)
    SELECT new.id, new.name, new.ticker, new.tagline, new.description
    WHERE new.deleted_at IS NULL;
END;
