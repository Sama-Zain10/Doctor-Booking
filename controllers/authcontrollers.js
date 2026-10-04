import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";



console.log("auth controller loaded");

export async function register(req, res, next) {
  try {
    let { username, password,role } = req.body;

    username =username.toLowerCase().trim();
    if (!username || !password || !role) {
      return next({ message: "Username, password and role are required", statusCode: 400 });
    }

    const exists = await Admin.findOne({ username });
    if (exists) {
      return next({ message: "Admin already exists", statusCode: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    // 4. Create the admin
    const admin = await Admin.create({
      username,
      password: hashed,
      role: role
    });

    res.status(201).json({ 
      success: true, 
      message: `${admin.role} created successfully`
    });

  } catch (err) {
    next(err);  
  }
}

export async function login(req, res, next) {
  try {
    let { username, password } = req.body;
        username =username.toLowerCase().trim();


    if (!username || !password) {
      return next({ message: "missing credentials", statusCode: 400 });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return next({ message: "invalid credentials", statusCode: 400 });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return next({ message: "invalid credentials", statusCode: 400 });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "9h" }
    );

    res.json({ success: true, 
      token, 
      role: admin.role });

  } catch (err) {
    next(err);
  }
}




