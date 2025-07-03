const {Messages} = require("../utility/constant");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { handleResponse } = require("../utility/handleResponse");
const HttpStatus = require("http-status-codes");
const { responseStatus } = require("../utility/constant");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return handleResponse(
        res,
        HttpStatus.NOT_FOUND,
        responseStatus.ERROR,
        `User ${Messages.ERROR.NOT_FOUND}`
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return handleResponse(
        res,
        HttpStatus.BAD_REQUEST,
        responseStatus.ERROR,
        Messages.ERROR.BAD_REQUEST
      );
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    handleResponse(
      res,
      HttpStatus.OK,
      responseStatus.SUCCESS,
      Messages.SUCCESS.LOGGED_IN,
      { token: token }
    );
  } catch (error) {
    console.error(Messages.ERROR.INTERNAL_SERVER, error);
    handleResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      responseStatus.ERROR,
      Messages.ERROR.INTERNAL_SERVER,
      { error: err.message }
    );
  }
};

module.exports = { login };
