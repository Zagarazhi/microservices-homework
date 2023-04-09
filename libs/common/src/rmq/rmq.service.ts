import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RmqOptions, Transport } from "@nestjs/microservices"

// Этот код определяет сервис RmqService, который используется для получения настроек подключения к RabbitMQ.
@Injectable()
export class RmqService {

    constructor(private readonly configService: ConfigService) {}

    getOptions(queue: string, noAck = false): RmqOptions {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.configService.get<string>('RABBITMQ_URI')],
                queue: this.configService.get<string>(`RABBITMQ_${queue}_QUEUE`),
                noAck,
                persistent: false,
            },
        }
    }
}