import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/users.model';
import { RmqModule } from '@app/common';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

// Генарация модуля
// nest generate module auth
@Module({
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET"),
                signOptions: {
                    expiresIn: `${configService.get("JWT_EXPIRATION")}s`,
                },
            }),
            inject: [ConfigService],
        }),
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                // Конфигурация БД
                dialect: 'postgres',
                host: configService.get("POSTGRES_AUTH_HOST"),
                port: Number(configService.get("POSTGRES_AUTH_PORT")),
                username: configService.get("POSTGRES_AUTH_USER"),
                password: configService.get("POSTGRES_AUTH_PASSWORD"),
                database: configService.get("POSTGRES_AUTH_DB"),
                models: [User],
                
                autoLoadModels: true,
            }),
            inject: [ConfigService],
        }),
        RmqModule,
        UsersModule,
    ],
})
export class AuthModule {}
