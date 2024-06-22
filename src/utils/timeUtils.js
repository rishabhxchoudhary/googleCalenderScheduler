import dayjs from 'dayjs';
import { calendar } from '../config/googleConfig.js';

export const getEmptySlots = async (oauth2Client) => {
    const date = new Date();
    const emptySlots = {};
    const unavailableDates = [];
    const currentDate = dayjs(date).format('YYYY-MM-DD');
    const finalDate = dayjs(date).add(7, 'day').format('YYYY-MM-DD');

    const events = await calendar.events.list({
        auth: oauth2Client,
        calendarId: 'primary',
        timeMin: new Date(`${currentDate}T09:00:00+04:00`),
        timeMax: new Date(`${finalDate}T18:00:00+04:00`),
        singleEvents: true,
        orderBy: 'startTime'
    });
    for (let i = 0; i < 7; i++) {
        const currentDate = dayjs(date).add(i, 'day').format('YYYY-MM-DD');
        const currentDate2 = new Date(currentDate).getTime();
        const day = dayjs(date).add(i, 'day').format('dddd');
        if (day === 'Saturday' || day === 'Sunday') {
            unavailableDates.push(`${currentDate2}`);
            continue;
        }
        const busySlots = events.data.items.map(event => {
            return {
                start: event.start.dateTime,
                end: event.end.dateTime
            };
        });
        console.log(busySlots)
        const emptySlotsForDay = [];
        for (let j = 9; j < 18; j++) {
            const startHour = j;
            const endHour = j + 1;
            const start = new Date(`${currentDate}T${startHour}:00:00+04:00`);
            const end = new Date(`${currentDate}T${endHour}:00:00+04:00`);
            let isSlotFree = true;
            for (let k = 0; k < busySlots.length; k++) {
                const busyStart = new Date(busySlots[k].start);
                const busyEnd = new Date(busySlots[k].end);

                if (start >= busyStart && start < busyEnd) {
                    isSlotFree = false;
                    break;
                }
            }
            if (isSlotFree) {
                emptySlotsForDay.push({
                    id: `${currentDate2}-${startHour}`,
                    title: `${startHour}:00`
                });
            }
        }
        if (emptySlotsForDay.length === 0) {
            unavailableDates.push(`${currentDate2}`);
        } else {
            emptySlots[currentDate2] = emptySlotsForDay;
        }
    }
    emptySlots.unavailableDates = unavailableDates;
    return emptySlots;
};
