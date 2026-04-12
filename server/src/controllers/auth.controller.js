import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  const { email, password } = req.body;
  // Implement login logic here
  res.json({ message: "Login successful" });
};

export const signup = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    // Implement signup logic here
    if (!username || !name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        message: "Name must be at least 2 characters",
      });
    }
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) return res.json({ message: "User already exists" });

    if (password.length < 6)
      return res.json({ message: "Password must be at least 6 characters" });

    const hasshedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hasshedPassword,
      },
    });

    const userData = {...user, password: undefined}
    console.log("userData>>", userData);

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async () => {
  // Implement logout logic here
  res.json({ message: "Logout successful" });
};
