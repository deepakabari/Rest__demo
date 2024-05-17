import { Controller } from '../../interfaces';
import httpCode from '../../constants/http.constant';
import messageConstant from '../../constants/message.constant';
import { Book } from '../../db/models';
import { Order } from 'sequelize';

// Controller that retrieves all the books of all creator
export const getAllBooks: Controller = async (req, res, next) => {
    try {
        // Extract query parameters
        const { sortBy, orderBy, page, pageSize } = req.query;

        // Calculate pagination parameters
        const pageNumber = parseInt(page as string, 10) || 1;
        const limit = parseInt(pageSize as string, 10) || 10;
        const offset = (pageNumber - 1) * limit;

        // Define sorting order based on query parameters
        const order = sortBy && orderBy ? ([[sortBy, orderBy]] as Order) : [];

        const getAllBooks = await Book.findAndCountAll({
            attributes: [
                'id',
                'name',
                'image',
                'description',
                'price',
                'categoryId',
            ],
            order,
            limit,
            offset,
        });

        // Return response with block history data
        return res.status(httpCode.OK).json({
            status: httpCode.OK,
            message: messageConstant.BOOK_RETRIEVED,
            data: getAllBooks,
        });
    } catch (error) {
        next(error);
    }
};

export const getBookById: Controller = async (req, res, next) => {
    try {
        const { id } = req.params;

        const getBookById = await Book.findOne({
            where: { id },
        });

        return res.status(httpCode.OK).json({
            status: httpCode.OK,
            message: messageConstant.BOOK_RETRIEVED,
            data: getBookById,
        });
    } catch (error) {
        next(error);
    }
};

export const getBooks: Controller = async (req, res, next) => {
    try {
        const id = req.user.id;

        const getBooks = await Book.findAll({
            where: { userId: id },
        });

        return res.status(httpCode.OK).json({
            status: httpCode.OK,
            message: messageConstant.BOOK_RETRIEVED,
            data: getBooks,
        });
    } catch (error) {
        next(error);
    }
};

export const createBook: Controller = async (req, res, next) => {
    try {
        // Destructuring the request body to get book details
        const { name, description, price, categoryId } = req.body;

        // Checking if the book already exists in the database
        const existingBook = await Book.findOne({ where: { name } });

        // If book exists, send a BAD_REQUEST response
        if (existingBook) {
            return res.status(httpCode.BAD_REQUEST).json({
                status: httpCode.BAD_REQUEST,
                message: messageConstant.BOOK_ALREADY_EXISTS,
            });
        }

        // If no file is uploaded, send a BAD_REQUEST response
        if (!req.file) {
            return res.status(httpCode.BAD_REQUEST).json({
                status: httpCode.BAD_REQUEST,
                message: messageConstant.FILE_NOT_UPLOADED,
            });
        }

        // Creating a new book entry with the provided details
        const newBook = await Book.create({
            userId: req.user.id,
            name,
            image: req.file.filename,
            description,
            price,
            categoryId,
        });

        // If book creation fails, send a BAD_REQUEST response
        if (!newBook) {
            return res.status(httpCode.BAD_REQUEST).json({
                status: httpCode.OK,
                message: messageConstant.BOOK_CREATION_FAILED,
            });
        }

        // If book is created successfully, send an OK response with the new book data
        return res.status(httpCode.OK).json({
            status: httpCode.OK,
            message: messageConstant.BOOK_CREATED,
            data: newBook,
        });
    } catch (error) {
        next(error);
    }
};

export const updateBook: Controller = async (req, res, next) => {
    try {
        // Getting the book ID from request parameters
        const { id } = req.params;

        // Destructuring the request body to get updated book details
        const { name, description, price, categoryId } = req.body;

        // Finding the book by its primary key (id)
        const existingBook = await Book.findByPk(id);

        // If book is not found, send a BAD_REQUEST response
        if (!existingBook) {
            return res.status(httpCode.NOT_FOUND).json({
                status: httpCode.NOT_FOUND,
                message: messageConstant.BOOK_NOT_FOUND,
            });
        }

        // Updating the book with new details
        await Book.update(
            {
                name,
                image: req.file?.path,
                description,
                price,
                categoryId,
            },
            { where: { id } },
        );

        // If update is successful, send an OK response
        return res.status(httpCode.OK).json({
            status: httpCode.OK,
            message: messageConstant.BOOK_UPDATED,
        });
    } catch (error: any) {
        // If a SequelizeUniqueConstraintError occurs, send a CONFLICT response
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(httpCode.CONFLICT).json({
                status: httpCode.CONFLICT,
                message: messageConstant.BOOK_NAME_UNIQUE,
            });
        }
        next(error);
    }
};

export const deleteBook: Controller = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Finding the book by its primary key (id)
        const existingBook = await Book.findByPk(id);

        // If book is not found, send a BAD_REQUEST response
        if (!existingBook) {
            return res.status(httpCode.NOT_FOUND).json({
                status: httpCode.NOT_FOUND,
                message: messageConstant.BOOK_NOT_FOUND,
            });
        }

        await Book.destroy({
            where: { id },
        });

        return res.status(httpCode.OK).json({
            status: httpCode.OK,
            message: messageConstant.BOOK_DELETED,
        });
    } catch (error) {
        next(error);
    }
};
