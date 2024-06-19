import express from 'express'
import bodyParser from 'body-parser'
import { google } from 'googleapis'
import dayjs from 'dayjs'
// import { v4 as uuid } from 'uuid'
import 'dotenv/config'

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const PORT = process.env.PORT || 8000

const calendar = google.calendar({ 
    version: "v3",
    auth: process.env.GOOGLE_CALENDAR_API_KEY
});

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
)

const scopes = [
    'https://www.googleapis.com/auth/blogger',
    'https://www.googleapis.com/auth/calendar'
  ];

app.get("/google" , (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
      });
    res.redirect(url)
})

app.get('/google/redirect', async (req, res) => {
    let code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code)
    console.log(tokens)
    oauth2Client.setCredentials(tokens);

    res.send({
        msg: "You have successfully authenticated",
    })
})

app.get("/events", async (req, res) => {
    if (oauth2Client.credentials == null) {
        return res.status(401).send("Not authenticated");
    }

    calendar.events.list({
        calendarId: 'primary',
        auth: oauth2Client,
        timeMin: (new Date()).toISOString(),
        maxResults: 100000,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, response) => {
        if (err) {
            return res.status(500).send("Error fetching events");
        }
        const events = response.data.items;
        res.send(events);
    });
})

app.get("/schedule_event", async (req,res) => {
    if (oauth2Client.credentials == null) {
        return res.status(401).send("Not authenticated");
    }

    const done = await calendar.events.insert({
        calendarId: 'primary',
        auth: oauth2Client,
        resource: {
            summary: 'Test Event',
            description: 'This is a test event',
            start: {
                dateTime: dayjs(new Date()).add(1,"day").toISOString(),
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: dayjs(new Date()).add(1,"day").add(1,"hour").toISOString(),
                timeZone: 'Asia/Kolkata',
            },
        },
        
    });
    res.send(done)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});