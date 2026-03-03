import { verifyToken } from "../jwt/AuthToken.js";

const AuthUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = verifyToken(token); // make sure this returns decoded token!
    // console.log("👤 Decoded user:", decoded);
    if (!decoded) {
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }

    req.user = decoded;
    next();
};

export default AuthUser;