import mongoose from 'mongoose';

// ขยาย Schema ให้รองรับข้อมูลร้านค้ามากขึ้น
const settingSchema = mongoose.Schema({
  storeName: { type: String, default: 'ชื่อร้านค้าของคุณ' },
  storeAddress: { type: String, default: '' },
  storePhone: { type: String, default: '' },
  storeTaxId: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  // เพิ่มฟิลด์อื่นๆ ได้ตามต้องการ
});

const Setting = mongoose.model('Setting', settingSchema);

// สร้างข้อมูล settings เริ่มต้นถ้ายังไม่มี
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
