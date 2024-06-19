import dayjs from 'dayjs';
import { calendar } from '../config/googleConfig.js';

export const getEmptySlots = async (oauth2Client) => {
    const date = new Date();
    const startOfDay = dayjs(date).startOf('day').toISOString();
    const endOfDay = dayjs(date).endOf('day').toISOString();
    const events = await calendar.events.list({
        calendarId: 'primary',
        auth: oauth2Client,
        timeMin: startOfDay,
        timeMax: endOfDay,
        singleEvents: true,
        orderBy: 'startTime',
    });
    const busySlots = events.data.items.map(event => ({
        start: event.start.dateTime,
        end: event.end.dateTime,
    }));

    const emptySlots = [];
    let start = startOfDay;
    while (dayjs(start).isBefore(endOfDay)) {
        const end = dayjs(start).add(1, 'hour').toISOString();
        const isSlotFree = busySlots.every(busySlot => 
            dayjs(busySlot.start).isAfter(end) || dayjs(busySlot.end).isBefore(start)
        );
        if (isSlotFree) {
            emptySlots.push({ start, end });
        }
        start = end;
    }
    return emptySlots;
};
