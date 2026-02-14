---
title: parseMode
description: "Устанавливает режим разметки для стриминга"
sidebarDepth: 0
---

# parseMode
Метод устанавливает режим разметки для сообщения в режиме стриминга

:::warning Не совместим с entities
Методы entities и parseMode взаимоисключающие и не могут быть определены вместе.
:::

## Параметры метода
| # |    Название    |        Тип         |                               Возможные значения                                |
|:-:|:--------------:|:------------------:|:-------------------------------------------------------------------------------:|
| 1 | **parse_mode** | `MessageParseMode` | Возможные значения описаны в [MessageParseMode](/classes/enum#messageparsemode) |

## Возвращает
`MessageDraft` - экземпляр класса `MessageDraft`.

## Пример использования
```php
<?php
require_once __DIR__ . '/vendor/autoload.php'; 
use ZenithGram\ZenithGram\ZG;
use ZenithGram\ZenithGram\Bot;
use ZenithGram\ZenithGram\Enums\MessageParseMode;

$tg = ZG::create(BOT_TOKEN);
$bot = new Bot($tg);

$bot->onCommand('stream', '/stream')->func(function (ZG $tg) {
    $draft = $tg->msgDraft("⏳ <b>Init...</b>")
        ->parseMode(MessageParseMode::HTML)
        ->send();
});

$bot->run();
```

[Подробнее о разметках на официальной документации Telegram](https://core.telegram.org/bots/api#formatting-options)
