const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const emailLower = email.toLowerCase();

    // Validate role if provided
    if (role && !['user', 'partner'].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role (default to 'user' if not provided)
    const user = await User.create({
      name,
      email: emailLower,
      password: hashedPassword,
      role: role || 'user'
    });

    // const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.SECRET_EXPIRY });
    const token = jwt.sign(
  { id: user._id, role: user.role, partnerId: user.partnerId },
  process.env.JWT_SECRET
);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase();
    console.log('Login attempt for:', emailLower); // Debug log

    const user = await User.findOne({ email: emailLower });
    if (!user) {
      console.log('User not found:', emailLower); // Debug log
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', emailLower); // Debug log
      return res.status(400).json({ error: "Invalid credentials" });
    }

    console.log('Login successful for:', emailLower, 'Role:', user.role); // Debug log

    // const token = jwt.sign({ id: user._id, role: user.role, partnerId: user.partnerId }, process.env.JWT_SECRET, { expiresIn: process.env.SECRET_EXPIRY });
//     const token = jwt.sign(
//   { id: user._id, role: user.role, partnerId: user.partnerId },
//   process.env.JWT_SECRET
// );
    const token = jwt.sign(
  { id: user._id, role: user.role, partnerId: user.partnerId },
  process.env.JWT_SECRET
);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        partnerId: user.partnerId
      }
    });
  } catch (err) {
    console.error('Login error:', err); // Debug log
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Forgot Password - Generate reset token and send email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: "If an account exists with this email, you will receive a password reset link." });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token and expiry (1 hour from now)
    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with reset link - Async (don't block the response)
    const { sendPasswordResetEmail } = require('../utils/emailService');
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    sendPasswordResetEmail(user.email, user.name, resetUrl)
      .then(() => console.log("✅ Password reset email sent to:", user.email))
      .catch(emailError => console.error('Email sending failed:', emailError.message));

    res.json({ message: "If an account exists with this email, you will receive a password reset link." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset Password - Validate token and update password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token and not expired
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    console.log("✅ Password reset successful for:", user.email);
    res.json({ message: "Password reset successful. You can now login with your new password." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
