import { User } from '../../db/models';
import { Controller } from '../../interfaces';
import httpCode from '../../constants/http.constant';
import messageConstant from '../../constants/message.constant';
import { Status, roles } from '../../utils/enum';
import bcrypt from 'bcrypt';

const ITERATION = process.env.ITERATION;

export const createUser: Controller = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            userRoleId,
            phoneNumber,
        } = req.body;

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(httpCode.BAD_REQUEST).json({
                status: httpCode.BAD_REQUEST,
                message: messageConstant.USER_EXIST,
            });
        }

        // secure the password using bcrypt hashing algorithm
        const hashedPassword = await bcrypt.hash(password, Number(ITERATION));

        if (password.localeCompare(confirmPassword) != 0) {
            return res.status(httpCode.BAD_REQUEST).json({
                status: httpCode.BAD_REQUEST,
                message: messageConstant.PASSWORD_NOT_MATCH,
            });
        }

        const userRole = roles.find((r) => r.id === userRoleId);
        const roleId = userRole ? userRoleId : roles[1].id;
        const role = userRole ? userRole.name : roles[1].name;

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            roleId,
            role,
            status: Status.Active,
            phoneNumber,
        });

        if (!newUser) {
            return res.status(httpCode.BAD_REQUEST).json({
                status: httpCode.BAD_REQUEST,
                message: messageConstant.USER_CREATION_FAILED,
            });
        }

        return res.status(httpCode.OK).json({
            status: httpCode.OK,
            message: messageConstant.USER_CREATED,
            data: newUser,
        });
    } catch (error) {
        next(error);
    }
};
