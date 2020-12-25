const express = require('express');
const db = require('../connection');
const { authMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get comments for a ticket
router.get('/:id', async (req, res) => {
    const sql = `
        SELECT
            comments.*, users.username
        FROM
            comments
        JOIN users
        ON
            comments.user_id = users.id
        WHERE
            ticket_id = ?
        ORDER BY
            createdAt DESC
    `;
    db.query(sql, req.params.id, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

// Add a comment
router.post('/', [
    body('text').isString().isLength({min: 3}).exists().withMessage("Text is required to be at least 3 characters long.").trim().escape(),
    body('ticketId').isNumeric().not().isEmpty().withMessage("A ticket id is required to leave a comment on a ticket.").trim().escape(),
    body('userId').isNumeric().not().isEmpty().withMessage("A lead userId is required to create a project.").trim().escape()
], async (req, res) => {
    if(req.user.username.includes('demo')) {
        return res.status(403).json({ error: "You cannot create a comment as the demo user." })
    }
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const newComment = {
        text: req.body.text,
        user_id: req.body.userId,
        ticket_id: req.body.ticketId,
        createdAt: new Date()
    }
    
    const sql = 'INSERT INTO comments SET ?';
    db.query(sql, newComment, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
    
});

// Update a comment
router.post('/:id', [
    body('text').isString().isLength({min: 3}).exists().withMessage("Text is required to be at least 3 characters long.").trim().escape(),
    body('id').isNumeric().not().isEmpty().withMessage("A comment id is required to update a comment.").trim().escape(),
    body('userId').isNumeric().not().isEmpty().withMessage("A user id is required to update a comment.").trim().escape()
], async (req, res) => {
    if(req.user.username.includes('demo')) {
        return res.status(403).json({ error: "You cannot create a comment as the demo user." })
    }
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const newComment = {
        text: req.body.text,
        updatedAt: new Date()
    }
    
    const sql = 'UPDATE comments SET ? WHERE ? AND ?';
    db.query(sql, [newComment, {id: req.params.id}, {user_id: req.user.id}], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
    
});


// Delete a comment
router.delete('/:id', authMiddleware, async (req, res) => {
    if(req.user.username.includes('demo')) {
        return res.status(403).json({ error: "You cannot delete a project as the demo user." })
    }
    // First delete project_users references
    let sql = 'DELETE FROM comments WHERE ? AND ?';
    db.query(sql, [{id: req.params.id}, {user_id: req.user.id}], (err, result) => {
        if(err) return res.status(400).json({ error: err.message });
        res.status(200).send();
    });
});

    
module.exports = router;