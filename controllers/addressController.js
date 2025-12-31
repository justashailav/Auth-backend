import { Address } from "../models/addressModel.js";

export const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      pincode,
      addressLine,
      city,
      state,
      landmark,
      isDefault = 0,
    } = req.body;
    if (isDefault === 1) {
      await Address.updateMany(
        { user: req.user._id },
        { $set: { isDefault: 0 } }
      );
    }

    const address = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      pincode,
      addressLine,
      city,
      state,
      landmark,
      isDefault,
    });

    const addresses = await Address.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const address = await Address.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    
    if (updates.isDefault === 1) {
      await Address.updateMany(
        { user: req.user._id },
        { $set: { isDefault: 0 } }
      );
    }

    Object.assign(address, updates);
    await address.save();

    const addresses = await Address.find({ user: req.user._id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

   
    if (address.isDefault === 1) {
      const latestAddress = await Address.findOne({
        user: req.user._id,
      }).sort({ createdAt: -1 });

      if (latestAddress) {
        latestAddress.isDefault = 1;
        await latestAddress.save();
      }
    }

    const addresses = await Address.find({ user: req.user._id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
