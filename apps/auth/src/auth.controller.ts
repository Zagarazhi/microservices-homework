import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import JwtAuthGuard from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './users/users.model';

@Controller('auth')
export class AuthController {
    // Конструктор класса AuthController, который принимает сервис аутентификации в качестве параметра
    constructor(private readonly authService: AuthService) {}

    // Декоратор, который использует стратегию LocalAuthGuard для аутентификации
    @UseGuards(LocalAuthGuard)
    // Декоратор, который определяет метод контроллера как POST-метод, который обрабатывает запрос на авторизацию
    @Post('login')
    // Асинхронный метод login, который принимает текущего пользователя и объект Response в качестве параметров
    async login(
        // Декоратор, который получает текущего пользователя из контекста запроса
        @CurrentUser() user: User,
        // Декоратор, который устанавливает объект Response для ответа клиенту
        @Res({ passthrough: true }) response: Response,
    ) {
        await this.authService.login(user, response);
        response.send(user);
    }

    // Декоратор, который использует стратегию LocalAuthGuard для аутентификации
    @UseGuards(JwtAuthGuard)
    @MessagePattern('validate_user')
    async validateUser(@CurrentUser() user: User) {
        return user;
    }
}