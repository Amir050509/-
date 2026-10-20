<?php

return [
    'id' => 'krug-social',
    'basePath' => dirname(__DIR__),
    'defaultRoute' => 'site/index',
    'components' => [
        'request' => [
            'cookieValidationKey' => getenv('YII_COOKIE_VALIDATION_KEY') ?: 'dev-only-change-YII_COOKIE_VALIDATION_KEY',
        ],
        'db' => require __DIR__ . '/db.php',
        'user' => [
            'identityClass' => app\models\User::class,
            'enableAutoLogin' => false,
        ],
        'cache' => ['class' => yii\caching\FileCache::class],
        'errorHandler' => ['errorAction' => 'site/error'],
        'urlManager' => [
            'enablePrettyUrl' => true,
            // Routes work with PHP's built-in server and XAMPP without rewrite rules.
            'showScriptName' => true,
            'enableStrictParsing' => false,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [['class' => yii\log\FileTarget::class, 'levels' => ['error', 'warning']]],
        ],
    ],
    'params' => ['siteName' => 'Круг'],
];
