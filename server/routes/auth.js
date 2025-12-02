// server/routes/auth.js
const express = require("express");
const router = express.Router();
const supabase = require("../lib/supabaseServer");

// helper: get user from Authorization header (Bearer <token>)
async function getUserFromReq(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
  if (!token) return { user: null, error: { message: 'No token provided' } };

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data || !data.user) {
      return { user: null, error: error || { message: 'Invalid token' } };
    }
    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: { message: 'Token verification failed' } };
  }
}

// Sign up - create a new user account
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signUpWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.message || "Signup failed" });
    }

    // Return user data and session
    res.status(201).json({
      message: "User created successfully",
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// Log in - authenticate existing user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ message: error.message || "Login failed" });
    }

    // Return user data and session
    res.status(200).json({
      message: "Login successful",
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Get current user - verify token and return user info
router.get("/me", async (req, res) => {
  const { user, error } = await getUserFromReq(req);

  if (error || !user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.status(200).json({
    message: "User retrieved successfully",
    user,
  });
});

// Log out - invalidate session (client should delete token)
router.post("/logout", async (req, res) => {
  try {
    // Note: Client is responsible for deleting the token
    // Server can optionally verify and invalidate the session
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error during logout" });
  }
});

module.exports = router;
