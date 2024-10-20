import Database from "better-sqlite3";
import {parseCSV} from "./parseCSV.js";
import {addToGroup} from "./addToGroup.js";

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
    group_id INTEGER,
    choice_id INTEGER,
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

const addToGroupStatement = db.prepare(`
    UPDATE Hikers SET group_id = :groupId WHERE first_name = :firstName AND last_name = :lastName
`);

parseCSV("C:\\Users\\asajk\\Downloads\\2024-S3-Foodshack Report.csv", addHiker, addRestriction, addHikerRestriction);
addToGroup(addToGroupStatement, "Beatrice", "Dole", 1);
addToGroup(addToGroupStatement, "Sejal", "Datar", 2);
addToGroup(addToGroupStatement, "Leo", "Cox", 2);

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

const groupMembers = db.prepare(
    `SELECT first_name, last_name FROM Hikers WHERE group_id = ?`
);

const getGroups = db.prepare(
    `SELECT DISTINCT group_id from Hikers WHERE group_id IS NOT NULL ORDER BY group_id`
);

// console.log(getGroups.all());
getGroups.all().forEach( (g) =>
{
    console.log(`Group ${g.group_id}:`);
    groupMembers
    .all(g.group_id)
    .map((h) => console.log(`${h.first_name} ${h.last_name} is in group ${g.group_id}`));
}
)


db.close();