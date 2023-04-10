# Описание
Этот проект представляет собой веб-приложение с использованием NestJS, Docker и RabbitMQ и тестированием. Приложение разделено на микросервисы: авторизация и профиль, каждое из которых работает в своем контейнере, связано со своей базой данных (также в отдельных контейнерах), а сообщения передаются с помощью RabbitMQ.

- [auth](apps/auth/): этот каталог содержит модуль для работы с авторизацией.
- [profile](apps/profile/): этот каталог содержит модуль для работы с профилями.
- [common](libs/common/): этот каталог содержит общие модули для работы микросервисов.
- [docker compose](docker-compose.yml): файл настройки Docker.
- [.env](.env): конфигурационный файл для разработки.
- [Тесты auth service](apps/auth/src/auth.service.spec.ts)
- [Тесты profile service](apps/profile/src/profile.service.spec.ts)
- [Тесты profile controller](apps/profile/src/profile.controller.spec.ts)
- [Примеры](examples)

# API-маршруты
Доступны следующие маршруты API:

- POST /auth/users - регистрация пользователя
- POST /auth/login - вход
- POST /profiles - создание профиля
- GET /profiles - получение профиля
- PUT /profiles - обновлени профиля
- DELETE /profiles - удаление профиля