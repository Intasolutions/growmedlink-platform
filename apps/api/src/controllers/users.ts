import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { UserCreateSchema, UserUpdateSchema } from '@intelligen/utils';
import { ROLES } from '@intelligen/constants';

export const listUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password') // Strip passwords
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List Users Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Get User Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const validatedData = UserCreateSchema.parse(req.body);

    // RBAC: Standard ADMIN cannot create SUPER_ADMIN
    if (req.user?.role !== ROLES.SUPER_ADMIN && validatedData.role === ROLES.SUPER_ADMIN) {
      return res.status(403).json({ success: false, message: 'Only Super Admins can create Super Admin accounts.' });
    }

    const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already in use.' });
    }

    const newUser = await User.create(validatedData);
    const userWithoutPassword = await User.findById(newUser._id).select('-password');

    return res.status(201).json({ success: true, data: userWithoutPassword });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
    }
    console.error('Create User Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const validatedData = UserUpdateSchema.parse(req.body);

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // RBAC: Standard ADMIN cannot modify SUPER_ADMIN
    if (req.user?.role !== ROLES.SUPER_ADMIN && targetUser.role === ROLES.SUPER_ADMIN) {
      return res.status(403).json({ success: false, message: 'You do not have permission to modify a Super Admin account.' });
    }

    // RBAC: Standard ADMIN cannot upgrade a user to SUPER_ADMIN
    if (req.user?.role !== ROLES.SUPER_ADMIN && validatedData.role === ROLES.SUPER_ADMIN) {
      return res.status(403).json({ success: false, message: 'Only Super Admins can assign the Super Admin role.' });
    }

    // Check email uniqueness if email is being updated
    if (validatedData.email && validatedData.email.toLowerCase() !== targetUser.email) {
      const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email is already in use.' });
      }
      targetUser.email = validatedData.email.toLowerCase();
    }

    if (validatedData.name) targetUser.name = validatedData.name;
    if (validatedData.role) targetUser.role = validatedData.role as typeof ROLES[keyof typeof ROLES];
    if (validatedData.password) targetUser.password = validatedData.password; // Triggers pre-save hook

    await targetUser.save();

    const updatedUser = await User.findById(targetUser._id).select('-password');
    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
    }
    console.error('Update User Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent self deletion
    if (targetUser._id.toString() === req.user?._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    // Prevent standard Admin from deleting Super Admin
    if (req.user?.role !== ROLES.SUPER_ADMIN && targetUser.role === ROLES.SUPER_ADMIN) {
      return res.status(403).json({ success: false, message: 'You do not have permission to delete a Super Admin.' });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete User Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
