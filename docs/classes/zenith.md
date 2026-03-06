---
title: ZG
description: "Основной класс библиотеки."
sidebarDepth: 0
---

# **ZG** 
Основной класс библиотеки `ZenithGram`.

## Создание экземпляра `ZG`
Для создания экземпляра класса используется `create` – статический фабричный метод.

::: tip Токен
Токен создаётся, используя бота [BotFather](https://t.me/BotFather) 
:::

### Параметры метода
| # |   Название   |       Тип        | Описание                                                                                                                        |
|:-:|:------------:|:----------------:|---------------------------------------------------------------------------------------------------------------------------------|
| 1 |  **token**   |     `string`     | Токен вашего Telegram бота, полученный от @BotFather.                                                                           |
| 2 | **baseUrl**  |     `string`     | Ссылка на сервер Telegram (Может быть как локально развернутый, так и стандартный). </br>По умолчанию: https://api.telegram.org |
| 3 | **proxyUrl** | `string`\|`null` | Адрес HTTP-прокси. Формат: `tcp://ip:port` или `http://user:pass@ip:port`. </br>По умолчанию: `null`                            |

### Возвращает
`ZG` - экземпляр класса `ZG`, готовый к использованию.

### Пример использования
```php
<?php
require_once __DIR__ . '/vendor/autoload.php';
use ZenithGram\ZenithGram\ZG;

// Замените 'BOT_TOKEN' на фактический токен вашего бота
$tg = ZG::create(BOT_TOKEN);

// Со своим сервером
$tg = ZG::create(BOT_TOKEN, 'https://my-local-tg-server.com');
```

## Сценарии использования

1. Создание других экземпляров

```php
$message = $tg->msg();  // Класс Message
$bot = new Bot($tg);    // Класс Bot
```

2. Отправка запросов к Telegram API

```php
$me = $tg->callAPI('getMe');
$tg->sendMessage($tg->getChatId, "Вы используете библиотеку ZenithGram!");
```

3. Работа с контекстом

```php
$chat_id = $tg->getChatId();
$user_id = $tg->getUserId();
$update = $tg->getUpdate();
$user_id_dto = $tg->getUser()->id();
```
