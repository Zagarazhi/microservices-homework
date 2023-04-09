import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AUTH_SERVICE } from "./services";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, Observable, tap } from "rxjs";

@Injectable()
// Этот класс отвечает за аутентификацию пользователя, проверяя, действителен ли токен JWT, и, если да, добавляя пользователя в контекст запроса.
export class JwtAuthGuard implements CanActivate {
    constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

    /*
    * Метод canActivate вызывается при каждом входящем запросе и сначала вызывает метод getAuthentication
    * для получения токена аутентификации из контекста запроса. Затем он отправляет сообщение authClient 
    * для проверки пользователя путем передачи токена аутентификации. Если проверка прошла успешно, 
    * он добавляет пользователя в контекст запроса, вызывая метод addUser. Если проверка не пройдена, 
    * выдается исключение UnauthorizedException.
    */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const authentication = this.getAuthentication(context);
        return this.authClient.send("validate_user", {
            Authentication: authentication,
        }).pipe(
            tap((res) => {
                this.addUser(res, context)
            }),
            catchError(() => {
                throw new UnauthorizedException();
            }),
        );
    }

    /*
    * Метод getAuthentication проверяет тип входящего запроса и соответственно получает токен аутентификации.
    * Затем он возвращает токен проверки подлинности или создает исключение UnauthorizedException, если токен не найден.
    */
    private getAuthentication(context: ExecutionContext) {
        let authentication: string;
        if(context.getType() === 'rpc') {
            authentication = context.switchToRpc().getData().Authentication;
        } else if (context.getType() === 'http') {
            authentication = context.switchToHttp().getRequest().cookies?.Authentication;
        }
        if (!authentication) {
            throw new UnauthorizedException("Не удалось авторизоваться");
        }
        return authentication;
    }

    // Метод addUser добавляет пользователя в контекст запроса на основе типа запроса.
    private addUser(user: any, context: ExecutionContext) {
        if(context.getType() === 'rpc') {
            context.switchToRpc().getData().user = user;
        } else if (context.getType() === 'http') {
            context.switchToHttp().getRequest().user = user;
        }
    }
}