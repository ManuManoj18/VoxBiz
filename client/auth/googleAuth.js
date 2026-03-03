import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    return {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      provider: user.providerData[0].providerId,
    };
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};