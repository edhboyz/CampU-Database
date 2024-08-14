-- SQLite
CREATE TABLE IF NOT EXISTS Restrictions (
    restriction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    restriction_type VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS HikerRestriction (
    hiker_id INT (11),
    restriction_id INT(11),
    FOREIGN KEY (restriction_id) REFERENCES Restrictions(restriction_id),
    FOREIGN KEY (hiker_id) REFERENCES Hikers(hiker_id),
    PRIMARY KEY (hiker_id, restriction_id)
);

CREATE TABLE IF NOT EXISTS Hikers (
    hiker_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    CONSTRAINT full_name UNIQUE (first_name, last_name)
);

-- INSERT INTO Hikers (first_name, last_name)
-- VALUES ('Asa', 'Kohn');

-- INSERT INTO Restrictions (restriction_type)
-- VALUES ('Dairy Free');

-- INSERT INTO HikerRestriction (hiker_id, restriction_id)
-- VALUES (SELECT hiker_id from Hikers, SELECT restriction_id from Restrictions);
