import { Injectable, UnprocessableEntityException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import * as bcrypt from "bcrypt";

// Генарация сервиса
// nest generate service users
@Injectable()
export class UsersService {

    // Инъекция зависимостей
    // Объекты создает сам Нест
    constructor(@InjectModel(User) private userRepository: typeof User) {}

    // Создание пользователя с использованием DTO
    async createUser(dto: CreateUserDto) {
        await this.validateCreateUser(dto);
        const user = await this.userRepository.create({
            ...dto,
            password: await bcrypt.hash(dto.password, 10),
        });
        return user;
    }

    // Валидация при создании
    private async validateCreateUser(dto: CreateUserDto) {
        let user: User;
        try {
            user = await this.userRepository.findOne({
                where: {email: dto.email}
            })
        } catch (err) {}

        if(user) {
            throw new UnprocessableEntityException("Почта уже используется");
        }
    }

    // Валидация при входе
    async validateUser(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: {email}
        });
        if(!user){
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        }
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if(!passwordIsValid) {
            throw new HttpException('Неверный пароль', HttpStatus.FORBIDDEN);
        }
        return user;
    }

    // Получение пользователя
    async getUserById(userId: string) {
        const user = await this.userRepository.findByPk(userId);
        if (user) return user;
        return null;
    }
}
