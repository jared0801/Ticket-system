const express = require('express');
const db = require('../connection');
const { authMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');


const router = express.Router();



/*router.get('/', async (req, res) => {
    let sql = 'SELECT * FROM tickets';
    db.query(sql, (err, result) => {
        if(err) throw err;
        //console.log(result);
        res.send(result);
    });
});*/

// Returns all tickets associated with a project
router.get('/:id', authMiddleware, async (req, res) => {
    let info = {
        project_id: req.params.id
    }
    let sql = `
    SELECT
        *
    FROM
        (
        SELECT
            tickets.*,
            ticket_status.status AS status,
            ticket_type.type AS type,
            users.username AS submitter
        FROM
            project_users
        JOIN users ON users.id = user_id
        JOIN tickets ON tickets.project_id = project_users.project_id
        JOIN ticket_status ON tickets.status_id = ticket_status.id
        LEFT JOIN ticket_type ON tickets.type_id = ticket_type.id
        WHERE
            users.id = ?
    ) usertickets
    WHERE
        ?
    ORDER BY
        createdAt DESC
    `
    db.query(sql, [req.user.id, info], (err, result) => {
        if(err) {
            throw err;
        } else {
            //console.log(result);
            const tickets = {
                resolved: result.filter(t => t.resolvedAt !== null),
                unresolved: result.filter(t => t.resolvedAt === null)
            }
            res.send(tickets);
        }

    });
});

// Get a specific ticket
router.get('/:pid/ticket/:tid', authMiddleware, async (req, res) => {
    
    let info = {
        id: req.params.tid,
        project_id: req.params.pid
    }
    
    let sql = `SELECT
        tickets.*,
        ticket_status.status AS status,
        ticket_type.type AS type,
        u.username AS submitter
    FROM tickets
    JOIN users AS u ON
        user_id = u.id
    JOIN ticket_status ON
        tickets.status_id = ticket_status.id
    LEFT JOIN ticket_type ON
        tickets.type_id = ticket_type.id
    WHERE tickets.id=? AND project_id=?`;
    db.query(sql, [info.id, info.project_id], (err, result) => {
        if(err) {
            throw err;
        } else if(result.length) {
            let ticket = result[0];
            // Find all associated users
            const sql = `
                SELECT
                    u.username AS username,
                    u.id AS id
                FROM
                    ticket_users
                JOIN users AS u
                ON
                    user_id = u.id
                JOIN tickets AS t
                ON
                    ticket_id = t.id
                WHERE
                    t.id=?
                AND
                    project_id = ?
            `;
            db.query(sql, [info.id, info.project_id], (err, userResult) => {
                if(err) {
                    throw err;
                } else {
                    ticket.users = userResult;
                    //console.log(ticket);
                    res.send(ticket);
                }

            });
        } else {
            res.send({});
        }

    });
});
    
// Add a ticket
router.post('/', authMiddleware, [
    body('title').not().isEmpty().withMessage("A title is required to create a ticket.").trim().escape(),
    body('text').not().isEmpty().withMessage("Text is required to create a ticket.").trim().escape(),
    body('userId').not().isEmpty().withMessage("A userId is required to create a ticket.").trim().escape(),
    body('project_id').not().isEmpty().withMessage("A project_id is required to create a ticket.").trim().escape(),
], async (req, res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if(req.body.username.includes('demo')) {
        return res.status(403).json({ error: "You cannot create a ticket as the demo user." })
    }
    let ticket = {
        title: req.body.title,
        text: req.body.text,
        user_id: req.body.userId,
        project_id: req.body.project_id,
        type_id: req.body.type_id,
        createdAt: new Date()
    }
    // Add creator as a user by default
    //let seenLead = false;
    /*const users = req.body.users.map(u => {
        if(u.id == project.lead) seenLead = true;
        return u.id
    });
    if(!seenLead) users.push(project.lead);
    */
    let ticketId = 0;
    const users = req.body.users;

    const sql = 'INSERT INTO tickets SET ?';
    db.query(sql, ticket, (err, result) => {
        ticketId = result.insertId;
        if(err) throw err;
        //console.log(result.insertId);
        let promises = [];
        for(user of users) {
            const sql2 = `INSERT INTO ticket_users SET ticket_id=${ticketId}, user_id=?`;
            promises.push(db.query(sql2, user.id));
        }
        Promise.all(promises).then((values) => {
            res.status(201).json({ ticket_id: ticketId, project_id: ticket.project_id });
        });
    })
});

// Resolve ticket
router.get('/res/:id', authMiddleware, async (req, res) => {
    // TODO: validate user has access to this ticket/project
    if(req.user.username.includes('demo')) {
        return res.status(403).json({ error: "You cannot resolve a ticket as the demo user." })
    }
    const ticket = {
        resolvedAt: new Date()
    }
    const sql = 'UPDATE tickets SET ? WHERE ?';
    db.query(sql, [ticket, {id: req.params.id}], (err, result) => {
        if(err) throw err;
        res.status(200).send(result);
    });
})

// Unresolve ticket
router.get('/unres/:id', authMiddleware, async (req, res) => {
    // TODO: validate user has access to this ticket/project
    if(req.user.username.includes('demo')) {
        return res.status(403).json({ error: "You cannot unresolve a ticket as the demo user." })
    }
    const project = {
        resolvedAt: null
    }
    
    const sql = 'UPDATE tickets SET ? WHERE ?';
    db.query(sql, [project, {id: req.params.id}], (err, result) => {
        if(err) throw err;
        res.status(200).send(result);
    });
});

// Edit a ticket
router.post('/:id', authMiddleware, [
    body('title').not().isEmpty().withMessage("A title is required to create a ticket.").trim().escape(),
    body('text').not().isEmpty().withMessage("Ticket details are required to create a ticket.").trim().escape()
], async (req, res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let ticket = {
        title: req.body.title,
        text: req.body.text,
        status_id: req.body.status_id,
        type_id: req.body.type_id,
        updatedAt: new Date()
    }
    const users = req.body.users.map(u => u.id);
    // Update ticket data
    const sql = 'UPDATE tickets SET ? WHERE ?';
    db.query(sql, [ticket, {id: req.params.id}], (err, result) => {
        if(err) throw err;
        // Delete associated users
        const sql = 'DELETE FROM ticket_users WHERE ?';
        db.query(sql, {ticket_id: req.params.id}, (err, result) => {
            // Add associated users
            let promises = [];
            for(user of users) {
                const sql2 = 'INSERT INTO ticket_users SET ticket_id=?, user_id=?';
                promises.push(db.query(sql2, [req.params.id, user], (err, result) => {
                    //console.log("ticket_user already existed");
                }));
            }
            Promise.all(promises).then((values) => {
                res.status(200).json({ ticket_id: req.params.id, project_id: ticket.project_id });
            });
        });
    })
});

// Delete a ticket
router.delete('/:id', authMiddleware, async (req, res) => {
    if(req.user.username.includes('demo')) {
        return res.status(403).json({ error: "You cannot delete a ticket as the demo user." })
    }
    // First delete ticket_users references
    let sql = 'DELETE FROM ticket_users WHERE ?';
        db.query(sql, {ticket_id: req.params.id}, (err, result) => {
            if(err) throw err;
            // Then delete the ticket itself
            sql = 'DELETE FROM tickets WHERE ?';
            db.query(sql, {id: req.params.id}, (err, result) => {
                if(err) throw err;
                res.status(200).send();
            })
        });
});
    
module.exports = router;