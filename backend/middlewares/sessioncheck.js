const sessionCheckMiddleware = (req, res, next) => {
    if (!req.session || !req.session._id) {
        console.log("No session Login first")
        return res.redirect('/login');
    }
    next();
};

export default sessionCheckMiddleware;