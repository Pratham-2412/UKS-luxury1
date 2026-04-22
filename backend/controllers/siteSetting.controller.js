const SiteSetting = require("../models/SiteSetting.model");

const getSiteSettings = async (req, res, next) => {
  try {
    let setting = await SiteSetting.findOne();

    if (!setting) {
      setting = await SiteSetting.create({});
    }

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    next(error);
  }
};

const upsertSiteSettings = async (req, res, next) => {
  try {
    const updated = await SiteSetting.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    res.status(200).json({
      success: true,
      message: "Site settings saved successfully.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSiteSettings,
  upsertSiteSettings,
};
