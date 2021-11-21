const User = require('../models/userSchema')
const sendMail = require('../helpers/sendMail')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const cloudinary = require('../helpers/cloudinary');
const House = require('../models/houseSchema');
const Report = require('../models/reportsSchema');
const Favorite = require('../models/favoritesSchema');
const Reservation = require('../models/reservationSchema')
const Chat = require('../models/chatSchema')
const Message = require('../models/messageSchema')

const dayjs = require('dayjs')
var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '1h' })
}


//Register without activation Account!
/*const registerController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.mapped() });
        } else {
            const { firstName, lastName, birthDate, gender, country, city, email, password, confirmedPassword, phone, image, role, isBlocked } = req.body;
            console.log("name", firstName)
            if (!firstName || !lastName || !birthDate || !gender || !email || !password || !confirmedPassword || !phone) {
                console.log("name", firstName)
                res.status(400).json({ message: "Please fill in all fields." })
            }
            const existUser = await User.findOne({ email });
            if (existUser) {
                res.status(400).json({ message: 'User already exists !' });
            }
            if (password.length < 8) {
                res.status(400).json({ message: "Password must have at least 8 characters." })
            }
            if (password !== confirmedPassword) {
                res.status(400).json({ message: "Passwords don't match !" });
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                const newUser = await User.create({ firstName, lastName, birthDate, gender, country, city, email, password: hashedPassword, phone, image, role, isBlocked })
                // const newUser = await User.create({ firstName, lastName, birthDate, gender, country, city, email, password: hashedPassword, phone, image: { imageURL: imageInfo.url, public_id: imageInfo.public_id }, role, isBlocked, rate })
                const token = jwt.sign(
                    { id: newUser._id },
                    process.env.SECRET_KEY,
                    { expiresIn: '2d' }
                );
                res.json({ user: newUser, token });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};*/

const registerController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.mapped() });
        } else {
            const { firstName, lastName, birthDate, gender, country, city, email, password, confirmedPassword, phone, image, role, isBlocked } = req.body;

            if (!firstName || !lastName || !birthDate || !gender || !phone || !email || !password || !confirmedPassword) {
                res.status(400).json({ message: "Please fill in all fields." })
            }

            const user = await User.findOne({ email })
            if (user) {
                res.status(400).json({ message: "This email already exists." })
            }

            if (password !== confirmedPassword) {
                res.status(400).json({ message: "Passwords don't match !" });
            }
            const existPhone = await User.findOne({ phone })
            if (existPhone) {
                res.status(400).json({ message: "This phone number already exists." });
            }
            const age = dayjs(Date.now()).diff(dayjs(birthDate), 'year')
            if (age < 18) {
                res.status(400).json({ message: "The minimum age must be 18 years" });
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                const newUser = {
                    firstName, lastName, birthDate, gender, email, password: hashedPassword, phone, image, role, isBlocked
                }

                const activation_token = createActivationToken(newUser)
                const url = `${process.env.CLIENT_URL}/user/activate/${activation_token}`
                sendMail(email, url, "Verify your email address")
                res.json({ user: newUser, token: activation_token, message: "Register Success! Please activate your account to start." })

            }
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const activateAccount = async (req, res) => {
    try {
        const activation_token = req.header('token');
        const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

        const { firstName, lastName, birthDate, gender, country, city, email, password, phone, image, role, isBlocked } = user

        const check = await User.findOne({ email })
        if (check) return res.status(400).json({ message: "This email already exists." })

        const newUser = new User({
            firstName, lastName, birthDate, gender, country, city, email, password, phone, image, role, isBlocked
        })

        await newUser.save()

        console.log("user", newUser);
        res.json({ user: newUser, token: activation_token, message: "Account has been activated!" })

    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "This email does not exist." })

        const token = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        const url = `${process.env.CLIENT_URL}/user/reset/${token}`

        sendMail(email, url, "Reset your password")
        res.json({ token, message: "Re-send the password, please check your email." })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { password, confirmedPassword } = req.body

        const passwordHash = await bcrypt.hash(password, 10)
        if (password !== confirmedPassword) {
            res.status(400).json({ message: "Passwords don't match !" });
        }
        const newUser = await User.findOneAndUpdate({ _id: req.personId }, { password: passwordHash }, { new: true })

        res.json({ user: newUser, message: "Password successfully changed!" })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
};

const loginController = async (req, res) => {
    try {

        const { email, password } = req.body;
        const existUser = await User.findOne({ email });
        if (!existUser) res.status(400).json({ message: "This user doesn't exist! You must register first." });
        const validatePassword = await bcrypt.compare(password, existUser.password);
        if (!validatePassword) res.status(400).json({ message: 'Wrong password ! \n Try again!' });

        const token = await jwt.sign(
            { id: existUser._id, email: existUser.email },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );
        res.json({ user: existUser, token });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { tokenId } = req.body;
        const response = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email_verified, email, family_name, given_name, picture } = response.payload;

        if (email_verified) {
            const existUser = await User.findOne({ email });
            if (!existUser) {
                const hashedPassword = await bcrypt.hash(email, 10)
                const newUser = await User.create({
                    firstName: given_name,
                    lastName: family_name,
                    birthDate: "1945-01-01",
                    gender: "Male",
                    email,
                    password: hashedPassword,
                    image: picture,
                    phone: '00000000'
                })

                const token = await jwt.sign(
                    { id: newUser._id },
                    process.env.SECRET_KEY,
                    { expiresIn: '1d' },
                );

                const url = `${email}`
                sendMail(email, url, "Get your password")

                res.status(200).json({ user: newUser, token });

            } else {
                const token = await jwt.sign(
                    { id: existUser._id },
                    process.env.SECRET_KEY,
                    { expiresIn: '1d' },
                );
                res.status(200).json({ user: existUser, token });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}


const updateUser = async (req, res) => {
    try {

        const user = await User.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
        // if (user) {
        //     user.firstName = req.body.firstName || user.firstName;
        //     user.lastName = req.body.lastName || user.lastName;
        //     user.birthDate = req.body.birthDate || user.birthDate;
        //     user.gender = req.body.gender || user.gender;
        //     user.country = req.body.country || user.country;
        //     user.city = req.body.city || user.city;
        //     user.email = req.body.email || user.email;
        //     user.phone = req.body.phone || user.phone;

        //     const updatedUser = await user.save();

        res.json({ user: user, message: "Info updated successfully" });
        // }
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.params.id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: 'Current password entered does not match' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        if (user) {
            user.password = hashedPassword || user.password;
            const passwordUpdated = await user.save();
            res.status(200).json({ user: passwordUpdated, message: 'Password changed successfully' });
        }
    } catch (err) {
        return res.status(500).json('Server Error');
    }
};

const updateUserImage = async (req, res) => {
    try {
        const imageInfo = await cloudinary.uploader.upload(req.file.path);
        const existUser = await User.findById(req.params.id);
        cloudinary.uploader.destroy(existUser.image.public_id);
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            image: { imageURL: imageInfo.url, public_id: imageInfo.public_id }
        }, { new: true }
        );
        res.json({ user: updatedUser, message: "Picture updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const getUserDetails = async (req, res) => {

    try {
        const user = await User.findById(req.personId)
        res.json({ user: user });

    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const deleteController = async (req, res) => {
    try {

        const result = await User.findOneAndDelete({ _id: req.params.id }).exec();
        if (result) {
            const deletedHouses = await House.deleteMany({ host: req.params.id }).exec();
            const deletedFavorites = await Favorite.deleteMany({ client: req.params.id }).exec();
            const deletedChats = await Chat.deleteMany({ members: req.params.id }).exec();
            const deletedMessages = await Message.deleteMany({ sender: req.params.id }).exec();
            const deletedReservations = await Reservation.deleteMany({ client: req.params.id }).exec();
        }
        res.status(200).json({ result, message: "User has been deleted succefully" });


    } catch (error) {
        res.status(500).json({ message: error });
    }

};

const displayAllController = async (req, res) => {

    try {
        const result = await User.find({});
        res.json(result);

    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const updateRole = async (req, res) => {
    try {
        updatedRole = await User.findByIdAndUpdate(req.params.id, { role: 'host' }, { new: true })
        res.status(200).json({ user: updatedRole, message: "The user's role has been edited succefully" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//admin
const banUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (user) {
            user.isBlocked = !user.isBlocked;
            const bannedUser = await user.save();
            res.status(200).json({ user: bannedUser, message: "user has been banned succefully" });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

module.exports = { registerController, activateAccount, loginController, googleLogin, forgotPassword, resetPassword, deleteController, displayAllController, updateUser, changePassword, updateUserImage, getUserDetails, updateRole, banUser }