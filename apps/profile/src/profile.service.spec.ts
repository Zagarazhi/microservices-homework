import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateProfileDto } from './dto/create-profile.dto';

describe('ProfileService', () => {
    let service: ProfileService;

    beforeAll(async () => {
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
            ],
            providers: [ProfileService],
        }).compile();

        service = module.get<ProfileService>(ProfileService);
    });

    afterAll(async () => {
        const sequelize = Profile.sequelize;
        await sequelize.drop();
        await sequelize.close();
    });
    
    describe('createProfile', () => {
        it('Должен создать новый профиль', async () => {
            const dto: CreateProfileDto = { firstName: 'John', lastName: 'Doe', phone: '+79376529907' };
            const userId = 1;
            const profile = await service.createProfile(dto, userId);
            expect(profile).toMatchObject({ id: profile.id, userId, ...dto });
        });
    });

    describe('getProfile', () => {
        it('sДолжен вернуть профиль', async () => {
            const id = 1;
            const profile = { id, firstName: 'John', lastName: 'Doe', phone: '+79376529907' } as Profile;
            jest.spyOn(Profile, 'findByPk').mockResolvedValue(profile);

            const result = await service.getProfile(id);

            expect(result).toEqual(profile);
            expect(Profile.findByPk).toBeCalledWith(id);
        });
    });

    describe('createProfile', () => {
        it('Должен создать новый профиль', async () => {
            const result = await service.createProfile(
                { firstName: 'John', lastName: 'Doe', phone: '+79376529907' },
                1,
            );
            expect(result.id).toBeDefined();
            expect(result.firstName).toBe('John');
            expect(result.lastName).toBe('Doe');
            expect(result.phone).toBe('+79376529907');
            expect(result.userId).toBe(1);
        });
    });
});
