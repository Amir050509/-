<?php

return [
    'class' => yii\db\Connection::class,
    'dsn' => 'sqlite:' . dirname(__DIR__) . '/runtime/krug.sqlite',
    'charset' => 'utf8',
];
