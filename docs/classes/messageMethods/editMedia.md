---
title: editMedia
description: "Заменяет медиа в сообщении по ID."
sidebarDepth: 0
---

# editMedia
Метод заменяет медиафайл (фото, видео, аудио, документ) в уже отправленном сообщении. Также может одновременно изменить подпись к медиа и прикрепленную inline-клавиатуру.

::: warning **Важно:**
Метод `editMedia` работает только для сообщений, в которых **уже есть** медиафайл. Если вы попытаетесь добавить медиа в чисто текстовое сообщение, Telegram вернет ошибку. Для редактирования текстовых сообщений используйте [`editText()`](/classes/messageMethods/editText.md).
:::

## Параметры метода
| # |       Название        |           Тип           |       Описание        |
|:-:|:---------------------:|:-----------------------:|:---------------------:|
| 1 |    **message_id**     |      `int`\|`null`      |     ID сообщения      |
| 2 |      **chat_id**      | `int`\|`string`\|`null` |        ID чата        |
| 3 | **message_thread_id** |      `int`\|`null`      | ID темы (для форумов) |

## Возвращает
`array` - ответ от Телеграма, содержащий информацию об измененном сообщении.

## Пример использования

```php
<?php
require_once __DIR__ . '/vendor/autoload.php';
use ZenithGram\ZenithGram\ZG;
use ZenithGram\ZenithGram\Bot;
use ZenithGram\ZenithGram\Button;

$tg = ZG::create('ВАШ_ТОКЕН');
$bot = new Bot($tg);

// 1. По команде /start отправляем исходное сообщение с фото кота и кнопкой
$bot->onBotCommand('start', '/start')
    ->text("Это фото котика. Хотите увидеть собачку?")
    ->img('https://cataas.com/cat') // URL первого изображения
    ->inlineKbd([
        [Button::cb('Да, показать собачку!', 'show_dog')]
    ]);

// 2. Обрабатываем нажатие на кнопку
$bot->onCallback('handle_dog_request', 'show_dog')
    ->func(function(ZG $tg) {
        // Обязательно отвечаем на callback, чтобы убрать "часики"
        $tg->answerCallbackQuery($tg->getQueryId());

        // Готовим новое сообщение для редактирования
        $tg->msg("А вот и собачка!")               // Новая подпись
           ->img('https://place.dog/300/200')     // URL нового изображения
           ->editMedia();                         // Выполняем замену медиа
    });

$bot->run();
```