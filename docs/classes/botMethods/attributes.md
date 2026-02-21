---
url: 'https://zenithgram.github.io/classes/botMethods/attributes.md'
description: Получение загрузчика атрибутов для регистрации контроллеров.
---

# attributes
Метод возвращает экземпляр вспомогательного класса `AttributesLoader`. Этот класс отвечает за сканирование, настройку зависимостей и регистрацию контроллеров, использующих атрибуты PHP 8.

## Параметры
Метод не принимает параметров.

## Возвращает
`AttributesLoader` — объект-загрузчик.

## Пример использования
```php
<?php
require_once __DIR__ . '/vendor/autoload.php';
use ZenithGram\ZenithGram\ZG;
use ZenithGram\ZenithGram\Bot;
use App\Controllers\MyController;

$tg = ZG::create(BOT_TOKEN);
$bot = new Bot($tg);

// Получаем загрузчик и сразу регистрируем контроллер
$bot->attributes()->registerControllers([
    MyController::class
]);

// Или используем цепочку для сложной настройки
$bot->attributes()
    ->setFactory(...)
    ->scanDirectory(...);

$bot->run();
```