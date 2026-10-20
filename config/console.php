<?php

return [
    'id' => 'krug-social-console',
    'basePath' => dirname(__DIR__),
    'controllerNamespace' => 'app\commands',
    'components' => [
        'db' => require __DIR__ . '/db.php',
        'cache' => ['class' => yii\caching\FileCache::class],
        'log' => ['targets' => [['class' => yii\log\FileTarget::class, 'levels' => ['error', 'warning']]]],
    ],
];
