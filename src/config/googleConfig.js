import { google } from 'googleapis';

const calendar = google.calendar({ 
    version: "v3",
    auth: process.env.GOOGLE_CALENDAR_API_KEY
});

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

const scopes = [
    'https://www.googleapis.com/auth/blogger',
    'https://www.googleapis.com/auth/calendar'
];

export { calendar, oauth2Client, scopes };