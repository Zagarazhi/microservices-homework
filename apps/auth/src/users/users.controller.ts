import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

// Генарация контроллера
// nest generate controller users
@Controller('auth/users')
export class UsersController {

    // Инъекция зависимости
    constructor(private usersService: UsersService) {}

    //Эндпоинты

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }
}
