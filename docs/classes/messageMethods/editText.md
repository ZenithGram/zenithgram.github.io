---
title: editText
description: "Редактирует текст сообщения по ID."
sidebarDepth: 0
---

# editText
Метод редактирует текст сообщения

::: warning **Важно:**
Метод [editText](/classes/messageMethods/editText.md) работает только при условии, что в сообщении нет медиа: фото, видео и т.д.
Если в сообщении есть медиа, то нужно использовать [editCaption](/classes/messageMethods/editCaption.md)
:::

## Параметры метода
| # |       Название        |           Тип           |       Описание        |
|:-:|:---------------------:|:-----------------------:|:---------------------:|
| 1 |    **message_id**     |      `int`\|`null`      |     ID сообщения      |
| 2 |      **chat_id**      | `int`\|`string`\|`null` |        ID чата        |
| 3 | **message_thread_id** |      `int`\|`null`      | ID темы (для форумов) |

## Возвращает
`array` - ответ от Телеграма, содержащий информацию о сообщении

## Пример использования
```php
<?php
require_once __DIR__ . '/vendor/autoload.php'; 
use ZenithGram\ZenithGram\ZG;
use ZenithGram\ZenithGram\Bot;

$tg = ZG::create(BOT_TOKEN);
$bot = new Bot($tg);

$bot->onBotCommand('edit', '/edit')
    ->func(function(ZG $tg) {
        // Сначала отправляем сообщение
        $response = $tg->msg("Это сообщение будет изменено")->send();
        // Получаем ID отправленного сообщения
        $messageId = $response['result']['message_id'];
        // Пауза для наглядности (!!! Не используйте в реальных проектах !!!)
        sleep(3);
        // Редактируем сообщение
        $tg->msg("Сообщение было успешно изменено!")
            ->editText($messageId);
    });

// 2. Обрабатываем нажатие на кнопку
$bot->onCallback('edit_in_chat', '/edit_in_chat')
    ->func(function(ZG $tg) {
        // ID чата, в котором нужно отредактировать сообщение
        $chatIdToEdit = 123456789;
        // ID сообщения для редактирования (предположим, мы его уже знаем)
        $messageIdToEdit = 987;

        $tg->msg("Редактирование сообщения в другом чате.")
            ->editText($messageIdToEdit, $chatIdToEdit);
    });

$bot->run();
```
