# Атрибуты и Контроллеры

Использование **PHP 8 Attributes** позволяет писать чистый, модульный код. Вместо того чтобы нагромождать сотни строк с `$bot->onCommand(...)` в одном файле, вы создаете **Контроллеры** — отдельные классы, отвечающие за конкретную логику (например, `AdminController`, `ShopController`).

## Быстрый старт: Автообнаружение (Auto-discovery)

Самый современный способ работы — сложить все контроллеры в одну папку и позволить библиотеке самой найти их.

### 1. Создайте структуру папок
```text
/src
  /Controllers
    StartController.php
    GameController.php
index.php
```

### 2. Напишите контроллер
Файл: `src/Controllers/StartController.php`

```php
<?php
namespace App\Controllers;

use ZenithGram\ZenithGram\Attributes\OnStart;
use ZenithGram\ZenithGram\Attributes\Btn;
use ZenithGram\ZenithGram\ZG;

class StartController
{
    #[OnStart]
    public function welcome(ZG $tg): void
    {
        $tg->msg("Привет! Давай сыграем?")
           // Мы просто указываем ID кнопки 'play_game',
           // а её текст и обработчик определены в методе ниже.
           ->kbd([['play_game']]) 
           ->send();
    }

    // Регистрируем кнопку с ID 'play_game' и текстом '🎮 Играть'
    #[Btn('play_game', '🎮 Играть')]
    public function startGame(ZG $tg): void
    {
        $tg->msg("Игра началась! 🚀")->send();
    }
}
```

### 3. Подключите в `index.php`

```php
<?php
require_once __DIR__ . '/vendor/autoload.php';

use ZenithGram\ZenithGram\ZG;
use ZenithGram\ZenithGram\Bot;

$tg = ZG::create(BOT_TOKEN);
$bot = new Bot($tg);

// 1. Включаем рефлексию (чтобы работали UserDto, ChatDto и аргументы)
$bot->reflection();

// 2. Сканируем папку
$bot->attributes()->scanDirectory(
    directory: __DIR__ . '/src/Controllers', 
    rootNamespace: 'App\Controllers'
);

$bot->run();
```

## Внедрение зависимостей (Dependency Injection)
В реальных проектах контроллерам нужны доступ к базе данных, логгеру или API. Для этого используется метод `setFactory`. Это "легковесный DI", который работает очень быстро.

### Настройка Фабрики
В `index.php` создайте ваши сервисы (например, PDO) и передайте их в контроллеры через `match`:

```php
use PDO;
use App\Controllers\GameController;
// Подключение к БД
$db = new PDO('sqlite:database.db');

// Настраиваем фабрику
$bot->attributes()->setFactory(function (string $class) use ($db) {
    return match ($class) {
        // Если библиотека просит создать GameController, мы отдаем его с БД
        GameController::class => new $class($db),
        
        // Для остальных классов возвращаем null (библиотека создаст их через new $class)
        default => null, 
    };
});

// После настройки фабрики запускаем сканирование
$bot->attributes()->scanDirectory(__DIR__ . '/src/Controllers', 'App\Controllers');
```

### Использование в контроллере
Теперь вы можете объявить конструктор и использовать зависимость:

```php
use PDO;

class GameController
{
    // PHP 8 Constructor Promotion: свойство создастся автоматически
    public function __construct(
        private PDO $db
    ) {}

    #[OnCommand('/stats')]
    public function stats(ZG $tg): void
    {
        // Используем $this->db
        $count = $this->db->query("SELECT count(*) FROM games")->fetchColumn();
        $tg->msg("Всего игр сыграно: $count")->send();
    }
}
```

---

## Ручная регистрация (`registerControllers`)

Если вы не хотите сканировать папки (например, у вас сложная модульная архитектура или всего один контроллер), вы можете передать массив классов вручную.

```php
use App\Controllers\StartController;
use App\Modules\Shop\ShopController;

$bot->attributes()->registerControllers([
    StartController::class,
    ShopController::class, // Контроллер из другого модуля
]);
```

## Справочник Атрибутов
Все атрибуты находятся в пространстве имен `ZenithGram\ZenithGram\Attributes`.

### Основные команды
| Атрибут           | Описание                                 | Пример                        |
|:------------------|:-----------------------------------------|:------------------------------|
| `#[OnStart]`      | Команда `/start`                         |                               |
| `#[OnBotCommand]` | Системные команды (`/help`, `/settings`) | `#[OnBotCommand('/help')]`    |
| `#[OnCommand]`    | Кастомные команды с параметрами          | `#[OnCommand('!ban {user}')]` |

### Текст и Регулярные выражения
| Атрибут         | Описание                    | Пример                           |
|:----------------|:----------------------------|:---------------------------------|
| `#[OnText]`     | Точное совпадение текста    | `#[OnText('О нас')]`             |
| `#[OnTextPreg]` | Регулярное выражение (PCRE) | `#[OnTextPreg('/^ID: (\d+)$/')]` |
| `#[OnMessage]`  | Fallback для любого текста  |                                  |

### Кнопки и Callbacks
| Атрибут             | Описание                                   | Пример                              |
|:--------------------|:-------------------------------------------|:------------------------------------|
| `#[Btn]`            | Обработка и регистрация кнопки             | `#[Btn('btn_id', 'Текст')]`         |
| `#[OnCallback]`     | Inline-кнопка (статичная или с параметром) | `#[OnCallback('buy_{item_id}')]`    |
| `#[OnCallbackPreg]` | Inline-кнопка (Regex)                      | `#[OnCallbackPreg('/^page_\d+$/')]` |

### События и Состояния
| Атрибут              | Описание                   | Пример                    |
|:---------------------|:---------------------------|:--------------------------|
| `#[OnState]`         | Активный шаг диалога (FSM) | `#[OnState('wait_name')]` |
| `#[OnPhoto]`         | Получено фото              |                           |
| `#[OnNewChatMember]` | Вход участника в чат       |                           |

## Особенности атрибута `#[Btn]`
Атрибут `#[Btn]` уникален тем, что принимает **два аргумента**:
1. `$id` (обязательный) — Уникальный идентификатор кнопки.
2. `$text` (опциональный) — Текст на кнопке.

### Сценарий 1: Кнопка с текстом
Идеально для меню. Вы задаете текст прямо в атрибуте.
```php
// Регистрируем: ID='profile', Текст='👤 Профиль'
#[Btn('profile', '👤 Профиль')]
public function showProfile(ZG $tg) { ... }

// Использование в коде (достаточно указать только ID):
$tg->msg('Меню')->kbd([['profile']])->send();
```

### Сценарий 2: Кнопка без текста
Если текст не указан, он будет равен ID. Удобно для простых кнопок.

```php
#[Btn('Отмена')]
public function cancel(ZG $tg) { ... }

// Использование:
$tg->msg('...')->kbd([['Отмена']])->send();
```

## Производительность и Кеширование
Операции с атрибутами (Reflection API) и сканирование диска — ресурсоемкие задачи. Чтобы бот работал мгновенно в продакшене, **обязательно используйте кеш**.

```php
use ZenithGram\ZenithGram\Utils\SimpleFileCache;

// 1. Подключаем кеш
$cache = new SimpleFileCache(__DIR__ . '/storage/cache');
$bot->setCache($cache);

// 2. Сканируем
$bot->attributes()->scanDirectory(...);
```

**Как это работает с кешем:**
1. При первом запуске бот просканирует папку и все файлы. Это займет ~10-50мс.
2. Результат сохранится в файл кеша.
3. При всех последующих запусках (например, на каждый вебхук) бот будет загружать карту маршрутов из кеша мгновенно, не обращаясь к диску.

::: warning Важно при разработке
Если вы добавили новый метод или изменили атрибут, а бот "не видит" изменений — **удалите папку с кешем** вручную.
:::