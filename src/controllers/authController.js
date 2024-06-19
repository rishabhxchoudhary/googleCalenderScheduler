import { oauth2Client, scopes } from '../config/googleConfig.js';

export const googleAuth = (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    res.redirect(url);
};

export const googleAuthRedirect = async (req, res) => {
    let code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    res.send({
        msg: "You have successfully authenticated",
    });
};
