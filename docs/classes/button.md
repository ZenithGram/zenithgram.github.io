---
url: 'https://zenithgram.github.io/classes/button.md'
description: Вспомогательный класс для создания кнопок.
---

# **Button**

Вспомогательный класс для генерации кнопок. Поддерживает все актуальные типы кнопок Telegram API.

## Импорт

Для использования класса необходимо его импортировать через конструкцию `use`. Если вы планируете использовать цветные кнопки, также импортируйте перечисление `ButtonStyle`.

```php
use ZenithGram\ZenithGram\Button;
use ZenithGram\ZenithGram\Enums\ButtonStyle;
```

## Стили и Эмодзи (Общие параметры)

Абсолютно **все** методы класса `Button` принимают два дополнительных опциональных параметра: `$style` и `$customEmojiId`. Для удобства рекомендуется использовать именованные аргументы PHP 8.

* **Стили** поддерживают 4 цвета: `Primary` (Синий), `Success` (Зеленый), `Danger` (Красный) и стандартный цвет Telegram.
* **Эмодзи** работают, если у бота есть юзернейм с Fragment или у получателя есть Telegram Premium.

```php
Button::cb(
    text: 'Удалить', 
    data: 'del_123', 
    style: ButtonStyle::Danger, 
    customEmojiId: '5368324170671202286'
);
```

## Комплексный пример использования класса
```php
<?php
// 1. Необходимые импорты
use ZenithGram\ZenithGram\Bot;
use ZenithGram\ZenithGram\ZG;
use ZenithGram\ZenithGram\Button;
use ZenithGram\ZenithGram\Enums\ButtonStyle;
use ZenithGram\ZenithGram\Enums\MessageParseMode;

$tg = ZG::create("BOT_TOKEN");
$bot = new Bot($tg);

// Inline-клавиатура
$bot->onBotCommand('menu', '/menu')
    ->func(function(ZG $tg) {
        
        // Формируем массив рядов
        $inlineKeyboard = [
            // Первый ряд: 3 кнопки со всеми доступными стилями
            [
                Button::cb('Отмена', 'cancel', ButtonStyle::Danger),
                Button::cb('Ок', 'confirm', ButtonStyle::Success),
                Button::cb('Инфо', 'info', ButtonStyle::Primary)
            ],
            // Второй ряд: 2 кнопки (Ссылка и Копирование текста с кастомным эмодзи)
            [
                Button::url('Наш сайт', 'https://example.com'),
                Button::copyText(
                    text: 'Промокод', 
                    textToCopy: 'SALE-2025', 
                    customEmojiId: '5368324170671202286' // ID эмодзи
                )
            ],
            // Третий ряд: 1 кнопка на всю ширину (Инлайн режим)
            [
                Button::switchInlineCurrent('🔎 Поиск по каталогу', 'найти ')
            ]
        ];

        $tg->msg("🗂 <b>Главное меню</b>\nВыберите нужное действие:")
            ->parseMode(MessageParseMode::HTML)
            ->inlineKbd($inlineKeyboard)
            ->send();
    });

// Reply-клавиатура
$bot->onBotCommand('tools', '/tools')
    ->func(function(ZG $tg) {
        
        $replyKeyboard = [
            // Первый ряд: запросы пользователей и чатов
            [
                Button::requestUsers('👥 Выбрать 2-х юзеров', requestId: 1, options: ['max_quantity' => 2]),
                Button::requestChat('📢 Выбрать канал', requestId: 2, chatIsChannel: true)
            ],
            // Второй ряд: локация и создание опроса
            [
                Button::location('📍 Моя геопозиция'),
                Button::poll('📊 Сделать опрос', type: 'regular')
            ],
            // Третий ряд: обычный текст для закрытия
            [
                Button::text('❌ Закрыть меню')
            ]
        ];

        $tg->msg("🛠 <b>Инструменты</b>\nВоспользуйтесь функциями ниже:")
            ->parseMode(MessageParseMode::HTML)
            ->kbd($replyKeyboard, resize: true) 
            ->send();
    });

$bot->run();
```

## text
Обычная текстовая кнопка (Reply)
```php
Button::text('Текст кнопки');
```

## cb
Inline кнопка с Callback Data
```php
Button::cb('Текст кнопки', 'callbackData');
```

## url
Inline кнопка-ссылка
```php
Button::url('Текст кнопки', 'https://example.com');
```

## webApp
Кнопка для запуска WebApp (Поддерживается как для Inline, так и для Reply)
```php
Button::webApp('Открыть приложение', 'https://app.url');
```

## contact
Кнопка запроса контакта (Reply)
```php
Button::contact('Отправить контакт');
```

## location
Кнопка запроса геолокации (Reply)
```php
Button::location('Отправить геопозицию');
```

## copyText
Inline кнопка для копирования заданного текста в буфер обмена пользователя
```php
Button::copyText('Скопировать промокод', 'PROMO-2025');
```

## switchInline
Inline кнопка, переводящая пользователя в другой чат с активацией инлайн-режима бота
```php
Button::switchInline('Поиск в другом чате', 'текст запроса');
```

## switchInlineCurrent
Inline кнопка, активирующая инлайн-режим бота в текущем чате
```php
Button::switchInlineCurrent('Искать здесь', 'текст запроса');
```

## switchInlineChosen
Inline кнопка для активации инлайн-режима с предварительным выбором типа чата (группы, каналы, лс)
```php
Button::switchInlineChosen('Выбрать чат', [
    'query' => 'запрос', 
    'allow_group_chats' => true
]);
```

## loginUrl
Inline кнопка для беспарольной авторизации на сайте через Telegram
```php
Button::loginUrl('Войти через Telegram', ['url' => 'https://example.com/login']);
```

## requestUsers
Кнопка запроса выбора одного или нескольких пользователей/ботов (Reply)
```php
Button::requestUsers('Выбрать 2-х Premium юзеров', requestId: 1, options: [
    'user_is_premium' => true,
    'max_quantity' => 2
]);
```

## requestChat
Кнопка запроса выбора группы или канала по заданным критериям (Reply)
```php
Button::requestChat('Выбрать канал', requestId: 2, chatIsChannel: true, options: [
    'chat_has_username' => true
]);
```

## requestManagedBot
Кнопка запроса на создание управляемого бота (Reply)
```php
Button::requestManagedBot('Создать бота', requestId: 3, options: [
    'suggested_name' => 'Мой новый бот'
]);
```

## poll
Кнопка, предлагающая пользователю создать опрос или викторину и отправить боту (Reply)
```php
Button::poll('Создать викторину', 'quiz'); // 'regular', 'quiz' или null
```

## pay
Inline кнопка для оплаты счетов (включая Telegram Stars)
::: warning Важно
Эту кнопку **нельзя** прикрепить к обычному текстовому сообщению. Она должна быть первой кнопкой в первом ряду и отправляться исключительно через метод API `sendInvoice`.
:::
```php
Button::pay('Оплатить 100⭐');
```