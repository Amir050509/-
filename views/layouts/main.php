<?php
/** @var yii\web\View $this */
use yii\helpers\Html;

$this->registerCsrfMetaTags();
$this->registerMetaTag(['charset' => Yii::$app->charset]);
$this->registerMetaTag(['name' => 'viewport', 'content' => 'width=device-width, initial-scale=1']);
$this->registerMetaTag(['name' => 'theme-color', 'content' => '#f6f7f9']);
$this->registerCssFile('@web/css/app.css');
$this->registerCssFile('@web/css/design-system.css');
$this->registerCssFile('@web/css/auth.css');
if ($this->context->action->id === 'index') {
    $this->registerJsFile('@web/js/app.js', ['defer' => true]);
}
?>
<?php $this->beginPage() ?>
<!doctype html>
<html lang="ru">
<head>
    <title><?= Html::encode($this->title ?: 'Круг — люди рядом') ?></title>
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>
<?= $content ?>
<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
