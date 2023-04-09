import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '@app/common';

@Controller('profiles')
export class ProfileController {

    // Инъекция зависимости
    constructor(private profileService: ProfileService) {}

    // Эндпоинты

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateProfileDto, @Request() req: any) {
        const id = Number(req.user['id']);
        return this.profileService.createProfile(dto, id);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    get(@Request() req: any) {
        const id = Number(req.user['id']);
        return this.profileService.getProfile(id);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    update(@Body() dto: CreateProfileDto, @Request() req: any) {
        const id = Number(req.user['id']);
        return this.profileService.updateProfile(dto, id);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    delete(@Request() req: any) {
        const id = Number(req.user['id']);
        return this.profileService.deleteProfile(id);
    }
}
