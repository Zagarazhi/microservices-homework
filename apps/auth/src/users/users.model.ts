import { Column, DataType, Model, Table } from "sequelize-typescript";

// Интефейс, в котором записаны поля, необходимые для создания объекта класса
interface UserCreationAttrs {
    email: string;
    password: string;
}

// Модель для работы с таблицей пользователей
@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {
    // Колонка id типа INTEGER, которая является первичным ключем таблицы
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    // Колонка почты, которая должна быть не пустой и уникальной для каждого пользователя
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    // Колонка пароль, которая должна быть не пустой
    @Column({type: DataType.STRING, allowNull: false})
    password: string;
}