import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Profile } from './profile.model';
import { AuthModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

describe('ProfileController', () => {
    let controller: ProfileController;
    let service: ProfileService;

    /*
    * В блоке beforeEach происходит создание тестового модуля, 
    * который импортирует ConfigModule, SequelizeModule для работы с базой данных,
    * AuthModule для аутентификации пользователей, ProfileController 
    * и ProfileService для обработки запросов и доступа к данным в базе.
    */
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: ".env"
                }),
                SequelizeModule.forFeature([Profile]),
                SequelizeModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: (configService: ConfigService) => ({
                        // Конфигурация БД
                        dialect: 'postgres',
                        host: configService.get("POSTGRES_PROFILE_HOST"),
                        port: Number(configService.get("POSTGRES_PROFILE_PORT")),
                        username: configService.get("POSTGRES_PROFILE_USER"),
                        password: configService.get("POSTGRES_PROFILE_PASSWORD"),
                        database: configService.get("POSTGRES_PROFILE_DB"),
                        models: [Profile],
                        
                        autoLoadModels: true,
                    }),
                    inject: [ConfigService],
                }),
                AuthModule,
            ],
            controllers: [ProfileController],
            providers: [ProfileService],
        }).compile();

        controller = module.get<ProfileController>(ProfileController);
        service = module.get<ProfileService>(ProfileService);
    });

    // Первый тест проверяет, что ProfileController определен.
    it('Должен быть опредлен', () => {
        expect(controller).toBeDefined();
    });

    // Тест проверяет, что метод create создает профиль
    it('Должен создать профиль', async () => {
        const dto = { firstName: 'John', lastName: 'Doe', phone: '+79376529907' };
        const id = 1;
        const expectedResult = { id: 1, ...dto, userId: id } as Profile;
        jest.spyOn(service, 'createProfile').mockResolvedValue(expectedResult);

        const req = { user: { id } };
        const result = await controller.create(dto, req);

        expect(result).toEqual(expectedResult);
        expect(service.createProfile).toHaveBeenCalledWith(dto, id);
    });

    // Тест, который проверяет, что метод get получает профиль
    it('Должен получить профиль', async () => {
        const id = 1;
        const expectedResult = { id, firstName: 'John', lastName: 'Doe', phone: '+79376529907', userId: id } as Profile;
        jest.spyOn(service, 'getProfile').mockResolvedValue(expectedResult);

        const req = { user: { id } };
        const result = await controller.get(req);

        expect(result).toEqual(expectedResult);
        expect(service.getProfile).toHaveBeenCalledWith(id);
    });

    // Тест, который проверяет, что метод delete удаляет профиль
    it('Должен удалить профиль', async () => {
        const id = 1;
        const expectedResult = 1;
        jest.spyOn(service, 'deleteProfile').mockResolvedValue(expectedResult);

        const req = { user: { id } };
        const result = await controller.delete(req);

        expect(result).toEqual(expectedResult);
        expect(service.deleteProfile).toHaveBeenCalledWith(id);
    });
});






