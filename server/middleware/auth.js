// Redirects users who aren't logged in
const authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).send("User is not authorized to visit this endpoint.");
    } else {
        return next();
    }
}

module.exports = {
    authMiddleware
}