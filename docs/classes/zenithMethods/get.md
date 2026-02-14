---
title: get
description: "Методы получения данных из обновления (getChatId, getText и др.)."
sidebarDepth: 0
---

# get-методы 
Служат для получения данных из пришедшего события

## getUpdate
Метод возвращает пришедшее от Телеграма событие, полученное через Webhook. Это основной метод, который нужно вызвать в самом начале для загрузки данных.

### Возвращает
`array` - Массив с событием от Telegram.

### Пример использования
```php
<?php
require_once __DIR__ . '/vendor/autoload.php';
use ZenithGram\ZenithGram\ZG;

$tg = ZG::create(BOT_TOKEN);
$update = $tg->getUpdate();
```

## getMessage
Метод возвращает DTO-объект со всеми данными сообщения.

### Возвращает
`MessageDto` - Объект, содержащий информацию о сообщении

### Пример использования
```php
$text = $tg->getMessage()->text;
```

## getReplyMessage
Метод возвращает DTO-объект со всеми данными отвеченного сообщения.

### Возвращает
`MessageDto` - Объект, содержащий информацию об отвеченном сообщении

### Пример использования
```php
$text = $tg->getMessageReply()->text;
```

## getChatId
Метод возвращает идентификатор чата из пришедшего события.

### Возвращает
`int|string|null` - ID чата или `null`, если его нет в событии.

### Пример использования
```php
$chat_id = $tg->getChatId();
```

## getMsgThreadId
Метод возвращает ID темы/ветки (важно для форумов).

### Возвращает
`int|null` - ID темы или `null`, если его нет в событии.

### Пример использования
```php
$thread_id = $tg->getMsgThreadId();
```

## getChat
Метод возвращает DTO-объект со всеми данными чата.

### Возвращает
`ChatDto` - Объект, содержащий информацию о чате

### Пример использования
```php
$chat_id = $tg->getChat()->id;
```

## getUserId
Метод возвращает идентификатор пользователя, отправившего сообщение или совершившего действие.

### Возвращает
`int|string|null` - ID пользователя или `null`, если его нет в событии.

### Пример использования
```php
$user_id = $tg->getUserId();
```

## getReplyUserId
Метод возвращает идентификатор пользователя, на чьё сообщение ответили (reply_to_message).

### Возвращает
`int|string|null` - ID пользователя или `null`, если его нет в событии.

### Пример использования
```php
$reply_user_id = $tg->getReplyUserId();
```

## getUser
Метод возвращает DTO-объект со всеми данными пользователя.

### Возвращает
`UserDto` - Объект, содержащий информацию о пользователе

### Пример использования
```php
$user_id = $tg->getUser()->id;
```

## getText
Метод возвращает текст сообщения из пришедшего события.

### Возвращает
`string|null` - Текст сообщения или `null`, если это не текстовое сообщение.

### Пример использования
```php
$text = $tg->getText();
```

## getReplyText
Метод возвращает текст отвеченного сообщения из пришедшего события (reply_to_message).

### Возвращает
`string|null` - Текст сообщения или `null`, если это не текстовое сообщение.

### Пример использования
```php
$reply_text = $tg->getReplyText();
```

## getMsgId
Метод возвращает идентификатор сообщения из пришедшего события.

### Возвращает
`int|string|null` - ID сообщения или `null`, если его нет в событии.

### Пример использования
```php
$msg_id = $tg->getMsgId();
```

## getReplyMsgId
Метод возвращает идентификатор сообщения, на которое ответили (reply_to_message).

### Возвращает
`int|string|null` - ID сообщения или `null`, если его нет в событии.

### Пример использования
```php
$msg_id = $tg->getReplyMsgId();
```

## getType
Метод определяет и возвращает тип пришедшего события (`text`, `callback_query` и т.д.).

### Возвращает
`string|null` - Тип события.

### Пример использования
```php
$type = $tg->getType();
```

## getQueryId
Метод возвращает идентификатор callback-запроса (нажатие на inline-кнопку) или inline-запроса.

### Возвращает
`string|null` - ID запроса или `null`, если это не callback-событие.

### Пример использования
```php
$query_id = $tg->getQueryId();
```

## getCallbackData
Метод возвращает данные, привязанные к callback-кнопке.

### Возвращает
`string|null` - Данные из `callback_data` или `null`, если их нет.

### Пример использования
```php
$callback_data = $tg->getCallbackData();
```

## getIsForum
Метод возвращает true, если обновление пришло из форума и false, если нет.

### Возвращает
`bool` - Сообщение пришло из форума? true/false.

### Пример использования
```php
$isForum = $tg->getIsForum();
```

## getIsBot
Метод возвращает true, если пользователь бот и false, если нет.

### Возвращает
`bool` - Является ли пользователь ботом? true/false.

### Пример использования
```php
$isBot = $tg->getIsBot();
```

---

## Комплексный пример: Эхо-бот

Этот пример показывает, как методы работают вместе для создания простого бота, который отвечает на текстовые сообщения.

```php
<?php
require_once __DIR__ . '/vendor/autoload.php';
use ZenithGram\ZenithGram\ZG;

$tg = ZG::create(BOT_TOKEN);

$chat_id = $tg->getChatId();
$text = $tg->getText();
$type = $tg->getType();

if ($type === 'text') {
    $responseText = "Вы написали: " . $text;
    $tg->sendMessage($chat_id, $responseText);
}

$tg->sendOk();
```


1.  

2.  **`getIsForum(): bool`** — Проверка, является ли чат форумом.

3.  **`getIsBot(): bool`** — Проверка, является ли пользователь ботом.

4.  **`getReplyMessage(): ?MessageDto`** — Получение DTO сообщения, на которое ответили.

5.  **`getStorage(): ?StorageInterface`** — (В документации назван `storage()`, в коде — `getStorage()`).
