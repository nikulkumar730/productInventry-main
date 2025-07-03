const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { handleResponse } = require("../utility/handleResponse");
const {
  Messages,
  Roles,
  responseStatus,
  validationMessage,
} = require("../utility/constant");
const { userRegistrationValidation } = require("../validations/validate");
const HttpStatus = require("http-status-codes");

const registerUser = async (req, res) => {
  const { error } = userRegistrationValidation.validate(req.body);
  try {
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const saltRound = 10;
    const Hasedpassword = await bcrypt.hash(password, saltRound);
    const newUser = new userModel({
      name,
      email,
      password: Hasedpassword,
    });
    const savedUser = await newUser.save();
    return handleResponse(
      res,
      HttpStatus.CREATED,
      responseStatus.SUCCESS,
      `User ${Messages.SUCCESS.REGISTER}`,
      {
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
        },
      }
    );
  } catch (err) {
    return handleResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      responseStatus.ERROR,
      Messages.ERROR.INTERNAL_SERVER,
      { error: err.message }
    );
  }
};

const getAllUser = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "name",
      sortOrder = "asc",
      search = "",
    } = req.body;

    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const searchFilter = {
      role: Roles.CUSTOMER,
      name: { $regex: search, $options: "i" },
    };

    const total = await userModel.countDocuments(searchFilter);

    const allUser = await userModel
      .find(searchFilter, "name email")
      .sort({ [sortBy]: sortDirection })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    if (allUser.length === 0) {
      return handleResponse(
        res,
        HttpStatus.NOT_FOUND,
        responseStatus.ERROR,
        `List data ${Messages.ERROR.NOT_FOUND}`
      );
    }

    return handleResponse(
      res,
      HttpStatus.OK,
      responseStatus.SUCCESS,
      `Users ${Messages.SUCCESS.FETCHED}`,
      {
        users: allUser,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
      }
    );
  } catch (err) {
    return handleResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      responseStatus.ERROR,
      Messages.ERROR.INTERNAL_SERVER,
      { error: err.message }
    );
  }
};

const userProfileView = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return handleResponse(
        res,
        HttpStatus.NOT_FOUND,
        responseStatus.ERROR,
        `User ${Messages.ERROR.NOT_FOUND}`
      );
    }
    return handleResponse(
      res,
      HttpStatus.OK,
      responseStatus.SUCCESS,
      `user ${Messages.SUCCESS.FETCHED}`,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      }
    );
  } catch (err) {
    return handleResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      responseStatus.ERROR,
      Messages.ERROR.INTERNAL_SERVER,
      { error: err.message }
    );
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!id) {
      return handleResponse(
        res,
        HttpStatus.BAD_REQUEST,
        responseStatus.ERROR,
        `User ${validationMessage.ID_REQUIRED}`
      );
    }
    if (!name) {
      return handleResponse(
        res,
        HttpStatus.BAD_REQUEST,
        responseStatus.ERROR,
        `name ${validationMessage.FIELD_REQUIRED}`
      );
    }
    const user = await userModel.findById(id);
    if (name) user.name = name;
    const updatedUser = await user.save();
    return handleResponse(
      res,
      HttpStatus.OK,
      responseStatus.SUCCESS,
      `User ${Messages.SUCCESS.UPDATED}`,
      {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
        },
      }
    );
  } catch (err) {
    return handleResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      responseStatus.ERROR,
      Messages.ERROR.INTERNAL_SERVER,
      { error: err.message }
    );
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await userModel.findOneAndDelete(id);
    return handleResponse(
      res,
      HttpStatus.OK,
      responseStatus.SUCCESS,
      `User ${Messages.SUCCESS.DELETED}`,
      {
        data: deletedData,
      }
    );
  } catch (err) {
    return handleResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      responseStatus.ERROR,
      Messages.ERROR.INTERNAL_SERVER,
      { error: err.message }
    );
  }
};

module.exports = {
  registerUser,
  editUser,
  getAllUser,
  deleteUser,
  userProfileView,
};
