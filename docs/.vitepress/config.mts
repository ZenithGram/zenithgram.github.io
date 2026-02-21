import {defineConfig} from 'vitepress'
// @ts-ignore
import llmstxt from 'vitepress-plugin-llms'
// @ts-ignore
import {copyFileSync} from 'node:fs'
// @ts-ignore
import {join, resolve} from 'node:path'
import path from 'path'
import fs from 'fs' // Импортируем модуль для работы с файлами

import { optimizeLlmsFile } from './scripts/optimize-llms.mjs'

export default defineConfig({
    vite: {
        plugins: [
            llmstxt({
                // 1. Домен сайта (обязательно для абсолютных ссылок)
                domain: 'https://zenithgram.github.io', //потом можно убрать, когда будет в корне

                // 2. Какие файлы генерировать
                generateLLMsTxt: true,      // Создать llms.txt
                generateLLMsFullTxt: true,  // Создать llms-full.txt
                generateLLMFriendlyDocsForEachPage: true, // Создать .md копии страниц

                // 3. Список игнорируемых файлов
                ignoreFiles: [
                    '**/json/**',
                    '**/main.md',
                    'index.md',
                    '**index.md',
                    '**/index.md',
                    '**/install/who_zenith.md',
                    '**/install/who_zenith.md',
                    '**/install/requirements.md',
                    '**/classes/inlineMethods/fileId.md',
                    '**/classes/zenithMethods/buttons.md',
                    '**/classes/zenithMethods/initVars.md',
                    '**/install/create_bot.md',
                    '**/404.md'
                ],

                // 4. Опции исключения "мусорных" страниц (экономия токенов)
                excludeUnnecessaryFiles: true, // Включить фильтрацию
                excludeIndexPage: false,       // Оставить главную страницу (index.md)
                excludeBlog: true,             // Убрать блог (если есть)
                excludeTeam: true,             // Убрать страницу команды

                // 5. Очистка HTML (рекомендуется)
                stripHTML: true,

                // 6. Скрытая подсказка для LLM внутри HTML страниц
                injectLLMHint: true,

                // 7. Кастомный шаблон для llms.txt (опционально, если хотите изменить порядок)
                customLLMsTxtTemplate: `# {title}

{description}

## Table of Contents

{toc}
`,
                customTemplateVariables: {
                    title: 'ZenithGram Library Documentation',
                    description: 'Powerful PHP library for creating Telegram bots with Webhook & LongPoll support',
                }
            })
        ]
    },

    lang: 'ru-RU',
    title: "ZenithGram",
    description: "Документация библиотеки ZenithGram",
    base: "/",
    cleanUrls: true,
    appearance: 'dark',
    lastUpdated: true,

    sitemap: {
        hostname: 'https://zenithgram.github.io'
    },

    head: [
        ['link', { rel: 'icon', href: '/favicon.svg', type: "image/svg+xml"}],
        ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
        ['link', { rel: 'icon', href: '/favicon.png', type: 'image/png' }],
        ['link', { rel: 'apple-touch-icon', href: '/pwa-192x192.png' }], // Опционально, для мобилок

        // --- SEO И ВЕРИФИКАЦИЯ ---
        ['meta', {name: 'google-site-verification', content: 'fto1NgMl4Hv1cWWwLcif8VREaTyVJ7wWlAcG807mlCs'}],
        ['meta', {name: 'yandex-verification', content: '8eaa8135ce653a42'}],

        // --- OPEN GRAPH (для красивых ссылок в Telegram/VK/Discord) ---
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:title', content: 'ZenithGram - Библиотека для Telegram' }],
        ['meta', { property: 'og:site_name', content: 'ZenithGram Documentation' }],
        ['meta', { property: 'og:description', content: 'Простая, но мощная библиотека на PHP для создания ботов. Быстрый старт и понятная документация' }],

        ['meta', { property: 'og:image', content: 'https://zenithgram.github.io/og-image.png' }], // Сделайте красивую картинку-баннер 1200x630
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }]

    ],

    // @ts-ignore
    async buildEnd(siteConfig) {
        const outDir = siteConfig.outDir
        // @ts-ignore
        const rootDir = process.cwd()
        const filesToCopy = ['llms.txt', 'llms-full.txt']

        console.log('🔄 Starting post-processing...')

        for (const fileName of filesToCopy) {
            const sourcePath = resolve(outDir, fileName)
            const destinationPath = join(rootDir, fileName)

            try {
                if (fileName === 'llms-full.txt') {
                    const rawRootPath = join(rootDir, 'llms-full-raw.txt')
                    copyFileSync(sourcePath, rawRootPath)
                    console.log(`✅ Created ROOT raw file: ${rawRootPath}`)

                    const rawDistPath = join(outDir, 'llms-full-raw.txt')
                    copyFileSync(sourcePath, rawDistPath)
                    console.log(`✅ Created DIST raw file: ${rawDistPath}`)

                    console.log(`🛠️ Optimizing ${fileName} in dist...`)
                    optimizeLlmsFile(sourcePath);
                }

                copyFileSync(sourcePath, destinationPath)
                console.log(`✅ Copied: ${fileName} to ${destinationPath}`)
            } catch (e) {
                console.error(`❌ ERROR processing ${fileName}:`, e.message)
            }
        }

        const sitemapPath = path.resolve(siteConfig.outDir, 'sitemap.xml')
        if (fs.existsSync(sitemapPath)) {
            const content = fs.readFileSync(sitemapPath, 'utf8')
            if (content.startsWith('\n') || content.startsWith(' ')) {
                const fixedContent = content.trimStart()
                fs.writeFileSync(sitemapPath, fixedContent)
                console.log('✅ Sitemap.xml fixed: лишняя пустая строка удалена.')
            }
        }
    },


    themeConfig: {

        editLink: {
            pattern: 'https://github.com/ZenithGram/zenithgram.github.io/edit/main/docs/:path',
            text: 'Редактировать страницу'
        },

        outline: {label: 'Содержание страницы'},

        docFooter: {
            prev: 'Предыдущая страница',
            next: 'Следующая страница'
        },

        lastUpdated: {
            text: 'Обновлено'
        },

        darkModeSwitchLabel: 'Оформление',
        lightModeSwitchTitle: 'Переключить на светлую тему',
        darkModeSwitchTitle: 'Переключить на тёмную тему',
        sidebarMenuLabel: 'Меню',
        returnToTopLabel: 'Вернуться к началу',
        langMenuLabel: 'Изменить язык',
        skipToContentLabel: 'Перейти к содержимому',

        socialLinks: [
            {icon: 'github', link: 'https://github.com/ZenithGram/php-telegram-bot-library'},
        ],

        search: {
            provider: 'local',
            options: {
                translations: {
                    button: {
                        buttonText: 'Поиск',
                        buttonAriaLabel: 'Поиск',
                    },
                    modal: {
                        noResultsText: 'Нет результатов для',
                        resetButtonTitle: 'Очистить запрос',
                        footer: {
                            selectText: 'выбрать',
                            navigateText: 'перейти',
                            closeText: 'закрыть',
                        },
                    },
                },
            }
        },

        sidebar: [
            {
                text: 'Начало работы',
                collapsed: false,
                items: [
                    {text: 'Почему ZenithGram?', link: '/install/who_zenith'},
                    {text: 'Установка и подключение', link: '/install/requirements'},
                    {text: 'Создание бота в TG', link: '/install/create_bot'},
                    {text: 'Примеры ботов', link: '/install/examples'},
                ]
            },
            {
                text: 'Использование',
                link: '/using/main',
                collapsed: false,
                items: [
                    {text: 'Получение обновлений', link: '/using/getting-updates'},
                    {text: 'Конструктор сообщений', link: '/using/messages'},
                    {text: 'Обработчики', link: '/using/handlers'},
                    {text: 'Атрибуты и Контроллеры', link: '/using/attributes'},
                    {text: 'Топики', link: '/using/topic'},
                    {text: 'Диалоги FSM', link: '/using/fsm'},
                    {text: 'Внедрение зависимостей', link: '/using/reflection'},
                    {text: 'Middleware', link: '/using/middleware'},
                    {text: 'Пагинация страниц', link: '/using/pagination'},
                    {text: 'Обработка ошибок', link: '/using/errorHandler'},
                    {text: 'Конструктор опросов', link: '/using/poll'},
                ]
            },
            {
                text: 'Классы',
                collapsed: false,
                link: '/classes/main',
                items: [
                    {
                        text: 'ZG',
                        link: '/classes/zenith',
                        collapsed: true,
                        items: [
                            {text: 'msg', link: '/classes/zenithMethods/msg'},
                            {text: 'poll', link: '/classes/zenithMethods/poll'},
                            {text: 'pagination', link: '/classes/zenithMethods/pagination'},
                            {text: 'inline', link: '/classes/zenithMethods/inline'},
                            {text: 'file', link: '/classes/zenithMethods/file'},

                            {text: 'initVars', link: '/classes/zenithMethods/initVars'},
                            {text: 'get-методы', link: '/classes/zenithMethods/get'},
                            {text: 'topic-методы', link: '/classes/zenithMethods/topic'},

                            {text: 'sendMessage', link: '/classes/zenithMethods/sendMessage'},
                            {text: 'reply', link: '/classes/zenithMethods/reply'},
                            {text: 'copyMsg', link: '/classes/zenithMethods/copyMsg'},
                            {text: 'fwdMsg', link: '/classes/zenithMethods/fwdMsg'},
                            {text: 'delMsg', link: '/classes/zenithMethods/delMsg'},
                            {text: 'pinMsg', link: '/classes/zenithMethods/pinMsg'},
                            {text: 'unpinMsg', link: '/classes/zenithMethods/unpinMsg'},
                            {text: 'sendAction', link: '/classes/zenithMethods/sendAction'},
                            {text: 'answers', link: '/classes/zenithMethods/answers'},

                            {text: 'callAPI', link: '/classes/zenithMethods/callAPI'},

                            {text: 'setStorage', link: '/classes/zenithMethods/setStorage'},
                            {text: 'getStorage', link: '/classes/zenithMethods/getStorage'},
                            {text: 'step', link: '/classes/zenithMethods/step'},
                            {text: 'endStep', link: '/classes/zenithMethods/endStep'},
                            {text: 'session', link: '/classes/zenithMethods/session'},
                        ]
                    },

                    {text: 'LongPoll', link: '/classes/longpoll'},

                    {
                        text: 'Bot',
                        link: '/classes/bot',
                        collapsed: true,
                        items: [
                            {text: 'onStart', link: '/classes/botMethods/onStart'},
                            {text: 'onBotCommand', link: '/classes/botMethods/onBotCommand'},
                            {text: 'onCommand', link: '/classes/botMethods/onCommand'},
                            {text: 'onReferral', link: '/classes/botMethods/onReferral'},

                            {text: 'onText', link: '/classes/botMethods/onText'},
                            {text: 'onTextPreg', link: '/classes/botMethods/onTextPreg'},
                            {text: 'btn', link: '/classes/botMethods/btn'},
                            {text: 'onCallback', link: '/classes/botMethods/onCallback'},
                            {text: 'onCallbackPreg', link: '/classes/botMethods/onCallbackPreg'},
                            {text: 'onInline', link: '/classes/botMethods/onInline'},

                            {text: 'onPhoto', link: '/classes/botMethods/onPhoto'},
                            {text: 'onVideo', link: '/classes/botMethods/onVideo'},
                            {text: 'onAudio', link: '/classes/botMethods/onAudio'},
                            {text: 'onVoice', link: '/classes/botMethods/onVoice'},
                            {text: 'onVideoNote', link: '/classes/botMethods/onVideoNote'},
                            {text: 'onDocument', link: '/classes/botMethods/onDocument'},
                            {text: 'onSticker', link: '/classes/botMethods/onSticker'},

                            {text: 'onNewChatMember', link: '/classes/botMethods/onNewChatMember'},
                            {text: 'onLeftChatMember', link: '/classes/botMethods/onLeftChatMember'},
                            {text: 'onEditedMessage', link: '/classes/botMethods/onEditedMessage'},

                            {text: 'onMessage', link: '/classes/botMethods/onMessage'},
                            {text: 'onDefault', link: '/classes/botMethods/onDefault'},
                            {text: 'onState', link: '/classes/botMethods/onState'},

                            {text: 'reflection', link: '/classes/botMethods/reflection'},
                            {text: 'attributes', link: '/classes/botMethods/attributes'},
                            {text: 'setCache', link: '/classes/botMethods/setCache'},
                            {text: 'setContainer', link: '/classes/botMethods/setContainer'},

                            {text: 'redirect', link: '/classes/botMethods/redirect'},
                            {text: 'middleware', link: '/classes/botMethods/middleware'},
                            {text: 'setStorage', link: '/classes/botMethods/setStorage'},
                            {text: 'zg', link: '/classes/botMethods/zg'},
                            {text: 'run', link: '/classes/botMethods/run'},
                        ]
                    },

                    {
                        text: 'Action',
                        link: '/classes/action',
                        collapsed: true,
                        items: [
                            {text: 'MessageBuilder', link: '/classes/actionMethods/messageBuilder'},
                            {text: 'func', link: '/classes/actionMethods/func'},
                            {text: 'access', link: '/classes/actionMethods/access'},
                            {text: 'noAccess', link: '/classes/actionMethods/noAccess'},
                            {text: 'middleware', link: '/classes/actionMethods/middleware'},
                            {text: 'redirect', link: '/classes/actionMethods/redirect'},
                            {text: 'query', link: '/classes/actionMethods/query'},
                        ]
                    },

                    {text: 'AttributesLoader', link: '/classes/attributesLoader'},
                    {text: 'Attribute', link: '/classes/attributes'},

                    {
                        text: 'Message',
                        link: '/classes/message',
                        collapsed: true,
                        items: [
                            {text: 'text', link: '/classes/messageMethods/text'},

                            {text: 'img', link: '/classes/messageMethods/img'},
                            {text: 'video', link: '/classes/messageMethods/video'},
                            {text: 'audio', link: '/classes/messageMethods/audio'},
                            {text: 'voice', link: '/classes/messageMethods/voice'},
                            {text: 'doc', link: '/classes/messageMethods/doc'},
                            {text: 'gif', link: '/classes/messageMethods/gif'},
                            {text: 'sticker', link: '/classes/messageMethods/sticker'},
                            {text: 'dice', link: '/classes/messageMethods/dice'},
                            {text: 'mediaPreview', link: '/classes/messageMethods/mediaPreview'},

                            {text: 'kbd', link: '/classes/messageMethods/kbd'},
                            {text: 'inlineKbd', link: '/classes/messageMethods/inlineKbd'},
                            {text: 'removeKbd', link: '/classes/messageMethods/removeKbd'},
                            {text: 'forceReply', link: '/classes/messageMethods/forceReply'},

                            {text: 'parseMode', link: '/classes/messageMethods/parseMode'},
                            {text: 'entities', link: '/classes/messageMethods/entities'},
                            {text: 'reply', link: '/classes/messageMethods/reply'},
                            {text: 'params', link: '/classes/messageMethods/params'},

                            {text: 'send', link: '/classes/messageMethods/send'},
                            {text: 'editText', link: '/classes/messageMethods/editText'},
                            {text: 'editCaption', link: '/classes/messageMethods/editCaption'},
                            {text: 'editMedia', link: '/classes/messageMethods/editMedia'},
                        ]
                    },

                    {
                        text: 'MessageDraft',
                        link: '/classes/draft',
                        collapsed: true,
                        items: [
                            {text: 'text', link: '/classes/draftMethods/text'},

                            {text: 'parseMode', link: '/classes/draftMethods/parseMode'},
                            {text: 'entities', link: '/classes/draftMethods/entities'},

                            {text: 'send', link: '/classes/draftMethods/send'},
                        ]
                    },

                    {text: 'Button', link: '/classes/button'},

                    {
                        text: 'File',
                        link: '/classes/file',
                        collapsed: true,
                        items: [
                            {text: 'getFileId', link: '/classes/fileMethods/getFileId'},
                            {text: 'getFileInfo', link: '/classes/fileMethods/getFileInfo'},
                            {text: 'getFileSize', link: '/classes/fileMethods/getFileSize'},
                            {text: 'getFilePath', link: '/classes/fileMethods/getFilePath'},
                            {text: 'save', link: '/classes/fileMethods/save'},
                        ]
                    },

                    {text: 'Storage', link: '/classes/storage'},

                    {
                        text: 'Poll',
                        link: '/classes/poll',
                        collapsed: true,
                        items: [
                            {text: 'question', link: '/classes/pollMethods/question'},
                            {text: 'addAnswers', link: '/classes/pollMethods/addAnswers'},

                            {text: 'isAnonymous', link: '/classes/pollMethods/isAnonymous'},
                            {text: 'multipleAnswers', link: '/classes/pollMethods/multipleAnswers'},
                            {text: 'openPeriod', link: '/classes/pollMethods/openPeriod'},
                            {text: 'closeDate', link: '/classes/pollMethods/closeDate'},
                            {text: 'close', link: '/classes/pollMethods/close'},
                            {text: 'parseMode', link: '/classes/pollMethods/parseMode'},

                            {text: 'correctAnswer', link: '/classes/pollMethods/correctAnswer'},
                            {text: 'explanation', link: '/classes/pollMethods/explanation'},

                            {text: 'send', link: '/classes/pollMethods/send'},
                        ]
                    },

                    {
                        text: 'Pagination',
                        link: '/classes/pagination',
                        collapsed: true,
                        items: [
                            {text: 'setItems', link: '/classes/paginationMethods/setItems'},
                            {text: 'setPerPage', link: '/classes/paginationMethods/setPerPage'},
                            {text: 'setPrefix', link: '/classes/paginationMethods/setPrefix'},
                            {text: 'setPage', link: '/classes/paginationMethods/setPage'},
                            {text: 'setColumns', link: '/classes/paginationMethods/setColumns'},
                            {text: 'setNavigationLayout', link: '/classes/paginationMethods/setNavigationLayout'},
                            {text: 'setMode', link: '/classes/paginationMethods/setMode'},
                            {text: 'setSigns', link: '/classes/paginationMethods/setSigns'},
                            {text: 'setSideSigns', link: '/classes/paginationMethods/setSideSigns'},
                            {text: 'setMaxPageBtn', link: '/classes/paginationMethods/setMaxPageBtn'},
                            {text: 'setNumberStyle', link: '/classes/paginationMethods/setNumberStyle'},
                            {text: 'setActivePageFormat', link: '/classes/paginationMethods/setActivePageFormat'},
                            {text: 'addReturnBtn', link: '/classes/paginationMethods/addReturnBtn'},
                            {text: 'addHeaderBtn', link: '/classes/paginationMethods/addHeaderBtn'},
                            {text: 'getTotalPage', link: '/classes/paginationMethods/getTotalPage'},
                            {text: 'create', link: '/classes/paginationMethods/create'},
                        ]
                    },

                    {
                        text: 'Inline',
                        link: '/classes/inline',
                        collapsed: true,
                        items: [
                            {text: 'id', link: '/classes/inlineMethods/id'},
                            {text: 'title', link: '/classes/inlineMethods/title'},
                            {text: 'description', link: '/classes/inlineMethods/description'},

                            {text: 'text', link: '/classes/inlineMethods/text'},
                            {text: 'fileUrl', link: '/classes/inlineMethods/fileUrl'},
                            {text: 'fileID', link: '/classes/inlineMethods/fileID'},
                            {text: 'mimeType', link: '/classes/inlineMethods/mimeType'},
                            {text: 'coordinates', link: '/classes/inlineMethods/coordinates'},
                            {text: 'address', link: '/classes/inlineMethods/address'},

                            {text: 'thumb', link: '/classes/inlineMethods/thumb'},
                            {text: 'kbd', link: '/classes/inlineMethods/kbd'},
                            {text: 'parseMode', link: '/classes/inlineMethods/parseMode'},
                            {text: 'params', link: '/classes/inlineMethods/params'},

                            {text: 'create', link: '/classes/inlineMethods/create'},
                        ]
                    },

                    {text: 'ErrorHandler', link: '/classes/errorhandler'},
                    {text: 'DTO', link: '/classes/dto'},
                    {text: 'Enum', link: '/classes/enum'},
                ]
            },
            {
                text: 'Примеры с обновлениями',
                link: '/json/main',
                collapsed: false,
                items: [
                    {text: 'Новое сообщение', link: '/json/message'},
                    {text: 'Новое сообщение с медиа', link: '/json/message_media'},
                    {text: 'Голосовое и видео-сообщение', link: '/json/message_voice&videoNote'},
                    {text: 'Редактирование сообщения', link: '/json/message_edit'},
                    {text: 'Обновления с чатом', link: '/json/message_chats'},
                    {text: 'Нажатие на кнопку', link: '/json/message_button'},
                ]
            },
        ],

        footer: {
            message: 'Опубликовано под лицензией MIT.',
        },
    }
})