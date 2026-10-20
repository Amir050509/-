<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;

class User extends ActiveRecord implements IdentityInterface
{
    public static function tableName(): string
    {
        return '{{%user}}';
    }

    public static function findIdentity($id): ?IdentityInterface
    {
        return static::findOne((int) $id);
    }

    public static function findIdentityByAccessToken($token, $type = null): ?IdentityInterface
    {
        return null;
    }

    public static function findByEmail(string $email): ?self
    {
        return static::find()->where(['email' => mb_strtolower(trim($email), 'UTF-8')])->one();
    }

    public function getId(): int
    {
        return (int) $this->id;
    }

    public function getAuthKey(): string
    {
        return (string) $this->auth_key;
    }

    public function validateAuthKey($authKey): bool
    {
        return is_string($authKey) && hash_equals($this->getAuthKey(), $authKey);
    }

    public function validatePassword(string $password): bool
    {
        return Yii::$app->security->validatePassword($password, (string) $this->password_hash);
    }
}
