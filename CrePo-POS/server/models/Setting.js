import mongoose from 'mongoose';
const settingSchema = mongoose.Schema({
  companyName: { type: String, default: 'CrePo-POS' },
  language: { type: String, default: 'th' },
  theme: {
    primaryColor: { type: String, default: '#A78BFA' },
    secondaryColor: { type: String, default: '#C4B5FD' },
  },
});
const Setting = mongoose.model('Setting', settingSchema);
export default Setting;