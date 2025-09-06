-- Create user table
CREATE TABLE if not exists app_user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    about TEXT,
    profile_picture VARCHAR(500)
);

-- Create index on email for better query performance
CREATE INDEX idx_user_email ON app_user(email);