//Take the select statements from the database and use them to get the data.
//Send the data out through a spreadsheet.

import { parse } from 'csv-parse/sync'
import {readFileSync} from 'node:fs'
import sqlite3 from 'sqlite3'

const input = readFileSync("C:/Users/asajk/Downloads/2024-S3-Foodshack Report.csv");

const parsed_input = parse(input, {
    columns:true
})


const db = new sqlite3.Database('./Hikerbase.db');

let HikerInsertSQL = 'INSERT INTO Hikers (first_name, last_name) VALUES (?,?)'
const HikerInsertStmt = db.prepare(HikerInsertSQL);

let RestrictionsSQL = 'INSERT INTO Restrictions(restriction_type) VALUES(?)'
const RestrictionsStmt = db.prepare(RestrictionsSQL);
RestrictionsStmt.run("No Red Meat");
RestrictionsStmt.run("No Pork");
RestrictionsStmt.run("No Poultry");
RestrictionsStmt.run("No Seafood");
console.log(RestrictionsStmt.run("No Eggs"));

//let HikerRestrictionStmt = 'INSERT INTO HikerRestriction (hiker_id, restriction_id) SELECT hiker
//db.run()


for(const camper of parsed_input){
    const CamperFirstName = camper['First Name'];
    const CamperLastName = camper['Last Name'];
    const RedMeat = !camper['(Diet & Activity / Dieta y actividad) Red Meat'] === 'yes';
    const Pork = !camper['(Diet & Activity / Dieta y actividad) Pork'] === 'yes';
    const Poultry = !camper['(Diet & Activity / Dieta y actividad) Poultry'] === 'yes';
    const Seafood = !camper['(Diet & Activity / Dieta y actividad) Seafood'] === 'yes';
    const Eggs = !camper['(Diet & Activity / Dieta y actividad) Eggs'] === 'yes';
    const AnyOther = camper['(Diet & Activity / Dieta y actividad) Any other dietary restrictions or food allergies?'] === 'yes';
    if(AnyOther){
        const Other = camper['(Diet & Activity / Dieta y actividad) Please specify'];
    }
    const Allergies = camper['Food Allergies'];

    if(RedMeat){  }


    HikerInsertStmt.run(CamperFirstName, CamperLastName);
    break;
}


// console.log(parsed_input)
// console.log("Hello World")