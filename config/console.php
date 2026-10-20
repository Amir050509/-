<?php

return [
    'id' => 'krug-social-console',
    'basePath' => dirname(__DIR__),
    'controllerNamespace' => 'app\commands',
    'components' => [
        'cache' => ['class' => yii\caching\FileCache::class],
        'log' => ['targets' => [['class' => yii\log\FileTarget::class, 'levels' => ['error', 'warning']]]],
    ],
];
