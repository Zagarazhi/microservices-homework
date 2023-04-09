import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../auth.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            // Извлечение JWT из заголовка запроса
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) => {
                    return request?.Authentication;
                },
            ]),
            // Получение секретного ключа JWT из конфигурации
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    // Метод валидации
    async validate({ userId }: TokenPayload) {
        try {
            return await this.usersService.getUserById(userId);
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}