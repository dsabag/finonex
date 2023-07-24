DROP DATABASE IF EXISTS finonex;

CREATE DATABASE finonex;

\c finonex;

CREATE TABLE users_revenue (
    user_id VARCHAR(255) NOT NULL PRIMARY KEY,
    revenue NUMERIC(11) NOT NULL
);

INSERT INTO users_revenue (user_id,revenue) 
VALUES
('user1',70),
('user2',100),
('user3',20),
('user4',150),
('user5',344),
('user6',288),
('user7',232),
('user8',239);
