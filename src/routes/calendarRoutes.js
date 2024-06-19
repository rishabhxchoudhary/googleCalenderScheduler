import express from 'express';
import { listEvents, scheduleEvent, getEmptySlotsForNextWeek } from '../controllers/calendarController.js';

const router = express.Router();

router.get("/events",listEvents);
router.get("/empty_slots", getEmptySlotsForNextWeek);
router.get("/schedule_event",scheduleEvent);

export default router;