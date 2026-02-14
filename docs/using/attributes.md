---
description: Использование атрибутов PHP 8 для создания контроллеров и маршрутизации.
---

# Атрибуты и Контроллеры
ZenithGram поддерживает современный подход к организации кода с использованием **Атрибутов PHP 8**. Вместо того чтобы описывать все маршруты в одном файле через цепочку вызовов `$bot->on...`, вы можете создавать классы-контроллеры и помечать методы специальными атрибутами.

Это делает код чище, позволяет группировать логику по смыслу и использовать возможности Dependency Injection.

## Как это работает
1. Вы создаете класс (Контроллер).
2. Создаете публичные методы для обработки событий.
3. Добавляете к методам атрибуты (например, `#[OnStart]`, `#[OnCommand]`).
4. Регистрируете контроллер в боте.

Библиотека автоматически просканирует класс, создаст маршруты и привяжет их к вашим методам.

## Базовый пример
Создадим простой контроллер `MyController.php`:

```php
<?php
namespace App\Controllers;

use ZenithGram\ZenithGram\Attributes\OnStart;
use ZenithGram\ZenithGram\Attributes\OnCommand;
use ZenithGram\ZenithGram\Attributes\OnText;
use ZenithGram\ZenithGram\ZG;

class MyController
{
    // Обработка команды /start
    #[OnStart]
    public function start(ZG $tg): void
    {
        $tg->msg("Добро пожаловать в бота!")->send();
    }

    // Обработка команды !ping
    #[OnCommand('!ping')]
    public function ping(ZG $tg): void
    {
        $tg->msg("Pong!")->send();
    }

    // Обработка текста "Привет"
    #[OnText('Привет')]
    public function greeting(ZG $tg): void
    {
        $tg->msg("И тебе привет!")->send();
    }
}
```

## Регистрация контроллера
Чтобы бот узнал о вашем контроллере, его нужно зарегистрировать перед запуском `$bot->run()`.

```php
<?php
require_once __DIR__ . '/vendor/autoload.php';

use ZenithGram\ZenithGram\ZG;
use ZenithGram\ZenithGram\Bot;
use App\Controllers\MyController; // Не забудьте подключить ваш класс

$tg = ZG::create(BOT_TOKEN);
$bot = new Bot($tg);

// Включаем рефлексию (рекомендуется для контроллеров)
$bot->reflection();

// Регистрируем массив контроллеров
$bot->attributes()->registerControllers([
    MyController::class,
    // OtherController::class,
]);

$bot->run();
```

## Dependency Injection (Внедрение зависимостей)
При использовании атрибутов настоятельно рекомендуется включить `$bot->reflection()`. Это позволит вам запрашивать необходимые объекты (DTO, сервисы) прямо в аргументах метода, не извлекая их вручную из `$tg`.

```php
use ZenithGram\ZenithGram\Attributes\OnCommand;
use ZenithGram\ZenithGram\Dto\UserDto;
use ZenithGram\ZenithGram\ZG;

class StoreController 
{
    // Маршрут: /buy {item_id}
    #[OnCommand('/buy {item_id}')]
    public function buyItem(ZG $tg, UserDto $user, int $item_id, DatabaseService $db): void
    {
        // $user - автоматически заполненный DTO пользователя
        // $item_id - аргумент из команды
        // $db - ваш сервис (если настроен DI-контейнер)
        
        $db->createOrder($user->id, $item_id);
        $tg->msg("Заказ #$item_id оформлен для {$user->firstName}")->send();
    }
}
```

## Преимущества использования атрибутов
1. **Структура:** Логика разбита на классы, а не свалена в кучу в `index.php`.
2. **Читаемость:** Атрибут сразу говорит, на какое событие реагирует метод.
3. **Автоматизация:** ID маршрутов генерируются автоматически (формат `ClassName::MethodName`), что исключает конфликты имен.

## Кеширование
Сканирование атрибутов использует рефлексию, что может быть затратно по ресурсам. Библиотека автоматически кеширует карту атрибутов, если вы подключили кеш к боту.
```php
$bot->setCache($myCacheImplementation); // PSR-16 Cache
// Теперь сканирование контроллеров будет происходить только один раз
```
