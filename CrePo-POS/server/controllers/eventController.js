import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';
import sendNotification from '../services/notificationService.js'; // <-- เพิ่มการนำเข้า

// @desc    Fetch all events for a user
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ user: req.user._id });
  res.json(events);
});

// @desc    Create an event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
  const { title, start, end, allDay, notes } = req.body;

  if (!title || !start || !end) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const event = new Event({
    user: req.user._id,
    title,
    start,
    end,
    allDay,
    notes,
  });

  const createdEvent = await event.save();
  
  // --- ส่วนที่เพิ่มการแจ้งเตือน ---
  const startDate = new Date(start).toLocaleDateString('th-TH');
  const message = `📅 กิจกรรมใหม่: ${title} วันที่: ${startDate}`;
  sendNotification(message);
  // --- จบส่วนแจ้งเตือน ---

  res.status(201).json(createdEvent);
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  
  // --- ส่วนที่เพิ่มการแจ้งเตือน ---
  const startDate = new Date(updatedEvent.start).toLocaleDateString('th-TH');
  const message = `✨ อัปเดตกิจกรรม: ${updatedEvent.title} วันที่: ${startDate}`;
  sendNotification(message);
  // --- จบส่วนแจ้งเตือน ---

  res.json(updatedEvent);
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  
  const deletedTitle = event.title;
  await event.deleteOne();
  
  // --- ส่วนที่เพิ่มการแจ้งเตือน ---
  const message = `🗑️ ลบกิจกรรม: ${deletedTitle}`;
  sendNotification(message);
  // --- จบส่วนแจ้งเตือน ---

  res.json({ id: req.params.id });
});

export { getEvents, createEvent, updateEvent, deleteEvent };