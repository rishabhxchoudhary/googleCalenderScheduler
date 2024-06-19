import { calendar } from '../config/googleConfig.js';
import { getEmptySlots } from '../utils/timeUtils.js';
import { v4 as uuidv4 } from 'uuid';

export const listEvents = async (req, res) => {
    try {
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
    } catch (error) {
        console.error('Error listing events:', error);
        res.status(500).send("Internal Server Error");
    }
};

export const getEmptySlotsForNextWeek = async (req, res) => {
    try {
        if (!req.oauth2Client.credentials) {
            return res.status(401).send("Not authenticated");
        }
        const emptySlots = await getEmptySlots(req.oauth2Client);
        res.send(emptySlots);
    } catch (error) {
        console.error('Error getting empty slots:', error);
        res.status(500).send("Internal Server Error");
    }
};

export const scheduleEvent = async (req, res) => {
    try {
        if (!req.oauth2Client.credentials) {
            return res.status(401).send("Not authenticated");
        }

        const { summary, description, start, end } = req.body;

        const done = await calendar.events.insert({
            calendarId: 'primary',
            auth: req.oauth2Client,
            attendees: [
                { email: 'abc@gmail.com' } // list of attendees. Fix later..according to data coming from backend.
            ],
            conferenceData: {
                createRequest: {
                    requestId: uuidv4(),
                },
            },
            resource: {
                summary: summary,
                description: description,
                start: {
                    dateTime: start,
                    timeZone: 'Asia/Dubai',
                },
                end: {
                    dateTime: end,
                    timeZone: 'Asia/Dubai',
                },
            },
        });
        res.send(done);
    } catch (error) {
        console.error('Error scheduling event:', error);
        res.status(500).send("Internal Server Error");
    }
};