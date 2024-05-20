import fs from 'fs';
import path from 'path';
import httpCode from '../../constants/http.constant';
import messageConstant from '../../constants/message.constant';
import axios from 'axios';
import json2xls from 'json2xls';
import { Controller } from '../../interfaces';

/**
 * @function
 * @param req
 * @param res
 * @param next
 * @returns
 * @description
 */
export const viewFile: Controller = async (req, res, next) => {
    try {
        // Extract file name from request parameters
        const { fileName } = req.params;

        // Construct file path
        const filePath = path.join(
            __dirname,
            '..',
            '..',
            'public',
            'images',
            fileName,
        );

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            // If file doesn't exist, return bad request response
            return res.status(httpCode.BAD_REQUEST).json({
                status: httpCode.BAD_REQUEST,
                message: messageConstant.FILE_NOT_FOUND,
            });
        } else {
            // If file exists, set response content type based on file extension
            res.type(path.extname(filePath));

            // Stream the file to the response
            fs.createReadStream(filePath).pipe(res);
        }
    } catch (error) {
        next(error);
    }
};

export const downloadFile: Controller = async (req, res, next) => {
    try {
        const { fileName } = req.params;

        // Construct file path
        const filePath = path.join(
            __dirname,
            '..',
            '..',
            'public',
            'images',
            fileName,
        );

        res.download(filePath, fileName, (err) => {
            if (err) {
                return res.status(httpCode.BAD_REQUEST).json({
                    status: httpCode.BAD_REQUEST,
                    message: messageConstant.ERROR_DOWNLOAD_FILE,
                });
            }
        });
    } catch (error) {
        next(error);
    }
};

export const exportBooks: Controller = async (req, res, next) => {
    try {
        const token = req.headers.authorization as string;

        let allData: any = [],
            page = 1,
            pageSize = 10,
            totalPages = 0;

        do {
            const response = await axios.get(
                `http://localhost:4000/book/getAllBooks?page=${page}&pageSize=${pageSize}`,
                {
                    headers: {
                        Authorization: token,
                    },
                },
            );
            const jsonData = response.data;
            totalPages = Math.ceil(jsonData.data.count / pageSize);

            allData = allData.concat(jsonData.data.rows);

            page++;
        } while (page <= totalPages);

        const xls = json2xls(allData);

        const filename = `All_Books_${Date.now()}.xlsx`;
        fs.writeFileSync(filename, xls, 'binary');

        res.download(filename, filename, () => {
            fs.unlinkSync(filename);
        });
    } catch (error) {
        next(error);
    }
};
