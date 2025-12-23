-- ChatGPT Archive Search Function
-- Full-text search with ranking and snippet extraction

CREATE OR REPLACE FUNCTION search_chatgpt_messages(
  search_query TEXT,
  result_limit INT DEFAULT 20,
  result_offset INT DEFAULT 0
)
RETURNS TABLE (
  conversation_id UUID,
  conversation_title TEXT,
  message_id UUID,
  role TEXT,
  snippet TEXT,
  rank REAL
)
LANGUAGE plpgsql
AS $$
DECLARE
  ts_query TSQUERY;
BEGIN
  -- Convert search query to tsquery
  ts_query := plainto_tsquery('english', search_query);

  RETURN QUERY
  SELECT
    m.conversation_id,
    c.title AS conversation_title,
    m.id AS message_id,
    m.role,
    ts_headline(
      'english',
      m.content_text,
      ts_query,
      'StartSel=<mark>, StopSel=</mark>, MaxWords=30, MinWords=15'
    ) AS snippet,
    ts_rank(m.content_tsv, ts_query) AS rank
  FROM chatgpt_messages m
  JOIN chatgpt_conversations c ON c.id = m.conversation_id
  WHERE
    c.visibility = 'public'
    AND m.content_tsv @@ ts_query
  ORDER BY rank DESC, m.created_at DESC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$;

COMMENT ON FUNCTION search_chatgpt_messages IS 'Full-text search across public ChatGPT messages with ranked results';
