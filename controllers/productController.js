const { default: mongoose } = require("mongoose");
const productModel = require("../models/products");
const {handleResponse} = require("../utility/handleResponse");
const HttpStatus = require("http-status-codes");
const { Messages } = require("../utility/constant");
const {responseStatus} = require("../utility/constant");

const addProduct = async (req, res) => {
  try {
    const { price, product_Name, quantity, categories } = req.body;

    const newProduct = new productModel({
      price,
      product_Name,
      quantity,
      categories,
    });

    const savedProduct = await newProduct.save();

    handleResponse(
      res,
      HttpStatus.CREATED,
      responseStatus.SUCCESS,
      `Product ${Messages.SUCCESS.CREATED}`,
      {
        id: savedProduct._id,
        product_Name: savedProduct.product_Name,
        price: savedProduct.price,
        quantity: savedProduct.quantity,
      }
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (e) => e.message
      );
      return handleResponse(
        res,
        HttpStatus.BAD_REQUEST,
        responseStatus.ERROR,
        Messages.ERROR.VALIDATION_ERROR,
        { errors: validationErrors }
      );
    }
   return handleResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      responseStatus.ERROR,
      Messages.ERROR.INTERNAL_SERVER,
      { error: error.message }
    );
  }
};

const listProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "product_Name",
      sortOrder = "asc",
      search = "",
      categories = [],
    } = req.body;

    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    const matchStage = {};

    if (search) {
      matchStage.product_Name = { $regex: search, $options: "i" };
    }

    if (categories.length > 0) {
      matchStage.categories = {
        $in: categories.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "category",
          localField: "categories",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $sort: {
          [sortBy]: sortDirection,
        },
      },
      {
        $facet: {
          pagination: [
            { $count: "total" },
            {
              $addFields: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: {
                  $ceil: {
                    $divide: ["$total", parseInt(limit)],
                  },
                },
              },
            },
          ],
          data: [
            { $skip: skip },
            { $limit: parseInt(limit) },
            {
              $project: {
                _id: 1,
                product_Name: 1,
                price: 1,
                quantity: 1,
                is_available: 1,
                categories: {
                  $map: {
                    input: "$categories",
                    as: "cat",
                    in: "$$cat.name",
                  },
                },
              },
            },
          ],
        },
      },
    ];

    const result = await productModel.aggregate(pipeline);

    const pagination = result[0].pagination[0] || {
      total: 0,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: 0,
    };

    if (result[0].data.length === 0) {
      return handleResponse(
        res,
        HttpStatus.NOT_FOUND,
        responseStatus.ERROR,
        `Product ${Messages.ERROR.NOT_FOUND}`
      );
    }

    return handleResponse(
      res,
      HttpStatus.OK,
      responseStatus.SUCCESS,
      `Product ${Messages.SUCCESS.FETCHED}`,
      {
        products: result[0].data,
        ...pagination,
      }
    );
  } catch (err) {
    handleResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      responseStatus.SUCCESS,
      Messages.ERROR.INTERNAL_SERVER,
      { error: err.message }
    );
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "category",
          localField: "categories",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $project: {
          _id: 1,
          product_Name: 1,
          price: 1,
          quantity: 1,
          is_available: 1,
          categories: {
            $map: {
              input: "$categories",
              as: "cat",
              in: "$$cat.name",
            },
          },
        },
      },
    ];

    const result = await productModel.aggregate(pipeline);

    if (!result) {
      return handleResponse(
        res,
        HttpStatus.NOT_FOUND,
        responseStatus.ERROR,
        `Product ${Messages.ERROR.NOT_FOUND}`
      );
    }

    handleResponse(
      res,
      HttpStatus.OK,
      responseStatus.SUCCESS,
      `Product ${Messages.SUCCESS.FETCHED}`,
      { product: result[0] }
    );
  } catch (err) {
    handleResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      responseStatus.ERROR,
      Messages.ERROR.INTERNAL_SERVER,
      { error: err.message }
    );
  }
};

const updateProduct = async (req, res) => {
  console.log(req.body);
  try {
    const updated = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return handleResponse(
        res,
        HttpStatus.NOT_FOUND,
        responseStatus.ERROR,
        `Product ${Messages.ERROR.NOT_FOUND}`
      );
    }

   return handleResponse(
      res,
      HttpStatus.OK,
      responseStatus.SUCCESS,
      `Product ${Messages.SUCCESS.UPDATED}`,
      { product: updated }
    );
  } catch (err) {
    if (err.name === "ValidationError") {
      const validationErrors = Object.values(err.errors).map((e) => e.message);
      return handleResponse(
        res,
        HttpStatus.BAD_REQUEST,
        responseStatus.ERROR,
        Messages.ERROR.VALIDATION_ERROR,
        { errors: validationErrors }
      );
    }

    handleResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      responseStatus.ERROR,
      Messages.ERROR.INTERNAL_SERVER,
      { error: err.message }
    );
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await productModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return handleResponse(
        res,
        HttpStatus.NOT_FOUND,
        responseStatus.ERROR,
        `Product ${Messages.ERROR.NOT_FOUND}`
      );
    }

    handleResponse(
      res,
      HttpStatus.OK,
      responseStatus.SUCCESS,
      `Product ${Messages.SUCCESS.DELETED}`
    );
  } catch (err) {
    handleResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      responseStatus.ERROR,
      Messages.ERROR.INTERNAL_SERVER,
      { error: err.message }
    );
  }
};

module.exports = {
  addProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
