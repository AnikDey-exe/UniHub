CREATE TABLE if not exists event (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    capacity INT NOT NULL
);

CREATE SEQUENCE event_seq START WITH 1 INCREMENT BY 1;