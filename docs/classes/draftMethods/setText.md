---
title: setText
description: "Устанавливает новый текст для стриминга"
sidebarDepth: 0
---

# setText
Метод устанавливает новый текст сообщения в режиме стриминга

## Параметры метода
| # | Название |   Тип    |                   Описание                    |
|:-:|:--------:|:--------:|:---------------------------------------------:|
| 1 | **text** | `string` | Новое измененное сообщение во время стриминга |

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
        ->send();
        
    sleep(5); // Не используйте в реальном проекте
    
    $draft->setText("New text for streeming mode")->send();
});

$bot->run();
```