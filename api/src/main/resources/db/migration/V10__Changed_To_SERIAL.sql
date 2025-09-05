CREATE SEQUENCE event_id_seq;

-- Set the sequence to start from the current max id + 1 (in case you have existing data)
SELECT setval('event_id_seq', COALESCE((SELECT MAX(id) FROM event), 1));

-- Alter the column to use the sequence as default
ALTER TABLE event ALTER COLUMN id SET DEFAULT nextval('event_id_seq');

-- Make the sequence owned by the column (so it gets dropped if column is dropped)
ALTER SEQUENCE event_id_seq OWNED BY event.id;