import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile } from './profile.model';
import { AuthModule, RmqModule } from '@app/common';

@Module({
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
        RmqModule,
        AuthModule,
    ],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
