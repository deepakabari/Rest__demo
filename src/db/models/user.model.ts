import { DataTypes } from 'sequelize';
import { Table, Column, Model } from 'sequelize-typescript';

@Table({
    timestamps: true,
    paranoid: true,
})
class User extends Model {
    @Column({
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
    })
    firstName: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
    })
    lastName: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
    })
    status: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
    })
    phoneNumber: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: true,
    })
    resetToken: string;

    @Column({
        type: DataTypes.DATE,
        allowNull: true,
    })
    expireToken: string;
}

export default User;