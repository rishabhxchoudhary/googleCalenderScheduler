import dayjs from 'dayjs';
import { calendar } from '../config/googleConfig.js';
import { getEmptySlots } from '../utils/timeUtils.js';

export const listEvents = async (req, res) => {
    if (!req.oauth2Client.credentials) {
        return res.status(401).send("Not authenticated");
    }

    calendar.events.list({
        calendarId: 'primary',
        auth: req.oauth2Client,
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
};

export const getEmptySlotsForNextDay = async (req, res) => {
    if (!req.oauth2Client.credentials) {
        return res.status(401).send("Not authenticated");
    }

    const emptySlots = await getEmptySlots(req.oauth2Client);
    return res.send(emptySlots);
};

export const scheduleEvent = async (req, res) => {
    if (!req.oauth2Client.credentials) {
        return res.status(401).send("Not authenticated");
    }

    const done = await calendar.events.insert({
        calendarId: 'primary',
        auth: req.oauth2Client,
        resource: {
            summary: 'Test Event',
            description: 'This is a test event',
            start: {
                dateTime: dayjs(new Date()).add(1, "day").toISOString(),
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: dayjs(new Date()).add(1, "day").add(1, "hour").toISOString(),
                timeZone: 'Asia/Kolkata',
            },
        },
    });
    res.send(done);
};
