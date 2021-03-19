const db = require('../connection');

async function initDb() {

    /*
    let sql = `CREATE TABLE temp_users(
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        confPasswordToken VARCHAR(255),
        confPasswordExpires DATETIME,
        PRIMARY KEY(email)
    )`;

    await db.query(sql, (err, result) => {
        if(err) console.log("Temp user table failed to be created!");
        else console.log("Temp user table created!");
    });

    // User table
    sql = `CREATE TABLE users(
        id int AUTO_INCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        resetPasswordToken VARCHAR(255),
        resetPasswordExpires DATETIME,
        PRIMARY KEY(id)
    )`;

    await db.query(sql, (err, result) => {
        if(err) console.log("User table failed to be created!");
        else console.log("User table created!");
    });
    

    sql = `CREATE TABLE projects(
        id int AUTO_INCREMENT,
        title VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        lead int NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT current_timestamp(),
        updatedAt DATETIME,
        PRIMARY KEY(id),
        CONSTRAINT lead
            FOREIGN KEY (lead)
            REFERENCES users(id)
            ON DELETE CASCADE
    )`;
    await db.query(sql, (err, result) => {
        if(err) console.log("Projects table failed to be created!");
        else console.log("Projects table created!");
    });



    sql = `CREATE TABLE tickets(
        id int AUTO_INCREMENT,
        title VARCHAR(255),
        description TEXT,
        project_id int NOT NULL,
        user_id int NOT NULL,
        status_id int NOT NULL DEFAULT 0,
        type_id int NOT NULL DEFAULT 1,
        priority_id int NOT NULL DEFAULT 1,
        createdAt DATETIME NOT NULL DEFAULT current_timestamp(),
        updatedAt DATETIME NULL DEFAULT NULL,
        resolvedAt DATETIME NULL DEFAULT NULL,
        dueAt DATETIME NULL DEFAULT NULL,
        PRIMARY KEY(id),
        CONSTRAINT creator
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,
        CONSTRAINT project
            FOREIGN KEY (project_id)
            REFERENCES projects(id)
            ON DELETE CASCADE
    )`;
    await db.query(sql, (err, result) => {
        if(err) console.log("Tickets table failed to be created!");
        else console.log("Tickets table created!");
    });


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
    await db.query(sql, (err, result) => {
        if(err) console.log("Comments table failed to be created!");
        else console.log("Comments table created!");
    });


    sql = `CREATE TABLE project_users(
        project_id int,
        user_id int,
        PRIMARY KEY(project_id, user_id),
        CONSTRAINT projects
            FOREIGN KEY (project_id)
            REFERENCES projects(id)
            ON DELETE CASCADE,
        CONSTRAINT users
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
    )`;
    await db.query(sql, (err, result) => {
        if(err) console.log("Project_users table failed to be created!");
        else console.log("Project_users table created!");
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
            ON DELETE CASCADE
    )`;
    await db.query(sql, (err, result) => {
        if(err) console.log("ticket_users table failed to be created!");
        else console.log("ticket_users table created!");
    });
    

    sql = `CREATE TABLE ticket_status(
        id int AUTO_INCREMENT,
        status VARCHAR(255),
        PRIMARY KEY(id)
    )`;
    
    await db.query(sql, async (err, result) => {
        if(err) console.log("ticket_status table failed to be created!");
        else {
            console.log("ticket_status table created!");
            const statuses = [
                ["Open"],
                ["In Progress"],
                ["Blocked"],
                ["Resolved"]
            ]
            sql = `INSERT INTO ticket_status (status) VALUES ?`;
            await db.query(sql, [statuses], (err, result) => {
                if(err) console.log("ticket statuses failed to be inserted!");
                else console.log("ticket statuses inserted!");
            });
        }
    });


    sql = `CREATE TABLE ticket_type(
        id int AUTO_INCREMENT,
        type VARCHAR(255),
        PRIMARY KEY(id)
    )`;
    
    await db.query(sql, async (err, result) => {
        if(err) console.log("ticket_type table failed to be created!");
        else {
            console.log("ticket_type table created!");
            const types = [
                ["Bug / Error"],
                ["Feature Request"],
                ["Project Proposal"],
                ["Training"]
            ]
            sql = `INSERT INTO ticket_type (type) VALUES ?`;
            await db.query(sql, [types], (err, result) => {
                if(err) console.log("ticket types failed to be inserted!");
                else console.log("ticket types inserted!");
            });
        }
    });

    

   sql = `CREATE TABLE ticket_priority(
        id int AUTO_INCREMENT,
        priority VARCHAR(255),
        PRIMARY KEY(id)
    )`;

    
    
    await db.query(sql, async (err, result) => {
        if(err) console.log("ticket_priority table failed to be created!");
        else {
            console.log("ticket_priority table created!");
            const priorities = [
                ["Low"],
                ["Medium"],
                ["High"],
                ["Urgent"]
            ]
            sql = `INSERT INTO ticket_priority (priority) VALUES ?`;
            await db.query(sql, [priorities], (err, result) => {
                if(err) console.log("ticket priorities failed to be inserted!");
                else console.log("ticket priorities inserted!");
            });
        }
    });

    */
};

module.exports = initDb;
