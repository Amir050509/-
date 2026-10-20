<?php

return [
    'id' => 'krug-social',
    'basePath' => dirname(__DIR__),
    'defaultRoute' => 'site/index',
    'components' => [
        'request' => [
            'cookieValidationKey' => getenv('YII_COOKIE_VALIDATION_KEY') ?: 'dev-only-change-YII_COOKIE_VALIDATION_KEY',
        ],
        'cache' => ['class' => yii\caching\FileCache::class],
        'errorHandler' => ['errorAction' => 'site/error'],
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'enableStrictParsing' => false,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [['class' => yii\log\FileTarget::class, 'levels' => ['error', 'warning']]],
        ],
    ],
    'params' => ['siteName' => 'Круг'],
];
