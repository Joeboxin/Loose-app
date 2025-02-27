import { useRouter } from 'next/router';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/backend/Firebase'; // Import your Firebase auth instance
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Context = createContext({
  user: undefined,
  setUser: () => {
    user = user.uid;
  }, // Prevents undefined errors
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in:', user);
  } else {
    console.log('User is signed out');
  }
}
);
export const StateContextProvider = (props) => {
  const { children } = props || {}; // ✅ Prevent undefined destructure
  const [user, setUser] = useState(undefined);
  const router = useRouter();

    // AUTHENTICATION REMEMBER ME USEEFFECT
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user){
        console.log('Token or user state changed:', user)
        user.getIdToken().then((token) => {
          console.log('New ID token:', token)
          console.log('User:', user)
        })
        setUser(user)
      } else {
        setUser(null) //there is no user signed in
      }
    });
    return () => unsubscribe();
  }, []);


  return (
    <Context.Provider value={{ user, setUser }}>
      {children || null} {/* Avoid rendering undefined */}
    </Context.Provider>
  );
};


export const useStateContext = () => {
    const context = useContext(Context);
    if (!context) {
      throw new Error('useStateContext must be used within a StateContextProvider');
    }
    return context;
};