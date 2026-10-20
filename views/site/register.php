<?php
/** @var yii\web\View $this */
/** @var app\models\RegisterForm $model */
use yii\helpers\Html;

$this->title = 'Регистрация — Круг';
?>
<main class="auth-page">
    <a class="auth-brand" href="<?= Html::encode(Yii::$app->homeUrl) ?>"><span class="brand-mark">к</span><span>круг</span></a>
    <section class="auth-card" aria-labelledby="auth-title">
        <p class="auth-kicker">СВОИ ЛЮДИ РЯДОМ</p>
        <h1 id="auth-title">Создать аккаунт</h1>
        <p class="auth-intro">Присоединяйтесь к своему кругу общения.</p>
        <?= Html::beginForm(['site/register'], 'post', ['id' => 'register-form', 'autocomplete' => 'on']) ?>
            <div class="form-group <?= $model->hasErrors('displayName') ? 'has-error' : '' ?>">
                <?= Html::activeLabel($model, 'displayName') ?>
                <?= Html::activeInput('text', $model, 'displayName', ['class' => 'auth-input', 'autocomplete' => 'name', 'autofocus' => true, 'maxlength' => 60]) ?>
                <div class="help-block"><?= Html::error($model, 'displayName') ?></div>
            </div>
            <div class="form-group <?= $model->hasErrors('email') ? 'has-error' : '' ?>">
                <?= Html::activeLabel($model, 'email') ?>
                <?= Html::activeInput('email', $model, 'email', ['class' => 'auth-input', 'autocomplete' => 'email', 'maxlength' => 255]) ?>
                <div class="help-block"><?= Html::error($model, 'email') ?></div>
            </div>
            <div class="form-group <?= $model->hasErrors('password') ? 'has-error' : '' ?>">
                <?= Html::activeLabel($model, 'password') ?>
                <?= Html::activePasswordInput($model, 'password', ['class' => 'auth-input', 'autocomplete' => 'new-password', 'maxlength' => 72]) ?>
                <small class="hint-block">Не менее 8 символов</small>
                <div class="help-block"><?= Html::error($model, 'password') ?></div>
            </div>
            <?php if ($model->inviteRequired()): ?>
                <div class="form-group <?= $model->hasErrors('inviteCode') ? 'has-error' : '' ?>">
                    <?= Html::activeLabel($model, 'inviteCode') ?>
                    <?= Html::activeInput('text', $model, 'inviteCode', ['class' => 'auth-input', 'autocomplete' => 'one-time-code', 'required' => true]) ?>
                    <small class="hint-block">Регистрация доступна только по приглашению.</small>
                    <div class="help-block"><?= Html::error($model, 'inviteCode') ?></div>
                </div>
            <?php endif; ?>
            <?= Html::submitButton('Зарегистрироваться', ['class' => 'button button-primary auth-submit']) ?>
        <?= Html::endForm() ?>
        <p class="auth-switch">Уже есть аккаунт? <?= Html::a('Войти', ['site/login']) ?></p>
    </section>
    <p class="auth-footnote">Регистрируясь, вы создаёте личный аккаунт в «Круге».</p>
</main>
