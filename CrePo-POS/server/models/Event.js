import mongoose from 'mongoose';

const recurringSchema = new mongoose.Schema({
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true,
  },
  // For monthly/yearly, the day of the month (1-31)
  // For weekly, the day of the week (0-6, Sunday-Saturday)
  day: { 
    type: Number 
  }, 
}, { _id: false });

const eventSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  allDay: {
    type: Boolean,
    default: false,
  },
  recurring: {
    type: recurringSchema,
    required: false,
  }
}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
