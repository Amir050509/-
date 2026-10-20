<?php

namespace app\models;

use Yii;
use yii\base\Model;

class LoginForm extends Model
{
    public $email = '';
    public $password = '';
    private ?User $_user = null;

    public function rules(): array
    {
        return [
            [['email', 'password'], 'required'],
            ['email', 'trim'],
            ['email', 'email'],
            ['password', 'validateCredentials'],
        ];
    }

    public function attributeLabels(): array
    {
        return ['email' => 'Электронная почта', 'password' => 'Пароль'];
    }

    public function validateCredentials(string $attribute): void
    {
        if ($this->hasErrors()) {
            return;
        }

        $user = User::findByEmail((string) $this->email);
        if ($user === null || !$user->validatePassword((string) $this->password)) {
            $this->addError('password', 'Проверьте почту и пароль.');
            return;
        }

        $this->_user = $user;
    }

    public function login(): bool
    {
        return $this->validate()
            && $this->_user !== null
            && Yii::$app->user->login($this->_user);
    }
}
