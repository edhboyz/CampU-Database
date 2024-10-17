import { parse } from "csv/sync";
import fs from "node:fs";


export function parseCSV(filePath, addHiker, addRestriction, addHikerRestriction) {

  const parsed = parse(
    fs.readFileSync(
      filePath
    ),
    { columns: true }
  );

  const restrictions = {};

  for (const column in parsed[0]) {
    const pattern = /\(Diet & Activity \/ Dieta y actividad\) (.*)/;
    const match = pattern.exec(column);
    if (match) {
      const columnName = match[0];
      const restrictionName = match[1];
      if (restrictionName === "Any other dietary restrictions or food allergies?") {
        break;
      }
      restrictions[restrictionName] = {
        columnName,
        id: addRestriction.run({ restrictionName }).lastInsertRowid,
      };
    }
  }

  for (const hiker of parsed) {
    const newHikerId = addHiker.run({
      firstName: hiker["First Name"],
      lastName: hiker["Last Name"],
    }).lastInsertRowid;
    for (const restriction of Object.values(restrictions)) {
      if (hiker[restriction.columnName] !== "yes") {
        addHikerRestriction.run({
          hikerId: newHikerId,
          restrictionId: restriction.id,
        });
      }
    }
  }
}

