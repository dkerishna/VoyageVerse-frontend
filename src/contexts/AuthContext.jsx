import { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            setLoading(false);

            // 🔐 Save token if user exists (e.g., on refresh)
            if (user) {
                const token = await user.getIdToken();
                localStorage.setItem('token', token);
            } else {
                localStorage.removeItem('token');
            }
        });

        return unsubscribe;
    }, []);

    const signup = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('token', token); // ✅ Save token
        return userCredential;
    };

    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        //console.log("Firebase Id Token:", token); // 🔐 Log token for debugging
        localStorage.setItem('token', token); // ✅ Save token
        return userCredential;
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('token'); // ✅ Clear token on logout
    };

    const value = { currentUser, signup, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;