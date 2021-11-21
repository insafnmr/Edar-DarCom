const express = require('express');
const { body, check } = require('express-validator');
const { registerController, loginController, googleLogin, deleteController, changePassword, displayAllController, updateUser, updateUserImage, getUserDetails, updateRole, banUser, activateAccount, forgotPassword, resetPassword } = require('../controllers/userController');
const { autorisationMiddleware } = require('../middlewares/autorisationMiddleware');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const router = express.Router();
const cloudinary = require('../helpers/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Users Avatars',
    },
});

const upload = multer({ storage });

router.post('/register',
    body('email', 'Please input valid email').isEmail(),
    body('password', 'Please try to write a strong password with minimum 6 characters. \n It must contain at least one uppercase letter, one lowercase letter, one special character and numbers.').isStrongPassword().isLength({ min: 6 }),
    body('phone', 'Phone must have 8 numbers').isLength(8),
    registerController);

router.post('/activation', activateAccount);
router.post('/login', loginController);
router.post('/googlelogin', googleLogin);
router.post('/forgot', forgotPassword)
router.post('/reset', autorisationMiddleware, resetPassword)

router.put('/updateUser/:id', autorisationMiddleware, updateUser);
router.put('/updateRole/:id', autorisationMiddleware, updateRole);

router.put('/changePassword/:id', autorisationMiddleware,
    [
        check('newPassword', 'Please enter new password to change it').exists(),
        check('currentPassword', 'Please enter your current password').exists(),
        body('newPassword', 'please try to write a strong password with minimum 6 characters').isStrongPassword().isLength({ min: 6 }),
        body('currentPassword', 'please try to write a strong password with minimum 6 characters').isStrongPassword().isLength({ min: 6 }),

    ],
    changePassword);

router.put('/uploadimg/:id', upload.single('picture'), autorisationMiddleware, updateUserImage);
router.delete('/delete/:id', autorisationMiddleware, deleteController);
router.get('/displayall', autorisationMiddleware, displayAllController);
router.get('/getUser', autorisationMiddleware, getUserDetails);

//admin
router.put("/banuser/:id", autorisationMiddleware, banUser);


module.exports = router;