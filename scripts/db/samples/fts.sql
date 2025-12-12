SELECT c.id,
       c.name,
       c.ticker,
       c.tagline,
       c.description,
       c.supply,
       c.marketing,
       c.lp_burned_percentage AS lpBurnPercentage,
       c.dev_percentage AS devPercentage,
       c.marketing_fee_percentage AS marketingFeePercentage,
       c.community_fee_percentage AS communityFeePercentage,
       c.mode,
       c.combos,
       c.prompt,
       c.created_at AS createdAt,
       bm25(coins_fts) AS rank
FROM coins c
         JOIN coins_fts fts ON c.id = fts.rowid
WHERE coins_fts MATCH 'trump'
  AND c.deleted_at IS NULL
ORDER BY rank
LIMIT 100
