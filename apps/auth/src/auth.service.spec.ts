import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService, TokenPayload } from './auth.service';
import { Response } from 'express';
import { User } from './users/users.model';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

const mockConfigService = () => ({
    get: jest.fn().mockReturnValue(3600),
});

const mockJwtService = () => ({
    sign: jest.fn().mockReturnValue('fakeToken'),
});

/*
* В этом блоке создаются фейковые сервисы для ConfigService и JwtService с помощью jest.fn()
* и вызываются методы сервиса AuthService. 
* После этого используется функция expect для проверки правильности работы сервиса.
*/
describe('AuthService', () => {
    let authService: AuthService;
    let configService: ConfigService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: ConfigService, useFactory: mockConfigService },
                { provide: JwtService, useFactory: mockJwtService },
            ],
        }).compile();

        authService = moduleRef.get<AuthService>(AuthService);
        configService = moduleRef.get<ConfigService>(ConfigService);
        jwtService = moduleRef.get<JwtService>(JwtService);
    });

    describe('login', () => {
        it('Должен вернуть токен и установить куки', () => {
            const user = {
            id: 1,
            email: 'test@test.com',
            password: 'password',
            } as User;
            const response: Response = {
            cookie: jest.fn(),
            } as any;

            authService.login(user, response);

            expect(response.cookie).toHaveBeenCalledWith('Authentication', 'fakeToken', {
            httpOnly: true,
            expires: expect.any(Date),
            });
            expect(jwtService.sign).toHaveBeenCalledWith({ userId: '' + user.id });
            expect(configService.get).toHaveBeenCalledWith('JWT_EXPIRATION');
        });
    });

    describe('logout', () => {
        it('Очистка куки', () => {
            const response: Response = {
                cookie: jest.fn(),
            } as any;

            authService.logout(response);

            expect(response.cookie).toHaveBeenCalledWith('Authentication', '', {
            httpOnly: true,
            expires: expect.any(Date),
            });
        });
    });
});

/*
* В этом блоке создаются фейковые сервисы для AuthService и JwtService, 
* после чего вызываются методы сервиса AuthService и используется 
* функция expect для проверки правильности работы сервиса.
*/
describe('AuthService', () => {
    let authService: AuthService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ConfigModule],
            providers: [AuthService, JwtService],
        }).compile();

        authService = moduleRef.get<AuthService>(AuthService);
        jwtService = moduleRef.get<JwtService>(JwtService);
    });

    describe('login', () => {
    it('Должен создать токен и установить куки', async () => {
        const user = {
            id: 1,
            email: 'test@test.com',
            password: 'password',
            } as User;
        const mockToken = 'mockToken';

        jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

        const mockResponse = {
            cookie: jest.fn(),
        } as any;

        const expectedPayload: TokenPayload = { userId: '' + user.id };

        await authService.login(user, mockResponse);

        expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload);
        expect(mockResponse.cookie).toHaveBeenCalledWith('Authentication', mockToken, {
            httpOnly: true,
            expires: expect.any(Date),
            });
        });
    });

    describe('logout', () => {
        it('Должен очистить куки', async () => {
            const mockResponse = {
                cookie: jest.fn(),
            } as any;

            await authService.logout(mockResponse);

            expect(mockResponse.cookie).toHaveBeenCalledWith('Authentication', '', {
                httpOnly: true,
                expires: expect.any(Date),
            });
        });
    });
});

/*
* В этом блоке используется фреймворк Supertest для запуска приложения 
* и отправки HTTP-запросов на определенный маршрут. 
* После этого используется функция expect для проверки правильности работы сервиса.
*/ 
describe('AuthService (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let authService: AuthService;
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ConfigModule],
            providers: [AuthService, JwtService],
        }).compile();

        app = moduleRef.createNestApplication();
        authService = moduleRef.get<AuthService>(AuthService);
        jwtService = moduleRef.get<JwtService>(JwtService);
    });

    describe('POST /auth/login', () => {
        const endpoint = '/auth/login';
        let response: request.Response;

        it('Возвращает 404, если почта отсутсвует', async () => {
            response = await request(app.getHttpServer())
            .post(endpoint)
            .send({ email: 'test@test.com' })
            .expect(HttpStatus.NOT_FOUND);
        });
    });
});
