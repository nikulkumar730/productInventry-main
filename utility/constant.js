const Messages = {
  ERROR: {
    NOT_FOUND: "not found",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Forbidden access",
    BAD_REQUEST: "Bad request",
    INTERNAL_SERVER: "Internal server error",
    VALIDATION_ERROR: "Validation error",
  },
  SUCCESS: {
    REGISTER: "registered successfully",
    CREATED: "created successfully",
    UPDATED: "updated successfully",
    DELETED: "deleted successfully",
    FETCHED: "fetched successfully",
    LOGGED_IN: "User successfully logged in",
  },
};

const Roles = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

const DB_Validate_Messages = {
  REQUIRED: "is required",
  MIN_LENGTH: "Minimum length is",
  MAX_LENGTH: "Maximum length is",
  UNIQUE: "must be unique",
  INVALID_EMAIL: "Invalid email format",
  INVALID_URL: "Invalid URL format",
  INVALID_NUMBER: "Invalid number format",
  VALID_PRICE_FORMAT: "Please enter a valid price format",
};

const Status = {
  PENDING: "pending",
  CONFIRM: "confirm",
};

const responseStatus = {
  SUCCESS: "Success",
  ERROR: "Error",
};

const validationMessage = {
  ID_REQUIRED: "ID is required",
  FIELD_REQUIRED: "field are required",
};

const authMessages = {
  NO_TOKEN: "No token provided",
  INVALID_FORMAT: "Invalid token format",
  UNAUTHORIZED: "Unauthorized access",
  TOKEN_EXPIRED: "Token has expired, please log in again",
  INVALID_TOKEN: "Invalid token",
};

module.exports = {
  Messages,
  Roles,
  DB_Validate_Messages,
  Status,
  responseStatus,
  validationMessage,
  authMessages,
};
