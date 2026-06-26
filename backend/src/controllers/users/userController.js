const prisma = require('../../db');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;

    const alreadyExist = await prisma.user.findUnique({
      where: { email }
    })

    if (alreadyExist) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
        role: role
      },
      select: {
        userName: true,
        email: true,
        role: true,
      },
    });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(201).json({
      success: true,
      message: `user not create ${error.message}`,
    })
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        userName: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!users) {
      throw new Error("users not found");
    }

    return res.status(200).json({
      success: true,
      message: "getUser Successfully",
      data: users,
    })
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: `Error come fetch User: ${error.message}`,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (!id) { throw new Error("id is required"); }

    if (role !== "Admin") {
      throw new Error("You do not have access to delete account");
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      throw new Error("Account not found");
    }

    if (user.role === "Admin") {
      throw new Error("Admin account cannot be deleted");
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `fail delete Account: ${error.message}`,
    });
  }
};

exports.getUserbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (!id) {
      throw new Error("id not found");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id)
      }
    });
    if (!user) {
      throw new Error("user is not found");
    }
    return res.status(200).json({
      success: true,
      message: "getUser Successfully",
      data: user,
    })

  } catch (error) {
    return res.status(200).json({
      success: false,
      message: `fail fetch user: ${error.message}`,
    })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    const { userName, role: userRole } = req.body;

    if (role !== "Admin") {
      throw new Error("you do not have access to update user");
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const data = {};

    if (userName) data.userName = userName;
    if (role) data.role = userRole;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data,
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error update user",
    });
  }
};






