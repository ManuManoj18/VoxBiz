import express from "express";
import { register, login , sendResetCode , verifyCode , resetPassword,logout , me} from "../controllers/Auth.controller.js";
import { firebaseGoogleAuth } from "../controllers/FirebaseGoogleAuth.controller.js";


const router = express.Router();
// router.get("/me", (req, res) => {
//   res.json({ ok: true });
// });
router.get('/me', me);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout)
router.post("/send-reset-code", sendResetCode);
router.post("/verify", verifyCode);
router.post("/reset-password", resetPassword);
router.post("/google/firebase", firebaseGoogleAuth);


export default router;