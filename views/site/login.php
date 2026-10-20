<?php
/** @var yii\web\View $this */
/** @var app\models\LoginForm $model */
use yii\helpers\Html;

$this->title = 'Вход — Круг';
?>
<main class="auth-page">
    <a class="auth-brand" href="<?= Html::encode(Yii::$app->homeUrl) ?>"><span class="brand-mark">к</span><span>круг</span></a>
    <section class="auth-card" aria-labelledby="auth-title">
        <p class="auth-kicker">РАДЫ ВАС ВИДЕТЬ</p>
        <h1 id="auth-title">С возвращением</h1>
        <p class="auth-intro">Войдите в аккаунт, чтобы продолжить общение в своём круге.</p>
        <?= Html::beginForm(['site/login'], 'post', ['id' => 'login-form', 'autocomplete' => 'on']) ?>
            <div class="form-group <?= $model->hasErrors('email') ? 'has-error' : '' ?>">
                <?= Html::activeLabel($model, 'email') ?>
                <?= Html::activeInput('email', $model, 'email', ['class' => 'auth-input', 'autocomplete' => 'email', 'autofocus' => true]) ?>
                <div class="help-block"><?= Html::error($model, 'email') ?></div>
            </div>
            <div class="form-group <?= $model->hasErrors('password') ? 'has-error' : '' ?>">
                <?= Html::activeLabel($model, 'password') ?>
                <?= Html::activePasswordInput($model, 'password', ['class' => 'auth-input', 'autocomplete' => 'current-password']) ?>
                <div class="help-block"><?= Html::error($model, 'password') ?></div>
            </div>
            <?= Html::submitButton('Войти', ['class' => 'button button-primary auth-submit']) ?>
        <?= Html::endForm() ?>
        <p class="auth-switch">Впервые здесь? <?= Html::a('Создать аккаунт', ['site/register']) ?></p>
    </section>
    <p class="auth-footnote">Ваш пароль хранится в базе только в защищённом виде.</p>
</main>
