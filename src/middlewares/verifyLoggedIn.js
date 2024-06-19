const verifyLoggedIn = (req, res, next) => {
    if (req.oauth2Client && req.oauth2Client.credentials && req.oauth2Client.credentials.access_token) {
        next();
    } else {
        res.status(401).send("Not authenticated. Go to /google first");
    }
};

export default verifyLoggedIn;
