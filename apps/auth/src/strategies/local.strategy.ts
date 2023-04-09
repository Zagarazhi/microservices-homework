import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    // Конструктор класса LocalStrategy, который принимает сервис пользователей в качестве параметра
    constructor(private readonly usersService: UsersService) {
        // Вызов конструктора родительского класса с опцией поля для имени пользователя
        super({ usernameField: 'email' });
    }

    // Асинхронный метод validate, который проверяет пользователя по email и паролю
    async validate(email: string, password: string) {
        return this.usersService.validateUser(email, password);
    }
}