import { IsString, IsPhoneNumber, IsNumber, IsOptional } from "class-validator";

// DTO-класс для создания профилей
export class CreateProfileDto {
    @IsString()
    firstName: string;
    @IsString()
    lastName: string;
    @IsString()
    @IsOptional()
    middleName?: string;
    @IsString()
    @IsPhoneNumber("RU")
    phone: string;
}