import asyncHandler from 'express-async-handler';
import Setting from '../models/Setting.js';

// @desc    Get settings
// @route   GET /api/settings
// @access  Private
const getSettings = asyncHandler(async (req, res) => {
  // ใช้ findOne() เพื่อให้แน่ใจว่ามี settings เพียงอันเดียว
  let settings = await Setting.findOne();
  if (settings) {
    res.json(settings);
  } else {
    // ถ้าไม่มี ให้สร้างใหม่แล้วส่งกลับไป
    const newSettings = await new Setting().save();
    res.status(201).json(newSettings);
  }
});

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private
const updateSettings = asyncHandler(async (req, res) => {
  const { storeName, storeAddress, storePhone, storeTaxId, logoUrl } = req.body;
  
  let settings = await Setting.findOne();

  if (settings) {
    settings.storeName = storeName ?? settings.storeName;
    settings.storeAddress = storeAddress ?? settings.storeAddress;
    settings.storePhone = storePhone ?? settings.storePhone;
    settings.storeTaxId = storeTaxId ?? settings.storeTaxId;
    settings.logoUrl = logoUrl ?? settings.logoUrl;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } else {
    // กรณีที่ไม่มี settings ในระบบเลย (ซึ่งไม่ควรเกิด แต่ป้องกันไว้)
    const newSettings = await Setting.create({ storeName, storeAddress, storePhone, storeTaxId, logoUrl });
    res.status(201).json(newSettings);
  }
});

export { getSettings, updateSettings };
