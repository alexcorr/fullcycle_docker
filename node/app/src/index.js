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

appInit();

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

    Object.keys(rows).forEach(function(key) {
        peopleNames.push(rows[key].name);
    })    

    return peopleNames;
}


async function appInit() {
    await assertDatabaseOK();
    await assertSchemaOK();
    await assertDatabaseIsPopulated();
}

async function assertDatabaseOK() {
    const configAdmin = {
        host: 'db',
        user: 'root',
        password: 'root'
    };
    const sql = "CREATE DATABASE IF NOT EXISTS nodedb"
    
    const connection = await mysql2.createConnection(configAdmin);
    await connection.query(sql);
    connection.end()
}

async function assertSchemaOK() {
    const sql = "SELECT count(*) as tablesCount \
                 FROM information_schema.TABLES \
                 WHERE (TABLE_SCHEMA = 'nodedb') AND (TABLE_NAME = 'people')"

    var [rows, cols] = await runSqlQuery(sql)
    if (rows[0].tablesCount === 0) {
        await createSchema()
    }
}

async function createSchema() {
    const sql = "CREATE TABLE people (id int not null auto_increment, name varchar(255), primary key(id))"
    await executeSql(sql);
}

async function assertDatabaseIsPopulated() {
    var peopleNames = await getPeopleNames();
    if (peopleNames.length === 0) {
        await insertPeople();
    }
}

async function insertPeople() {
    await insertPerson('Alex')
    await insertPerson('Wesley')
    await insertPerson('Vini Malvadeza')
    await insertPerson('Messi')
}

async function insertPerson(name) {
    await executeSql(util.format("INSERT INTO people(name) values('%s')", name));
}

async function runSqlQuery(sql) {
    const connection = await mysql2.createConnection(config);
    var [rows, cols] = await connection.query(sql);
    connection.end()
    return [rows, cols];
}

async function executeSql(sql) {
    const connection = await mysql2.createConnection(config);
    await connection.query(sql);
    connection.end()
}


