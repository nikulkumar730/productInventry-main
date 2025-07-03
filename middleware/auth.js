// const jwt = require('jsonwebtoken');
// const { authMessages } = require('../utility/constant');

// const auth = (role)=>{
// return (req, res, next) => 
    
//     {
//     const tokenHeader = req.header('Authorization');  
//     if (!tokenHeader) {
//         return res.status(401).json({ message: authMessages.NO_TOKEN });
//     }
//     const token = tokenHeader.replace('Bearer ', '').trim();

//     if (!token) {
//         return res.status(401).json({ message: authMessages.INVALID_FORMAT });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; 

//            if (role) {
//                 if (decoded.role === role) {
//                     return next();
//                 } else {
//                     return res.status(403).json({ message: authMessages.UNAUTHORIZED });
//                 }
//             }

//             return next();
       
//     } catch (err) {
//         if (err.name === 'TokenExpiredError') {
//             return res.status(401).json({ message: authMessages.TOKEN_EXPIRED });
//         }
//         return res.status(401).json({ message: authMessages.INVALID_TOKEN });
//     }
// };
// }
// module.exports = { auth };
// // 

const jwt = require('jsonwebtoken');
const { handleResponse } = require('../utility/handleResponse');
const { authMessages } = require('../utility/constant');
const HttpStatus = require('http-status-codes');

const auth = (role) => {
  return (req, res, next) => {
    const tokenHeader = req.header('Authorization');

    if (!tokenHeader) {
      return handleResponse(
        res,
        HttpStatus.UNAUTHORIZED,
        'Error',
        authMessages.NO_TOKEN
      );
    }

    const token = tokenHeader.replace('Bearer ', '').trim();

    if (!token) {
      return handleResponse(
        res,
        HttpStatus.UNAUTHORIZED,
        'Error',
        authMessages.INVALID_FORMAT
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (role && decoded.role !== role) {
        return handleResponse(
          res,
          HttpStatus.FORBIDDEN,
          'Error',
          authMessages.UNAUTHORIZED
        );
      }

      return next();
    } catch (err) {
      const errorMsg =
        err.name === 'TokenExpiredError'
          ? authMessages.TOKEN_EXPIRED
          : authMessages.INVALID_TOKEN;

      return handleResponse(
        res,
        HttpStatus.UNAUTHORIZED,
        'Error',
        errorMsg,
        { error: err.message }
      );
    }
  };
};

module.exports = { auth };
