const express = require('express')
const util = require('util');
  
const app = express()
const port = 3000

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

const mysql2 = require('mysql2/promise')

app.get('/', async (req,res) => {
    res.send(buildResponse(await getPeopleNames()));
})

app.listen(port, () => {
    console.log('Running on port  ' + port);
})

function buildResponse(peopleNames) {
    var htmlResult = '<h1>Full Cycle Rocks featuring Node, MySql and Nginx</h1>';

    peopleNames.forEach(function(name) { 
        htmlResult += "<p>" + name + "</p>"
    });

    return "<html><body>" + htmlResult + "</body></html>";
}

async function getPeopleNames() {
    var peopleNames = [];
    const sql = "SELECT * from people";
    var [rows, cols] = await runSqlQuery(sql);

    if (rows.length === 0) {
        await insertPeople();
        [rows, cols] = await runSqlQuery(sql);
    }

    Object.keys(rows).forEach(function(key) {
        peopleNames.push(rows[key].name);
    })    

    return peopleNames;
}

async function insertPeople() {
    await insertPerson('Alex')
    await insertPerson('Wesley')
    await insertPerson('Vini Malvadeza')
}

async function insertPerson(name) {
    await runInsertSql(util.format("INSERT INTO people(name) values('%s')", name));
}

async function runSqlQuery(sql) {
    const connection = await mysql2.createConnection(config);
    var [rows, cols] = await connection.query(sql);
    connection.end()
    return [rows, cols];
}

async function runInsertSql(sql) {
    const connection = await mysql2.createConnection(config);
    await connection.query(sql);
    connection.end()

}

