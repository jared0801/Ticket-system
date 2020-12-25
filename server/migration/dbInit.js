const db = require('../connection');

async function initDb() {

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
    await db.query(sql)
    console.log("Project_users table created!");
    

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
    await db.query(sql);
    console.log("ticket_users table created!");
    


};

module.exports = remigrateDb;
