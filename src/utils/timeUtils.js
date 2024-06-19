import dayjs from 'dayjs';
import { calendar } from '../config/googleConfig.js';

export const getEmptySlots = async (oauth2Client) => {
    const date = new Date();
    const emptySlots = {};
    for (let i = 0; i < 7; i++) {
        const currentDate = dayjs(date).add(i, 'day').format('YYYY-MM-DD');
        const day = dayjs(date).add(i, 'day').format('dddd');
        if (day === 'Saturday' || day === 'Sunday') {
            continue;
        }
        const startTime = new Date(`${currentDate}T09:00:00+04:00`);
        const endTime = new Date(`${currentDate}T18:00:00+04:00`);

        const events = await calendar.events.list({
            auth: oauth2Client,
            calendarId: 'primary',
            timeMin: startTime.toISOString(),
            timeMax: endTime.toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
        });

        const busySlots = events.data.items.map(event => {
            return {
                start: event.start.dateTime,
                end: event.end.dateTime
            };
        });

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
                    start: `${startHour}:00`,
                    end: `${endHour}:00`
                });
            }
        }
        emptySlots[currentDate] = emptySlotsForDay;
    }

    return emptySlots;
};
