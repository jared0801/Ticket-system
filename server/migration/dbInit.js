const db = require('../connection');

async function initDb() {
/*
    // User table
    let sql = `CREATE TABLE users(
        id int AUTO_INCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        PRIMARY KEY(id)
    )`;
    await db.query(sql);
    
    console.log("User table created!");
    

    sql = `CREATE TABLE projects(
        id int AUTO_INCREMENT,
        title VARCHAR(255),
        description TEXT,
        lead int NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT current_timestamp(),
        updatedAt DATETIME,
        PRIMARY KEY(id),
        CONSTRAINT lead
            FOREIGN KEY (lead)
            REFERENCES users(id)
    )`;
    await db.query(sql);
    console.log("Projects table created!");



    sql = `CREATE TABLE tickets(
        id int AUTO_INCREMENT,
        title VARCHAR(255),
        text VARCHAR(1000),
        project_id int NOT NULL,
        user_id int NOT NULL,
        status_id int NOT NULL DEFAULT 0,
        type_id int NOT NULL DEFAULT 1,
        priority_id int NOT NULL DEFAULT 1,
        createdAt DATETIME NOT NULL DEFAULT current_timestamp(),
        updatedAt DATETIME,
        resolvedAt DATETIME,
        PRIMARY KEY(id),
        CONSTRAINT creator
            FOREIGN KEY (user_id)
            REFERENCES users(id),
        CONSTRAINT project
            FOREIGN KEY (project_id)
            REFERENCES projects(id)
            ON DELETE CASCADE
    )`;
    await db.query(sql);

    console.log('Tickets table created');


    sql = `CREATE TABLE comments(
        id int AUTO_INCREMENT,
        ticket_id int NOT NULL,
        user_id int NOT NULL,
        text TEXT,
        createdAt DATETIME NOT NULL DEFAULT current_timestamp(),
        updatedAt DATETIME,
        PRIMARY KEY(id),
        CONSTRAINT ticket_comments
            FOREIGN KEY (ticket_id)
            REFERENCES tickets(id)
            ON DELETE CASCADE,
        CONSTRAINT ticket_user
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
        )`;
    await db.query(sql);
    console.log("Comments table created!");

    



    sql = `CREATE TABLE project_users(
        project_id int,
        user_id int,
        PRIMARY KEY(project_id, user_id),
        CONSTRAINT projects
            FOREIGN KEY (project_id)
            REFERENCES projects(id),
        CONSTRAINT users
            FOREIGN KEY (user_id)
            REFERENCES users(id)
    )`;
    db.query(sql, (err, res) => {
        if(err) throw err;
        console.log(res);
        console.log("Project_users table created!");
    });
    

    sql = `CREATE TABLE ticket_users(
        ticket_id int,
        user_id int,
        PRIMARY KEY(ticket_id, user_id),
        CONSTRAINT tickets
            FOREIGN KEY (ticket_id)
            REFERENCES tickets(id)
            ON DELETE CASCADE,
        CONSTRAINT ticketusers
            FOREIGN KEY (user_id)
            REFERENCES users(id)
    )`;
    db.query(sql, (err, res) => {
        if(err) throw err;
        console.log(res);
        console.log("ticket_users table created!");
    });
    

    sql = `CREATE TABLE ticket_status(
        id int AUTO_INCREMENT,
        status VARCHAR(255),
        PRIMARY KEY(id)
    )`;
    db.query(sql, (err, res) => {
        if(err) throw err;
        console.log(res);
        console.log("ticket_status table created!");

            
        const statuses = [
            ["Open"],
            ["In Progress"],
            ["Blocked"],
            ["Closed"]
        ]
        sql = `INSERT INTO ticket_status (status) VALUES ?`;
        db.query(sql, [statuses], (err, res) => {
            if(err) throw err;
            console.log(res);
            console.log("ticket statuses inserted!");
        });
    });






    sql = `CREATE TABLE ticket_type(
        id int AUTO_INCREMENT,
        type VARCHAR(255),
        PRIMARY KEY(id)
    )`;
    db.query(sql, (err, res) => {
        if(err) throw err;
        console.log(res);
        console.log("ticket_type table created!");

        const types = [
            ["Bug / Error"],
            ["Feature Request"],
            ["Project Proposal"],
            ["Training"]
        ]
        sql = `INSERT INTO ticket_type (type) VALUES ?`;
        db.query(sql, [types], (err, res) => {
            if(err) throw err;
            console.log(res);
            console.log("Ticket types inserted!");
        });
    });
   
    

   sql = `CREATE TABLE ticket_priority(
        id int AUTO_INCREMENT,
        priority VARCHAR(255),
        PRIMARY KEY(id)
    )`;
    db.query(sql, (err, res) => {
        if(err) throw err;
        console.log(res);
        console.log("ticket_priority table created!");

        const priorities = [
            ["Low"],
            ["Medium"],
            ["High"],
            ["Urgent"]
        ]
        sql = `INSERT INTO ticket_priority (priority) VALUES ?`;
        db.query(sql, [priorities], (err, res) => {
            if(err) throw err;
            console.log(res);
            console.log("Ticket priorities inserted!");
        });
    });
    */
};

module.exports = initDb;
