import jwt from "jsonwebtoken";
import admin from "../config/firebaseAdmin.js";
import User from "../models/User.model.js";

export const firebaseGoogleAuth = async (req, res) => {
    console.log("Firebase Google Auth Request Body:", req.body);
    console.log("Headers:", req.headers);
    const { idToken } = req.body;
    console.log("Received ID Token:", idToken);

    if (!idToken) {
        return res.status(400).json({ success: false, message: "No token provided" });
    }

    try {
        // 🔐 Verify Firebase token
        const decoded = await admin.auth().verifyIdToken(idToken);

        const { uid, email, name, picture } = decoded;

        let user = await User.findOne({ where: { email } });
        let isNewUser = false;

        if (!user) {
            isNewUser = true;
            user = new User({
                email,
                username: email.split("@")[0],
                avatar: picture,
                firebaseUid: uid,
                authProvider: "google",
            });
            await user.save();
        }

        // 🔑 Your own JWT
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        const isProd = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,                       // true only in prod
            sameSite: isProd ? "none" : "lax",    // 🔥 THIS IS THE FIX
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            success: true,
            jwt: token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
                isNewUser,
            },
        });

    } catch (err) {
        console.error("Firebase Google Auth Error:", err);
        res.status(401).json({ success: false, message: "Invalid Firebase token" });
    }
};