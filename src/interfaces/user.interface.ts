import { Optional } from 'sequelize';

interface UserAttributes {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    status: string;
    phoneNumber: string;
    resetToken?: string | null;
    expireToken?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export { UserAttributes, UserCreationAttributes };
