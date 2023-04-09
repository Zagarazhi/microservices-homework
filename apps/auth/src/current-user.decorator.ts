import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './users/users.model';

/*
* Эта функция, которая принимает объект context типа ExecutionContext из NestJS и возвращает объект User,
* который представляет текущего пользователя. Если контекст является типом http,
* то функция использует switchToHttp() для получения запроса Request и извлекает объект пользователя user.
* Если контекст является типом rpc, функция использует switchToRpc() для получения данных Data и извлекает объект пользователя user.
*/
export const getCurrentUserByContext = (context: ExecutionContext): User => {
    if (context.getType() === 'http') {
        return context.switchToHttp().getRequest().user;
    }
    if (context.getType() === 'rpc') {
        return context.switchToRpc().getData().user;
    }
};

/* Эта функция-декоратор параметра, которая использует getCurrentUserByContext
* и возвращает текущего пользователя в качестве значения параметра декоратора.
* Это позволяет получать текущего пользователя из параметра метода-обработчика запроса в NestJS-контроллерах и сервисах.
*/
export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) =>
        getCurrentUserByContext(context),
);