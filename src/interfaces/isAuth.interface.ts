import { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export { CustomJwtPayload };
