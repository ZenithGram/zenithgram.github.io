---
title: entities
description: "Устанавливает сущность для стриминга"
sidebarDepth: 0
---

# entities
Метод устанавливает особые сущности для сообщения, которые содержат в себе оформление сообщения  

:::warning Не совместим с parseMode
Методы entities и parseMode взаимоисключающие и не могут быть определены вместе.
:::

## Параметры метода
| # |   Название   |   Тип   | Описание                                                                                          |
|:-:|:------------:|:-------:|:--------------------------------------------------------------------------------------------------|
| 1 | **entities** | `array` | Массив сущности (Подробнее на сайте [Telegram](https://core.telegram.org/bots/api#messageentity)) |

## Возвращает
`MessageDraft` - экземпляр класса `MessageDraft`.

## Пример использования
```php
<?php
require_once __DIR__ . '/vendor/autoload.php';
use ZenithGram\ZenithGram\ZG;

$tg = ZG::create(BOT_TOKEN);
$bot = new Bot($tg);

$bot->onCommand('stream', '/stream')->func(function (ZG $tg) {
    $entities = [
        [
            'offset' => 0,
            'length' => 9,
            'type' => 'italic'
        ]
    ];

    $draft = $tg->msgDraft("⏳ Init...")
        ->entities($entities)
        ->send();
});

$bot->run();
```
