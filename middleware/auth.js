import jwt from "jsonwebtoken";

export const protectA = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next({ message: "No token provided", statusCode: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      decoded.role !== "admin" &&
      decoded.role !== "sub-admin"
    ) {
      return next({
        message: "Admins only",
        statusCode: 403
      });
    }

    req.user = decoded;

    next();

  } catch (err) {
    next({ message: "Invalid or expired token", statusCode: 401 });
  }
};


export const protectP = async (req, res, next) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next({
        message: "No token",
        statusCode: 401
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "patient") {
      return next({
        message: "Patients only",
        statusCode: 403
      });
    }

    req.user = decoded;

    next();

  } catch (error) {

    next({
      message: "Invalid token",
      statusCode: 401
    });
  }
};


export const allowRoles = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return next({
        message: "Access denied",
        statusCode: 403
      });
    }

    next();
  };
};