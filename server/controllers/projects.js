const express = require('express');
const db = require('../connection');
const { authMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');


const router = express.Router();



// Returns a list of all projects
router.get('/', authMiddleware, async (req, res) => {
    const sql = `
        SELECT
            proj.*,
            u.username AS lead
        FROM
            projects AS proj
        JOIN project_users AS up
        ON
            proj.id = up.project_id
        JOIN users AS u
        ON
            proj.lead = u.id
        WHERE
            user_id = ?
    `;
    db.query(sql, req.user.id, (err, result) => {
        if(err) throw err;
        //console.log(result);
        res.send(result);
    });
});

// Get a specific project
router.get('/:id', authMiddleware, async (req, res) => {
    // Add lead user username to results
    const sql = `
        SELECT
            proj.*,
            u.username AS lead
        FROM
            projects AS proj
        JOIN users AS u
        ON
            proj.lead = u.id
        WHERE
            proj.id = ?
    `;
    db.query(sql, req.params.id, (err, result) => {
        if(err) {
            throw err;
        } else if(result.length) {
            let project = result[0];
            // Find all associated users
            const sql = `
                SELECT
                    u.username AS username,
                    u.id AS id
                FROM
                    project_users
                JOIN users AS u
                ON
                    user_id = u.id
                JOIN projects AS p
                ON
                    project_id = p.id
                WHERE
                    project_id = ?
            `;
            db.query(sql, req.params.id, (err, userResult) => {
                if(err) {
                    throw err;
                } else {
                    project.users = userResult;
                    //console.log(project);
                    res.send(project);
                }

            });
        } else {
            res.send({});
        }

    });
});

// Get users assigned to a given project
router.get('/:id/users', authMiddleware, async (req, res) => {
    const sql = `
        SELECT
            u.username AS username
        FROM
            project_users
        JOIN users AS u
        ON
            user_id = u.id
        JOIN projects AS p
        ON
            project_id = p.id
        WHERE
            project_id = ?
    `;
    db.query(sql, req.params.id, (err, result) => {
        if(err) {
            throw err;
        } else {
            //console.log(result);
            res.send(result);
        }

    });
});

// Add a project
router.post('/', authMiddleware, [
    body('title').not().isEmpty().withMessage("A title is required to create a project.").trim().escape(),
    body('description').not().isEmpty().withMessage("A description is required to create a project.").trim().escape(),
    body('userId').not().isEmpty().withMessage("A lead userId is required to create a project.").trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    if(req.body.username.includes('dev1')) {
        return res.status(403).json({ error: "You cannot create a project as the dev user." })
    }

    let project = {
        title: req.body.title,
        description: req.body.description,
        lead: req.body.userId,
        createdAt: new Date()
    }
    let seenLead = false;
    const users = req.body.users.map(u => {
        if(u.id == project.lead) seenLead = true;
        return u.id
    });
    if(!seenLead) users.push(project.lead);

    let projId = 0;

    const sql = 'INSERT INTO projects SET ?';
    let query = db.query(sql, project, (err, result) => {
        projId = result.insertId;
        if(err) throw err;
        //console.log(result.insertId);
        let promises = [];
        for(user of users) {
            const sql2 = `INSERT INTO project_users SET project_id=${projId}, user_id=?`;
            promises.push(db.query(sql2, user));
        }
        Promise.all(promises).then((values) => {
            res.status(201).json({id: projId});
        });
    })
});


// Edit a project
router.post('/:id', authMiddleware, [
    body('title').not().isEmpty().withMessage("A title is required to create a project.").trim().escape(),
    body('description').not().isEmpty().withMessage("A description is required to create a project.").trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    console.log(req.body);
    let project = {
        title: req.body.title,
        description: req.body.description,
        updatedAt: new Date()
    }
    //console.log(project);
    /*let seenLead = false;
    console.log('UPDATE')
    console.log(req.body.users);
    const users = req.body.users.map(u => {
        if(u.username == project.lead) seenLead = true;
        return u.id
    });
    if(!seenLead) users.push(project.lead);
    console.log(users);*/
    const users = req.body.users.map(u => u.id);
    console.log(users);
    // Update project data
    const sql = 'UPDATE projects SET ? WHERE ?';
    db.query(sql, [project, {id: req.params.id}], (err, result) => {
        if(err) throw err;
        // Delete associated users
        const sql = 'DELETE FROM project_users WHERE ?';
        db.query(sql, {project_id: req.params.id}, (err, result) => {
            // Add associated users
            let promises = [];
            for(user of users) {
                const sql2 = 'INSERT INTO project_users SET project_id=?, user_id=?';
                promises.push(db.query(sql2, [req.params.id, user], (err, result) => {
                    //console.log("project_user already existed");
                }));
            }
            Promise.all(promises).then((values) => {
                res.status(200).json({ id: req.params.id});
            });
        });
    })
});

// Delete a project
router.delete('/:id', authMiddleware, async (req, res) => {
    if(req.user.username.includes('dev1')) {
        return res.status(403).json({ error: "You cannot delete a project as the dev user." })
    }
    // First delete project_users references
    let sql = 'DELETE FROM project_users WHERE ?';
        db.query(sql, {project_id: req.params.id}, (err, result) => {
            if(err) throw err;
            // Then delete the project itself
            sql = 'DELETE FROM projects WHERE ?';
            db.query(sql, {id: req.params.id}, (err, result) => {
                if(err) throw err;
                res.status(200).send();
            })
        });
});
    
module.exports = router;