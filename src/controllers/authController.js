import { oauth2Client, scopes } from '../config/googleConfig.js';

export const googleAuth = (req, res) => {
    try {
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        });
        res.redirect(url);
    } catch (error) {
        console.error('Error generating auth URL:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const googleAuthRedirect = async (req, res) => {
    try {
        let code = req.query.code;
        const { tokens } = await oauth2Client.getToken(code);
        console.log(tokens)
        oauth2Client.setCredentials(tokens);

        res.send({
            tokens
        });
    } catch (error) {
        console.error('Error during authentication redirect:', error);
        res.status(500).send('Internal Server Error');
    }
};
