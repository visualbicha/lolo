import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';

export const firebaseService = {
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return await handleAuthResult(result);
    } catch (error) {
      console.error('Google auth error:', error);
      
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by the browser. Please allow popups and try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Authentication was cancelled.');
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized for authentication. Please use an authorized domain.');
      }
      
      throw error;
    }
  },

  loginWithEmail: async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return await handleAuthResult(result);
    } catch (error) {
      throw error;
    }
  },

  register: async (email, password, username) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: username });
      await handleAuthResult(result, { username });
      await sendEmailVerification(result.user);
      return result;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      throw error;
    }
  },

  resendVerificationEmail: async (user) => {
    try {
      await sendEmailVerification(user);
      return true;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

async function handleAuthResult(result, additionalData = {}) {
  if (!result) return null;

  const user = result.user;
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      username: user.displayName || additionalData.username || '',
      email: user.email,
      photoURL: user.photoURL || '',
      role: 'user',
      createdAt: serverTimestamp(),
      subscription: {
        type: 'free',
        status: 'active'
      },
      emailVerified: user.emailVerified,
      lastLogin: serverTimestamp(),
      ...additionalData
    });
  } else {
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
      emailVerified: user.emailVerified
    });
  }

  return {
    user: {
      ...user,
      ...(userDoc.exists() ? userDoc.data() : {})
    }
  };
}

export default firebaseService;