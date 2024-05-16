import { Controller } from '../interfaces/index';
import httpCode from '../constants/http.constant';
import messageConstant from '../constants/message.constant';
import bcrypt from 'bcrypt';
import { User } from '../db/models';
import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET;
const EXPIRESIN = process.env.EXPIRESIN;

export const login: Controller = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({
            where: { email },
        });

        if (!existingUser) {
            return res.status(httpCode.UNAUTHORIZED).json({
                status: httpCode.UNAUTHORIZED,
                message: messageConstant.USER_NOT_EXIST,
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            existingUser.password,
        );

        if (isPasswordMatch) {
            const token = jwt.sign(
                {
                    id: existingUser.id,
                    email: existingUser.email,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    phoneNumber: existingUser.phoneNumber,
                },
                SECRET as string,
                {
                    expiresIn: EXPIRESIN,
                },
            );

            return res.json({
                status: httpCode.OK,
                message: messageConstant.SUCCESS,
                token,
            });
        } else {
            return res.status(httpCode.UNAUTHORIZED).json({
                status: httpCode.UNAUTHORIZED,
                message: messageConstant.WRONG_PASSWORD,
            });
        }
    } catch (error) {
        // throw error;
        next(error);
    }
};
