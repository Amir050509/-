<?php
/** @var yii\web\View $this */
use yii\helpers\Html;

$this->title = 'Круг — люди рядом';
$weekdays = ['ВОСКРЕСЕНЬЕ', 'ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА'];
$months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
$today = $weekdays[(int) date('w')] . ', ' . date('j') . ' ' . mb_strtoupper($months[(int) date('n') - 1], 'UTF-8');
$avatar = static function (string $initials, string $tone = 'lavender', string $extra = ''): string {
    return '<span class="avatar ' . Html::encode($tone) . ' ' . Html::encode($extra) . '">' . Html::encode($initials) . '</span>';
};
$icon = static function (string $name, string $extra = ''): string {
    $paths = [
        'home' => '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
        'users' => '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
        'bookmark' => '<path d="M6 4h12v17l-6-4-6 4z"/>',
        'calendar' => '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
        'settings' => '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.6-1.4-2.4L8 15a8 8 0 0 1 0-1.8l-1.4-1.1L8 9.7l1.7.6a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1 0 1.8Z"/>',
        'search' => '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
        'bell' => '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
        'plus' => '<path d="M12 5v14M5 12h14"/>',
        'image' => '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
        'smile' => '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
        'send' => '<path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/>',
        'heart' => '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
        'comment' => '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
        'share' => '<path d="M12 16V3m0 0L7 8m5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
        'more' => '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
        'sparkles' => '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 14l1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14ZM5 2l.8 2.2L8 5l-2.2.8L5 8l-.8-2.2L2 5l2.2-.8L5 2Z"/>',
        'close' => '<path d="m18 6-12 12M6 6l12 12"/>',
        'arrow' => '<path d="M7 17 17 7M7 7h10v10"/>',
    ];
    return '<svg class="icon ' . Html::encode($extra) . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . ($paths[$name] ?? '') . '</svg>';
};
?>
<div class="app-shell">
    <a class="skip-link" href="#main-content">Перейти к ленте</a>
    <header class="topbar">
        <a href="#main-content" class="brand" data-nav="home" aria-label="Круг — главная"><span class="brand-mark">к</span><span>круг</span></a>
        <label class="search-box" aria-label="Поиск по публикациям"><?= $icon('search') ?><input id="global-search" type="search" aria-label="Поиск по публикациям" placeholder="Найти людей, идеи, места…" autocomplete="off"><kbd>⌘ K</kbd></label>
        <div class="top-actions">
            <button class="icon-button" type="button" data-action="notifications" aria-label="Уведомления"><?= $icon('bell') ?><i class="notification-dot"></i></button>
            <button class="profile-trigger" type="button" data-action="profile" aria-label="Открыть профиль"><?= $avatar('АН', 'peach') ?><span class="profile-chevron">⌄</span></button>
        </div>
    </header>

    <div class="page-grid">
        <aside class="left-sidebar">
            <div class="side-profile"><?= $avatar('АН', 'peach', 'avatar-large') ?><div><strong>Александра Новикова</strong><span>@alex.n</span></div><button class="icon-button tiny" data-action="profile" aria-label="Настроить профиль"><?= $icon('more') ?></button></div>
            <nav class="main-nav" aria-label="Главное меню">
                <button class="nav-item active" data-nav="home" aria-current="page"><?= $icon('home') ?><span>Моя лента</span></button>
                <button class="nav-item" data-nav="friends"><?= $icon('users') ?><span>Друзья</span><span class="nav-count">4</span></button>
                <button class="nav-item" data-nav="saved"><?= $icon('bookmark') ?><span>Сохранённое</span></button>
                <button class="nav-item" data-nav="events"><?= $icon('calendar') ?><span>События</span><span class="nav-count soft">2</span></button>
            </nav>
            <div class="sidebar-section"><div class="section-heading"><span>ВАШИ КРУГИ</span><button class="plain-icon" data-action="new-circle" aria-label="Создать круг"><?= $icon('plus') ?></button></div>
                <button class="circle-link" data-filter="Все"><i class="circle-dot dot-purple"></i>Все публикации</button>
                <button class="circle-link" data-filter="Друзья"><i class="circle-dot dot-green"></i>Близкие</button>
                <button class="circle-link" data-filter="Дизайн"><i class="circle-dot dot-orange"></i>Дизайн-сообщество</button>
                <button class="circle-link" data-filter="Путешествия"><i class="circle-dot dot-blue"></i>Путешествия</button>
                <button class="circle-link muted-link" data-action="new-circle"><?= $icon('plus') ?>Добавить круг</button>
            </div>
            <div class="sidebar-bottom"><div class="sidebar-tip"><span class="tip-icon"><?= $icon('sparkles') ?></span><strong>Твой круг — твои правила</strong><p>Делись моментами с теми, кто действительно рядом.</p><button data-action="settings">Настроить приватность <span>→</span></button></div><div class="sidebar-legal"><a href="#about" data-action="about">О проекте</a><span>·</span><a href="#help" data-action="help">Помощь</a><span>·</span><span>© 2025 Круг</span></div></div>
        </aside>

        <main class="feed-column" id="main-content">
            <div class="welcome-row"><div><p class="eyebrow"><?= Html::encode($today) ?></p><h1>Привет, Саша <span class="wave" aria-hidden="true">✳</span></h1><p class="welcome-subtitle">Хороший день, чтобы быть на связи.</p></div><button class="button button-soft" data-action="theme" aria-label="Переключить цветовую тему" aria-pressed="false"><?= $icon('sparkles') ?><span class="theme-label">Ночной режим</span></button></div>
            <section class="stories-block" aria-label="Истории"><div class="stories-heading"><h2>Истории</h2><button class="text-button" data-action="all-stories">Все истории <span>→</span></button></div><div class="stories-row" id="stories-row">
                <button class="story-item add-story" data-action="story"><span class="story-ring own-story"><?= $avatar('АН', 'peach') ?><i aria-hidden="true">+</i></span><span>Ваша история</span></button>
                <button class="story-item" data-story="Лиза"><span class="story-ring ring-pink"><?= $avatar('ЛК', 'pink') ?></span><span>Лиза</span></button>
                <button class="story-item" data-story="Миша"><span class="story-ring ring-yellow"><?= $avatar('МП', 'yellow') ?></span><span>Миша</span></button>
                <button class="story-item" data-story="Катя"><span class="story-ring ring-blue"><?= $avatar('КВ', 'blue') ?></span><span>Катя</span></button>
                <button class="story-item" data-story="Даня"><span class="story-ring ring-green"><?= $avatar('ДБ', 'green') ?></span><span>Даня</span></button>
                <button class="story-item" data-story="Ника"><span class="story-ring ring-purple"><?= $avatar('НЗ', 'lavender') ?></span><span>Ника</span></button>
            </div></section>

            <section class="composer card"><div class="composer-top"><?= $avatar('АН', 'peach') ?><button class="composer-prompt" data-action="focus-composer">Что у тебя нового, Саша?</button></div><textarea id="post-input" rows="2" maxlength="500" placeholder="Поделись мыслью или моментом…" aria-label="Текст новой публикации"></textarea><div class="composer-bottom"><div class="composer-tools"><button class="tool-button" data-action="attach-photo"><?= $icon('image') ?><span>Фото</span></button><button class="tool-button" data-action="emoji"><?= $icon('smile') ?><span>Настроение</span></button><button class="audience-button" data-action="audience"><span class="audience-dot"></span>Друзья <span class="down-caret">⌄</span></button></div><button class="button button-primary" id="publish-post" disabled>Опубликовать <?= $icon('send') ?></button></div><div id="attachment-preview" class="attachment-preview" hidden></div></section>

            <div class="feed-heading"><div><h2>Твоя лента</h2><span id="feed-caption">Всё самое интересное от друзей</span></div><button class="sort-button" data-action="sort">Сначала новое <span>⌄</span></button></div>
            <div class="filter-chips" id="filter-chips" role="group" aria-label="Фильтр публикаций"><button class="filter-chip selected" data-filter="Все" aria-pressed="true">Все</button><button class="filter-chip" data-filter="Друзья" aria-pressed="false">Друзья</button><button class="filter-chip" data-filter="Дизайн" aria-pressed="false">Дизайн</button><button class="filter-chip" data-filter="Путешествия" aria-pressed="false">Путешествия</button></div>
            <section class="post-list" id="post-list" aria-live="polite">
                <article class="post-card card" data-post-id="post-1" data-category="Дизайн" data-author="Катя Власова" data-search="катя интерьер керамика дом дизайн" data-created="3">
                    <header class="post-header"><?= $avatar('КВ', 'blue') ?><div class="post-author"><strong>Катя Власова <span class="verified">✳</span></strong><span>@katya.vlasova · 2 ч назад</span></div><button class="plain-icon post-menu" data-action="post-menu" aria-label="Ещё действия"><?= $icon('more') ?></button></header>
                    <div class="post-copy"><p>Маленькие детали делают дом домом 🏡 Нашла на выходных эту керамику на маркете и теперь не могу перестать переставлять её по полкам.</p><p>А у вас есть вещь, без которой не представляете свой уют?</p><div class="post-tags"><a href="#design" data-tag="дизайн">#дом</a> <a href="#design" data-tag="дизайн">#маленькиерадости</a></div></div>
                    <div class="photo-grid"><div class="post-photo photo-ceramics" role="img" aria-label="Керамическая ваза на полке"><span class="sun-shape"></span><span class="vase vase-one"></span><span class="vase vase-two"></span><span class="plant-stem"></span><span class="photo-caption">slow mornings<br><small>stay a little longer</small></span></div><div class="post-photo photo-still-life" role="img" aria-label="Уютный домашний интерьер"><span class="still-window"></span><span class="still-chair"></span><span class="still-plant"></span></div></div>
                    <div class="post-stats"><span class="reaction-stack"><i>♥</i><i>✦</i></span><span class="like-count">24 реакции</span><button data-action="comments-scroll">8 комментариев</button></div>
                    <div class="post-actions"><button class="post-action like-action" data-action="like" aria-pressed="false"><?= $icon('heart') ?><span>Нравится</span></button><button class="post-action" data-action="comment"><?= $icon('comment') ?><span>Комментировать</span></button><button class="post-action" data-action="share"><?= $icon('share') ?><span>Поделиться</span></button><button class="post-action save-action" data-action="save" aria-label="Сохранить" aria-pressed="false"><?= $icon('bookmark') ?></button></div>
                    <div class="comments-preview" data-comments><div class="comment-row"><?= $avatar('ЛК', 'pink', 'avatar-xs') ?><p><strong>Лиза Ким</strong> такая нежность! 🤍</p><button data-action="like-comment">♡</button></div><button class="show-comments" data-action="comments">Показать все 8 комментариев</button><div class="comment-composer"><?= $avatar('АН', 'peach', 'avatar-xs') ?><input type="text" maxlength="240" placeholder="Написать комментарий…" aria-label="Комментарий"><button data-action="submit-comment" aria-label="Отправить комментарий"><?= $icon('send') ?></button></div></div>
                </article>
                <article class="post-card card" data-post-id="post-2" data-category="Путешествия" data-author="Миша Петров" data-search="миша море путешествие закат выходные" data-created="2">
                    <header class="post-header"><?= $avatar('МП', 'yellow') ?><div class="post-author"><strong>Миша Петров</strong><span>@misha.petrov · 4 ч назад</span></div><button class="plain-icon post-menu" data-action="post-menu" aria-label="Ещё действия"><?= $icon('more') ?></button></header>
                    <div class="post-copy"><p>Уехали на выходные к морю и совершенно случайно остались до заката. Иногда лучшие планы — те, которых не было ✨</p><div class="post-tags"><a href="#travel" data-tag="путешествия">#выходные</a> <a href="#travel" data-tag="путешествия">#у_моря</a></div></div>
                    <div class="post-photo photo-sea" role="img" aria-label="Закат на море"><div class="sea-sun"></div><div class="sea-horizon"></div><div class="sea-reflection"></div><span class="sea-caption">somewhere by the sea</span></div>
                    <div class="post-stats"><span class="reaction-stack"><i>♥</i><i>☀</i></span><span class="like-count">16 реакций</span><button data-action="comments-scroll">3 комментария</button></div>
                    <div class="post-actions"><button class="post-action like-action" data-action="like" aria-pressed="false"><?= $icon('heart') ?><span>Нравится</span></button><button class="post-action" data-action="comment"><?= $icon('comment') ?><span>Комментировать</span></button><button class="post-action" data-action="share"><?= $icon('share') ?><span>Поделиться</span></button><button class="post-action save-action" data-action="save" aria-label="Сохранить" aria-pressed="false"><?= $icon('bookmark') ?></button></div>
                    <div class="comments-preview" data-comments><div class="comment-composer"><?= $avatar('АН', 'peach', 'avatar-xs') ?><input type="text" maxlength="240" placeholder="Написать комментарий…" aria-label="Комментарий"><button data-action="submit-comment" aria-label="Отправить комментарий"><?= $icon('send') ?></button></div></div>
                </article>
            </section>
            <div class="empty-state" id="empty-state" hidden><span class="empty-emoji">◡̈</span><strong>Здесь пока пусто</strong><p>Попробуй другой фильтр или загляни позже.</p><button class="button button-soft" data-nav="home">Показать всю ленту</button></div>
            <button class="load-more" data-action="load-more">Показать ещё публикации <span>✳</span></button>
        </main>

        <aside class="right-sidebar">
            <section class="right-card birthday-card"><div class="right-card-heading"><span class="right-icon birthday-icon">✳</span><span>Не забудь поздравить</span><button class="plain-icon" data-action="birthday-more" aria-label="Ещё"><?= $icon('more') ?></button></div><div class="birthday-row"><?= $avatar('ДБ', 'green') ?><div><strong>Даня Белый</strong><span>Сегодня день рождения 🎂</span></div></div><button class="button birthday-button" data-action="birthday">Написать поздравление</button></section>
            <section class="right-card friends-card"><div class="right-card-heading"><span>Люди, которых ты знаешь</span><button class="text-button" data-nav="friends">Все</button></div><div class="friend-suggestion" data-friend="Ника Зорина"><?= $avatar('НЗ', 'lavender') ?><div class="friend-details"><strong>Ника Зорина</strong><span>5 общих друзей</span></div><button class="follow-button" data-action="follow" aria-label="Добавить Нику">+</button></div><div class="friend-suggestion" data-friend="Даня Белый"><?= $avatar('ДБ', 'green') ?><div class="friend-details"><strong>Даня Белый</strong><span>Из дизайн-сообщества</span></div><button class="follow-button" data-action="follow" aria-label="Добавить Даню">+</button></div><div class="friend-suggestion" data-friend="Лиза Ким"><?= $avatar('ЛК', 'pink') ?><div class="friend-details"><strong>Лиза Ким</strong><span>Учились вместе</span></div><button class="follow-button followed" data-action="follow" aria-label="Вы подписаны на Лизу">✓</button></div></section>
            <section class="right-card event-card"><div class="right-card-heading"><span class="right-icon event-icon">↗</span><span>Скоро рядом</span><button class="plain-icon" data-action="event-more" aria-label="Ещё"><?= $icon('more') ?></button></div><div class="event-date"><strong>29</strong><span>НОЯ</span></div><div class="event-info"><strong>Утренний кофе & скетчинг</strong><span>Сб · 11:00 · Винзавод</span><div class="attending-avatars"><?= $avatar('ЛК', 'pink', 'avatar-xxs') ?><?= $avatar('КВ', 'blue', 'avatar-xxs') ?><?= $avatar('АН', 'peach', 'avatar-xxs') ?><small>+12 идут</small></div></div><button class="event-join" data-action="join-event">Пойду</button></section>
            <section class="quote-card"><span class="quote-mark">“</span><p>Близость — это когда можно быть собой и всё равно чувствовать связь.</p><span class="quote-author">из журнала «рядом»</span><span class="quote-spark">✳</span></section>
            <div class="right-legal"><a href="#privacy" data-action="privacy">Конфиденциальность</a><a href="#terms" data-action="terms">Условия</a><span>Сделано с теплом <i>♥</i></span></div>
        </aside>
    </div>
    <nav class="mobile-nav" aria-label="Мобильное меню"><button class="active" data-nav="home" aria-current="page"><?= $icon('home') ?><span>Лента</span></button><button data-nav="friends"><?= $icon('users') ?><span>Друзья</span></button><button data-action="focus-composer" class="mobile-create" aria-label="Создать публикацию"><?= $icon('plus') ?></button><button data-nav="saved"><?= $icon('bookmark') ?><span>Сохранено</span></button><button data-action="profile"><?= $avatar('АН', 'peach', 'avatar-xs') ?><span>Профиль</span></button></nav>

    <div class="toast" id="toast" role="status" aria-live="polite"></div>
    <div class="modal-backdrop" id="modal-backdrop" hidden><section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close" id="modal-close" type="button" data-action="close-modal" aria-label="Закрыть окно"><?= $icon('close') ?></button><div id="modal-content"></div></section></div>
</div>
