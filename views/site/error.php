<?php
/** @var Throwable $exception */
$this->title = 'Ошибка';
?>
<main class="error-page"><span class="brand-mark">к</span><h1>Что-то пошло не так</h1><p><?= YII_DEBUG ? htmlspecialchars($exception->getMessage(), ENT_QUOTES, 'UTF-8') : 'Попробуйте обновить страницу чуть позже.' ?></p><a class="button button-primary" href="/">На главную</a></main>
