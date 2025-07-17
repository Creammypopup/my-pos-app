import asyncHandler from 'express-async-handler';
import Setting from '../models/Setting.js';

const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (settings) {
    res.json(settings);
  } else {
    const newSettings = await new Setting().save();
    res.status(201).json(newSettings);
  }
});

const updateSettings = asyncHandler(async (req, res) => {
  const { storeName, storeAddress, storePhone, storeTaxId, logoUrl } = req.body;
  
  let settings = await Setting.findOne();

  if (settings) {
    settings.storeName = storeName ?? settings.storeName;
    settings.storeAddress = storeAddress ?? settings.storeAddress;
    settings.storePhone = storePhone ?? settings.storePhone;
    settings.storeTaxId = storeTaxId ?? settings.storeTaxId; // <-- นำกลับมา
    settings.logoUrl = logoUrl ?? settings.logoUrl;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } else {
    const newSettings = await Setting.create({ storeName, storeAddress, storePhone, storeTaxId, logoUrl });
    res.status(201).json(newSettings);
  }
});

export { getSettings, updateSettings };