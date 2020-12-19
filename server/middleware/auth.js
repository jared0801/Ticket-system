// Redirects users who aren't logged in
const authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        return next()
    }
}

module.exports = {
    authMiddleware
}