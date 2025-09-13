const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const { authenticate, authorizeRoles } = require("../auth/auth.middleware");
const upload = require("../auth/upload.middleware");
const {
  createUserValidation,
  updateUserValidation,
  updateProfileValidation,
  changePasswordValidation,
  idValidation,
  getUsersQueryValidation
} = require("./user.validation");

// Public routes (for profile management)
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, updateProfileValidation, userController.updateProfile);
router.put('/profile/avatar', authenticate, upload.single('avatar'), userController.updateAvatar);

// User management routes (requires authentication)
router.get('/', authenticate, getUsersQueryValidation, userController.getUsers);
router.get('/stats', authenticate, authorizeRoles('Admin'), userController.getUserStats);
router.get('/:id', authenticate, idValidation, userController.getUserById);

// Admin only routes
router.post('/', authenticate, authorizeRoles('Admin'), createUserValidation, userController.createUser);
router.put('/:id', authenticate, authorizeRoles('Admin'), idValidation, updateUserValidation, userController.updateUser);
router.delete('/:id', authenticate, authorizeRoles('Admin'), idValidation, userController.deleteUser);
router.patch('/:id/toggle-status', authenticate, authorizeRoles('Admin'), idValidation, userController.toggleUserStatus);
router.post('/:id/reset-password', authenticate, authorizeRoles('Admin'), idValidation, userController.resetPassword);

// Password change (own account or admin)
router.put('/:id/change-password', authenticate, idValidation, changePasswordValidation, userController.changePassword);

// Avatar upload (admin can upload for any user)
router.put('/:id/avatar', authenticate, authorizeRoles('Admin'), idValidation, upload.single('avatar'), userController.updateAvatar);

module.exports = router; 
