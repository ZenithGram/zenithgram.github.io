---
title: send
description: "Отправляет или изменяет сообщение в режиме стриминга"
sidebarDepth: 0
---

# send
Метод отправляет или изменяет сообщение в режиме стриминга

## Параметры метода
| # |       Название        |           Тип           |                                 Описание                                 |
|:-:|:---------------------:|:-----------------------:|:------------------------------------------------------------------------:|
| 1 |      **chat_id**      | `int`\|`string`\|`null` |                                 ID чата                                  |
| 2 | **message_thread_id** |      `int`\|`null`      |                          ID темы (для форумов)                           |
| 2 |     **draft_id**      |      `int`\|`null`      | ID стриминга (либо создается библиотекой, либо передается пользователем) |

## Возвращает
`MessageDraft` - экземпляр класса `MessageDraft`.

## Пример использования
```php
<?php
require_once __DIR__ . '/vendor/autoload.php'; 
use ZenithGram\ZenithGram\ZG;
use ZenithGram\ZenithGram\Bot;

$tg = ZG::create(BOT_TOKEN);
$bot = new Bot($tg);

$bot->onCommand('stream', '/stream')->func(function (ZG $tg) {
    $draft = $tg->msgDraft("⏳ Init...")
        ->send(); // Отправляем
        
    sleep(5); // Не используйте в реальном проекте
    
    $draft->setText("New text for streeming mode")
        ->send(); // Изменяем
});

$bot->run();
```