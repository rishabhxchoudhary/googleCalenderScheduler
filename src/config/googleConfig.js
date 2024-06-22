import { google } from 'googleapis';

let calendar;
let oauth2Client;

try {
    calendar = google.calendar({ 
        version: "v3",
        auth: process.env.GOOGLE_CALENDAR_API_KEY
    });
} catch (error) {
    console.error('Error initializing Google Calendar:', error);
}

console.log("Redirect URI", process.env.REDIRECT_URI)
try {
    oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );
} catch (error) {
    console.error('Error initializing OAuth2 Client:', error);
}

const scopes = [
    // 'https://www.googleapis.com/auth/blogger',
    'https://www.googleapis.com/auth/calendar'
];

export { calendar, oauth2Client, scopes };
