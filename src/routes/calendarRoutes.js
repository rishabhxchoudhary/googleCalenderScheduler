import express from 'express';
import { listEvents, getEmptySlotsForNextDay, scheduleEvent } from '../controllers/calendarController.js';

const router = express.Router();

router.get("/events", listEvents);
router.get("/empty_slots", getEmptySlotsForNextDay);
router.get("/schedule_event", scheduleEvent);

export default router;