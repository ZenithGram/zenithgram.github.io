---
title: parseMode
description: "Устанавливает режим разметки."
sidebarDepth: 0
---

# parseMode
Метод устанавливает режим разметки для сообщения

:::warning Не совместим с entities
Методы entities и parseMode взаимоисключающие и не могут быть определены вместе.
:::

## Параметры метода
| # |    Название    |        Тип         |                               Возможные значения                                |
|:-:|:--------------:|:------------------:|:-------------------------------------------------------------------------------:|
| 1 | **parse_mode** | `MessageParseMode` | Возможные значения описаны в [MessageParseMode](/classes/enum#messageparsemode) |

## Возвращает
`Message`|`Action` - экземпляр класса Message или Action, содержащий информацию о сообщении

::: tip Контекст вызова
Этот метод реализован через общий трейт и возвращает текущий экземпляр объекта.</br>
Тип возвращаемого значения зависит от того, какой класс вы используете в данный момент:
*   При вызове у экземпляра **Message** вернется объект `Message`.
*   При вызове у экземпляра **Action** вернется объект `Action`.
:::

## Пример использования
```php
<?php
require_once __DIR__ . '/vendor/autoload.php'; 
use ZenithGram\ZenithGram\ZG;
use ZenithGram\ZenithGram\Bot;
use ZenithGram\ZenithGram\Enums\MessageParseMode;

$tg = ZG::create(BOT_TOKEN);
$bot = new Bot($tg);

$bot->onBotCommand('/html')->func(function(ZG $tg) {
    $tg->msg("<b>Отправка сообщений с форматированием HTML</b>")
        ->parseMode(MessageParseMode::HTML) // Задаём разметку HTML
        ->send();
    });
            
$bot->onBotCommand('/markdown')->func(function(ZG $tg) {
    $tg->msg("*Отправка сообщений с форматированием Markdown*")
        ->parseMode(MessageParseMode::MarkdownV2) // Задаём разметку MarkdownV2
        ->send();
    });

$bot->run();
```

[Подробнее о разметках на официальной документации Telegram](https://core.telegram.org/bots/api#formatting-options)
