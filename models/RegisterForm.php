<?php

namespace app\models;

use Yii;
use yii\base\Model;

class RegisterForm extends Model
{
    public $displayName = '';
    public $email = '';
    public $password = '';
    public $inviteCode = '';

    public function rules(): array
    {
        return [
            [['displayName', 'email', 'password'], 'required'],
            [['displayName', 'email'], 'trim'],
            ['displayName', 'string', 'min' => 2, 'max' => 60],
            ['email', 'email'],
            ['email', 'string', 'max' => 255],
            ['email', 'validateUniqueEmail'],
            ['password', 'string', 'min' => 8, 'max' => 72],
            ['inviteCode', 'validateInviteCode'],
        ];
    }

    public function attributeLabels(): array
    {
        return [
            'displayName' => 'Как вас зовут',
            'email' => 'Электронная почта',
            'password' => 'Пароль',
            'inviteCode' => 'Код приглашения',
        ];
    }

    public function inviteRequired(): bool
    {
        $code = getenv('KRUG_INVITE_CODE');
        return is_string($code) && $code !== '';
    }

    public function validateUniqueEmail(string $attribute): void
    {
        if (!$this->hasErrors($attribute) && User::findByEmail((string) $this->email) !== null) {
            $this->addError($attribute, 'Аккаунт с такой почтой уже существует.');
        }
    }

    public function validateInviteCode(string $attribute): void
    {
        $expected = getenv('KRUG_INVITE_CODE');
        if (is_string($expected) && $expected !== ''
            && !hash_equals($expected, (string) $this->inviteCode)) {
            $this->addError($attribute, 'Неверный код приглашения. Попросите актуальный код у владельца сайта.');
        }
    }

    public function register(): ?User
    {
        if (!$this->validate()) {
            return null;
        }

        $user = new User();
        $user->display_name = trim((string) $this->displayName);
        $user->email = mb_strtolower(trim((string) $this->email), 'UTF-8');
        $user->password_hash = Yii::$app->security->generatePasswordHash((string) $this->password);
        $user->auth_key = Yii::$app->security->generateRandomString(32);
        $user->created_at = time();

        return $user->save() ? $user : null;
    }
}
