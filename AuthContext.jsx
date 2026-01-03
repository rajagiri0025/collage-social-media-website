import { createContext, useContext, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailConfig';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [pendingUser, setPendingUser] = useState(null);
    const [generatedOTP, setGeneratedOTP] = useState(null);
    const [loading, setLoading] = useState(false);

    // Generate 6-digit OTP
    const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Send OTP via EmailJS
    const sendOTP = async (email, name) => {
        setLoading(true);
        const otp = generateOTP();
        // const otp = '123456'; // Fixed OTP for testing
        setGeneratedOTP(otp);

        try {
            const templateParams = {
                to_email: email,
                to_name: name,
                otp: otp,
            };

            await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams,
                EMAILJS_CONFIG.PUBLIC_KEY
            );

            setLoading(false);
            return { success: true, message: 'OTP sent successfully!' };
        } catch (error) {
            setLoading(false);
            console.error('Failed to send OTP:', error);
            return { success: false, message: 'Failed to send OTP. Please check your EmailJS configuration.' };
        }
    };

    // Verify OTP
    const verifyOTP = (inputOTP) => {
        if (inputOTP === generatedOTP) {
            if (pendingUser) {
                // Registration flow
                const newUser = { ...pendingUser };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                setPendingUser(null);
                setGeneratedOTP(null);
                return { success: true, message: 'Account created successfully!' };
            } else {
                // Login flow - find user by email
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const existingUser = users.find(u => u.email === user?.email);
                if (existingUser) {
                    setUser(existingUser);
                    localStorage.setItem('user', JSON.stringify(existingUser));
                    setGeneratedOTP(null);
                    return { success: true, message: 'Login successful!' };
                }
            }
        }
        return { success: false, message: 'Invalid OTP. Please try again.' };
    };

    // Register new user
    const register = async (userData) => {
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(u => u.email === userData.email);

        if (existingUser) {
            return { success: false, message: 'User already exists with this email.' };
        }

        setPendingUser(userData);
        return await sendOTP(userData.email, userData.name);
    };

    // Login existing user
    const login = async (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(u => u.email === email);

        if (!existingUser) {
            return { success: false, message: 'No account found with this email.' };
        }

        if (existingUser.password !== password) {
            return { success: false, message: 'Incorrect password.' };
        }

        setUser(existingUser);
        localStorage.setItem('user', JSON.stringify(existingUser));
        return { success: true, message: 'Login successful!' };
    };

    // Logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Update Password
    const updatePassword = (currentPassword, newPassword) => {
        if (!user) {
            return { success: false, message: 'No user logged in.' };
        }

        // Verify current password
        if (user.password !== currentPassword) {
            return { success: false, message: 'Current password is incorrect.' };
        }

        // Update password in users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);

        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Update current user
        const updatedUser = { ...user, password: newPassword };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        return { success: true, message: 'Password updated successfully!' };
    };

    // Update Profile
    const updateProfile = (profileData) => {
        if (!user) {
            return { success: false, message: 'No user logged in.' };
        }

        // Update user in users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);

        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...profileData };
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Update current user
        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        return { success: true, message: 'Profile updated successfully!' };
    };

    // Create Post
    const createPost = (postData) => {
        if (!user) {
            return { success: false, message: 'No user logged in.' };
        }

        const newPost = {
            id: Date.now().toString(),
            ...postData,
            createdAt: Date.now()
        };

        // Update user posts
        const updatedPosts = [...(user.posts || []), newPost];
        const updatedUser = { ...user, posts: updatedPosts };

        // Update in users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Update current user
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        return { success: true, message: 'Post created successfully!' };
    };

    // Delete Post
    const deletePost = (postId) => {
        if (!user) {
            return { success: false, message: 'No user logged in.' };
        }

        // Filter out the post
        const updatedPosts = (user.posts || []).filter(p => p.id !== postId);
        const updatedUser = { ...user, posts: updatedPosts };

        // Update in users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Update current user
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        return { success: true, message: 'Post deleted successfully!' };
    };

    // Save user to users list after successful registration
    useEffect(() => {
        if (user && !pendingUser) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userExists = users.find(u => u.email === user.email);
            if (!userExists && user.name) {
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
    }, [user, pendingUser]);

    const value = {
        user,
        loading,
        register,
        login,
        verifyOTP,
        logout,
        updatePassword,
        updateProfile,
        createPost,
        deletePost,
        pendingUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
