import { IsEmail, IsString, Length } from "class-validator";

// DTO-класс для создания пользователя
export class CreateUserDto {
    @IsString({message: "Должно быть строкой"})
    @IsEmail({}, {message: "Некорректная почта"})
    readonly email: string;
    @IsString({message: "Должно быть строкой"})
    @Length(4, 24, {message: "Не меньше 4 и не больше 24"})
    readonly password: string;
}