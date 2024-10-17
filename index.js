import Database from "better-sqlite3";
import {parseCSV} from "./parseCSV.js";

const db = new Database("./hikerbase.db", { fileMustExist: false });

db.exec(
  `CREATE TABLE IF NOT EXISTS Restrictions (
    restriction_id INTEGER PRIMARY KEY,
    restriction_name TEXT
  )`
);

db.exec(
  `CREATE TABLE IF NOT EXISTS HikerRestrictions (
    hiker_id INTEGER,
    restriction_id INTEGER,
    PRIMARY KEY (hiker_id, restriction_id)
  )`
);

db.exec(
  `CREATE TABLE IF NOT EXISTS Hikers (
    hiker_id INTEGER PRIMARY KEY,
    first_name TEXT,
    last_name TEXT
  )`
);

const addHiker = db.prepare(`
  INSERT INTO Hikers (first_name, last_name) VALUES (:firstName, :lastName)
`);

const addRestriction = db.prepare(`
  INSERT INTO Restrictions (restriction_name) VALUES (:restrictionName)
`);

const addHikerRestriction = db.prepare(`
  INSERT INTO HikerRestrictions (hiker_id, restriction_id) VALUES (:hikerId, :restrictionId)
`);

parseCSV("C:\\Users\\Asa Kohn\\Downloads\\2024-S3-Foodshack Report.csv", addHiker, addRestriction, addHikerRestriction);

const whoCantEat = db.prepare(
  `SELECT first_name, last_name FROM Hikers
JOIN hikerRestrictions ON hikerRestrictions.hiker_id = Hikers.hiker_id
JOIN restrictions ON restrictions.restriction_id = hikerRestrictions.restriction_id
WHERE restrictions.restriction_name LIKE ?`
);

whoCantEat
  .all("Red Meat")
  .map((h) => console.log(`${h.first_name} ${h.last_name} can not eat Red Meat`)
  )

db.close();