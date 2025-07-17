import mongoose from 'mongoose';

const settingSchema = mongoose.Schema({
  storeName: { type: String, default: 'ชื่อร้านค้าของคุณ' },
  storeAddress: { type: String, default: '' },
  storePhone: { type: String, default: '' },
  storeTaxId: { type: String, default: '' }, // <-- นำกลับมา
  logoUrl: { type: String, default: '' },
});

const Setting = mongoose.model('Setting', settingSchema);

const createDefaultSettings = async () => {
  try {
    const count = await Setting.countDocuments();
    if (count === 0) {
      console.log('No settings found, creating default settings...');
      await new Setting().save();
    }
  } catch (error) {
    console.error('Error creating default settings:', error);
  }
};

createDefaultSettings();

export default Setting;