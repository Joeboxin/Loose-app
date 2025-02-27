import { auth } from "./Firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  fetchSignInMethodsForEmail,
  signOut 
} from "firebase/auth";

const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User signed up:', userCredential.user);
    return userCredential; // Return the userCredential
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
};

const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in:', userCredential.user);
    return userCredential; // Return the userCredential
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
};

const checkSignInMethods = async (email) => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods; // Returns an array (e.g., ['password'], ['google.com'], or [])
  } catch (error) {
    console.error('Error checking sign-in methods:', error.message);
    throw error;
  }
};

// Logout function
const logOut = async () => {
  try {
    await signOut(auth);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error.message);
    throw error;
  }
};

export { signUp, signIn, checkSignInMethods, logOut };
