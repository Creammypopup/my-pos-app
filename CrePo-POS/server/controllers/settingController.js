import asyncHandler from 'express-async-handler';
import Setting from '../models/Setting.js';

const getSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.findOne();
  if (settings) {
    res.json(settings);
  } else {
    res.status(404);
    throw new Error('Settings not found');
  }
});

const updateSettings = asyncHandler(async (req, res) => {
  const { companyName, logo, address, phone, email, website, taxRate } =
    req.body;
  let settings = await Setting.findOne();
  if (settings) {
    settings.companyName = companyName || settings.companyName;
    settings.logo = logo || settings.logo;
    settings.address = address || settings.address;
    settings.phone = phone || settings.phone;
    settings.email = email || settings.email;
    settings.website = website || settings.website;
    settings.taxRate = taxRate === undefined ? settings.taxRate : taxRate;
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } else {
    settings = new Setting({
      companyName,
      logo,
      address,
      phone,
      email,
      website,
      taxRate,
    });
    const createdSettings = await settings.save();
    res.status(201).json(createdSettings);
  }
});

export { getSettings, updateSettings };
