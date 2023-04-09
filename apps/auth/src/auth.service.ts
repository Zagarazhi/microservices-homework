import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from './users/users.model';

export interface TokenPayload {
    userId: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    // Метод создает JWT-токен на основе объекта user, сохраняет его в куках и отправляет объект Response.
    async login(user: User, response: Response) {
        const tokenPayload: TokenPayload = {
            userId: user.id.toString(),
        };

        const expires = new Date();
        expires.setSeconds(
            expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
        );

        const token = this.jwtService.sign(tokenPayload);

        response.cookie('Authentication', token, {
            httpOnly: true,
            expires,
        });
    }
    
    //  Метод удаляет JWT-токен из куков и отправляет объект Response.
    logout(response: Response) {
        response.cookie('Authentication', '', {
            httpOnly: true,
            expires: new Date(),
        });
    }
}