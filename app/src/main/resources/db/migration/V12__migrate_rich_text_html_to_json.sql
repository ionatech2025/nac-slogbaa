-- ---------------------------------------------------------------------------
-- Convert legacy HTML in content_block.rich_text to JSON TextLine format.
-- TextLine format: [{"id":"<uuid>","type":"paragraph","content":"<text>","indent":0}]
-- ---------------------------------------------------------------------------

UPDATE content_block cb
SET rich_text = (
  jsonb_build_array(
    jsonb_build_object(
      'id', gen_random_uuid()::text,
      'type', 'paragraph',
      'content', COALESCE(
        NULLIF(
          trim(regexp_replace(regexp_replace(cb.rich_text, '<[^>]*>', ' ', 'g'), '\s+', ' ', 'g')),
          ''
        ),
        ''
      ),
      'indent', 0
    )
  )::text
)
WHERE cb.block_type = 'TEXT'
  AND cb.rich_text IS NOT NULL
  AND cb.rich_text LIKE '<%';
