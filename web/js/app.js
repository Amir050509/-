(() => {
    'use strict';

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
    const appShell = $('.app-shell');
    const accountId = appShell?.dataset.userId || 'guest';
    const STORAGE_KEY = accountId === 'guest' ? 'krug.social.v1' : 'krug.social.user.' + accountId;
    const defaults = { theme: 'light', liked: [], saved: [], followed: ['Лиза Ким'], hidden: [], circles: [], posts: [], comments: {}, commentLikes: [], joined: false, privateProfile: false, notifications: true, noticeRead: false, myStory: null, draft: '', audience: 'Друзья', loadedMore: false, displayName: appShell?.dataset.displayName || 'Александра Новикова', bio: 'Собираю красивые моменты и людей рядом ✨' };
    let state;
    try { state = { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
    catch { state = { ...defaults }; }
    ['liked', 'saved', 'followed', 'hidden', 'circles', 'commentLikes', 'posts'].forEach(key => { if (!Array.isArray(state[key])) state[key] = defaults[key]; });
    if (!['light', 'dark'].includes(state.theme)) state.theme = 'light';
    const persist = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { toast('Не удалось сохранить изменения в этом браузере'); } };
    let activeFilter = 'Все';
    let sortNewest = true;
    let selectedPhoto = '';
    let toastTimer;
    let modalTrigger = null;
    const toast = (message) => {
        const el = $('#toast');
        if (!el) return;
        el.textContent = message;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
    };
    const icon = (name) => ({
        close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m18 6-12 12M6 6l12 12"/></svg>',
        heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>',
        comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></svg>',
        bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 4h12v17l-6-4-6 4z"/></svg>',
        share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V3m0 0L7 8m5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
        send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/></svg>',
    })[name] || '';
    const safe = (value) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const commentLabel = count => `${count} ${count % 10 === 1 && count % 100 !== 11 ? 'комментарий' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'комментария' : 'комментариев'}`;

    function setTheme() {
        document.documentElement.dataset.theme = state.theme;
        $$('.theme-label').forEach(el => el.textContent = state.theme === 'dark' ? 'Дневной режим' : 'Ночной режим');
        $$('[data-action="theme"]').forEach(el => el.setAttribute('aria-pressed', String(state.theme === 'dark')));
        persist();
    }
    function openModal(markup) {
        if ($('#modal-backdrop').hidden) modalTrigger = document.activeElement;
        $('#modal-content').innerHTML = markup;
        $('#modal-backdrop').hidden = false;
        document.body.classList.add('modal-open');
        setTimeout(() => ($('.modal-card input, .modal-card textarea') || $('#modal-close'))?.focus(), 0);
    }
    function closeModal() {
        $('#modal-backdrop').hidden = true;
        document.body.classList.remove('modal-open');
        if (modalTrigger?.isConnected) modalTrigger.focus();
        modalTrigger = null;
    }
    function profileModal() {
        openModal(`<div class="modal-kicker">ТВОЯ СТРАНИЦА</div><div class="modal-profile-head"><span class="avatar peach avatar-xl">АН</span><div><h2 id="modal-title">${safe(state.displayName)}</h2><span>@alex.n · с нами с 2024</span></div></div><label class="form-label">Как тебя зовут<input id="profile-name" class="modal-input" maxlength="48" value="${safe(state.displayName)}"></label><label class="form-label">О себе<textarea id="profile-bio" class="modal-input" maxlength="160" rows="3">${safe(state.bio)}</textarea></label><button class="button button-primary modal-submit" data-action="save-profile">Сохранить профиль</button><button class="modal-link" data-action="settings">Настройки и приватность →</button>`);
    }
    function settingsModal() {
        openModal(`<div class="modal-kicker">ПРОСТРАНСТВО КРУГА</div><h2 id="modal-title">Настройки</h2><p class="modal-description">Настрой Круг так, чтобы тебе было комфортно.</p><div class="setting-row"><div><strong>Приватный профиль</strong><span>Твои публикации видят только друзья</span></div><button class="switch ${state.privateProfile ? 'on' : ''}" role="switch" aria-label="Приватный профиль" aria-checked="${state.privateProfile}" data-action="privacy-switch"><i></i></button></div><div class="setting-row"><div><strong>Уведомления</strong><span>Реакции, комментарии и события</span></div><button class="switch ${state.notifications ? 'on' : ''}" role="switch" aria-label="Уведомления" aria-checked="${state.notifications}" data-action="notification-switch"><i></i></button></div><button class="setting-row setting-theme" data-action="theme"><span><strong>Оформление</strong><span>Сейчас: ${state.theme === 'dark' ? 'тёмное' : 'светлое'}</span></span><span class="theme-preview">◐</span></button><button class="modal-option danger" data-action="reset-demo">Сбросить данные этого браузера</button><div class="modal-footnote">Демо хранит данные в этом браузере. Приватность не ограничивает доступ на сервере.</div>`);
    }
    function renderCircles() {
        const section = $('.sidebar-section');
        if (!section) return;
        $$('[data-custom-circle]', section).forEach(el => el.remove());
        state.circles.forEach(circle => {
            const button = document.createElement('button');
            button.className = 'circle-link'; button.dataset.customCircle = circle.id;
            button.innerHTML = `<i class="circle-dot dot-purple"></i>${safe(circle.name)}`;
            section.insertBefore(button, $('.muted-link'));
        });
    }
    function friendDirectoryModal() {
        const friends = $$('.friend-suggestion').map(row => row.dataset.friend);
        const rows = friends.map(name => {
            const following = state.followed.includes(name);
            return `<div class="notification-item"><span>👤</span><p><strong>${safe(name)}</strong><small>${following ? 'Уже в твоём кругу' : 'Можно добавить в друзья'}</small></p><button class="follow-button ${following ? 'followed' : ''}" data-action="friend-toggle" data-friend="${safe(name)}" aria-pressed="${following}">${following ? '✓' : '+'}</button></div>`;
        }).join('');
        openModal(`<div class="modal-kicker">ТВОЁ ОКРУЖЕНИЕ</div><h2 id="modal-title">Друзья</h2><p class="modal-description">Добавляй людей в круг и смотри их публикации в ленте.</p>${rows || '<p class="modal-description">Пока никого нет.</p>'}`);
    }
    function eventsModal() {
        const joined = state.joined;
        openModal(`<div class="modal-kicker">ВСТРЕЧИ РЯДОМ</div><h2 id="modal-title">События</h2><div class="notification-item"><span>☕</span><p><strong>Утренний кофе & скетчинг</strong><small>29 ноября · 11:00 · Винзавод</small></p><button class="event-join ${joined ? 'joined' : ''}" data-action="join-event" aria-pressed="${joined}">${joined ? 'Иду ✓' : 'Пойду'}</button></div><p class="modal-footnote">Участие сохранится в этом браузере.</p>`);
    }
    function refreshFeed() {
        const query = ($('#global-search').value || '').trim().toLocaleLowerCase('ru');
        const cards = $$('.post-card', $('#post-list'));
        const customCircle = state.circles.find(circle => circle.id === activeFilter);
        cards.forEach(card => {
            const isSavedView = activeFilter === 'Сохранённое';
            const category = card.dataset.category || '';
            const haystack = `${card.dataset.search || ''} ${card.textContent}`.toLocaleLowerCase('ru');
            const matchesCircle = customCircle ? category === customCircle.category : true;
            const visible = (!query || haystack.includes(query))
                && (isSavedView ? state.saved.includes(card.dataset.postId) : (customCircle ? matchesCircle : (activeFilter === 'Все' || category === activeFilter || (activeFilter === 'Друзья' && !category))))
                && !state.hidden.includes(card.dataset.postId) && !card.dataset.hidden;
            card.hidden = !visible;
        });
        const count = cards.filter(card => !card.hidden).length;
        $('#empty-state').hidden = count > 0;
        $('#post-list').hidden = count === 0;
        if (query) $('#feed-caption').textContent = `Результаты поиска: «${query}»`;
        else $('#feed-caption').textContent = activeFilter === 'Сохранённое' ? 'Публикации, которые ты сохранила' : (customCircle ? `Круг: ${customCircle.name}` : 'Всё самое интересное от друзей');
        const list = $('#post-list');
        [...list.children].sort((a, b) => sortNewest ? Number(b.dataset.created || 0) - Number(a.dataset.created || 0) : Number(a.dataset.created || 0) - Number(b.dataset.created || 0)).forEach(card => list.append(card));
    }
    function setFilter(filter) {
        activeFilter = filter;
        $$('.filter-chip').forEach(button => { const selected = button.dataset.filter === filter; button.classList.toggle('selected', selected); button.setAttribute('aria-pressed', String(selected)); });
        $$('.circle-link').forEach(button => { const selected = button.dataset.filter === filter || button.dataset.customCircle === filter; button.classList.toggle('active', selected); if (selected) button.setAttribute('aria-current', 'true'); else button.removeAttribute('aria-current'); });
        refreshFeed();
    }
    function updatePostState(card) {
        const id = card.dataset.postId;
        const liked = state.liked.includes(id);
        const saved = state.saved.includes(id);
        const likeButton = card.querySelector('.like-action');
        likeButton?.classList.toggle('is-liked', liked);
        likeButton?.setAttribute('aria-pressed', String(liked));
        card.querySelector('.save-action')?.classList.toggle('is-saved', saved);
        card.querySelector('.save-action')?.setAttribute('aria-pressed', String(saved));
    }
    function publishPost(restoredPost = null) {
        const input = $('#post-input');
        const text = input.value.trim();
        if (!text && !selectedPhoto) return;
        const id = restoredPost?.id || `local-${Date.now()}`;
        const data = restoredPost || { id, text, photo: selectedPhoto, audience: state.audience, time: new Date().toISOString() };
        state.posts.unshift(data);
        persist();
        const article = document.createElement('article');
        article.className = 'post-card card'; article.dataset.postId = id; article.dataset.category = 'Друзья'; article.dataset.author = state.displayName; article.dataset.search = text.toLocaleLowerCase('ru'); article.dataset.created = String(restoredPost?.time ? Date.parse(restoredPost.time) : Date.now());
        const photo = selectedPhoto ? `<div class="user-post-photo"><img src="${selectedPhoto}" alt="Фото из публикации"></div>` : '';
        article.innerHTML = `<header class="post-header"><span class="avatar peach">АН</span><div class="post-author"><strong class="dynamic-author">${safe(state.displayName)}</strong><span>@alex.n · только что</span></div><button class="plain-icon post-menu" data-action="post-menu" aria-label="Ещё действия">•••</button></header><div class="post-copy">${text ? `<p>${safe(text).replace(/\n/g, '<br>')}</p>` : ''}</div>${photo}<div class="post-stats"><span class="reaction-stack"><i>♥</i></span><span class="like-count">0 реакций</span><button data-action="comments-scroll">0 комментариев</button></div><div class="post-actions"><button class="post-action like-action" data-action="like">${icon('heart')}<span>Нравится</span></button><button class="post-action" data-action="comment">${icon('comment')}<span>Комментировать</span></button><button class="post-action" data-action="share">${icon('share')}<span>Поделиться</span></button><button class="post-action save-action" data-action="save" aria-label="Сохранить">${icon('bookmark')}</button></div><div class="comments-preview" data-comments><div class="comment-composer"><span class="avatar peach avatar-xs">АН</span><input type="text" maxlength="240" placeholder="Написать комментарий…" aria-label="Комментарий"><button data-action="submit-comment" aria-label="Отправить комментарий">${icon('send')}</button></div></div>`;
        $('#post-list').prepend(article);
        input.value = ''; state.draft = ''; persist(); $('#publish-post').disabled = true; selectedPhoto = ''; $('#attachment-preview').hidden = true;
        if (!restoredPost) { setFilter('Все'); window.scrollTo({ top: 0, behavior: 'smooth' }); toast('Публикация появилась в ленте ✨'); }
    }
    function appendOlderPosts() {
        if ($('[data-post-id="post-3"]')) return;
        const samples = [
            { id: 'post-3', author: 'Лиза Ким', initials: 'ЛК', category: 'Дизайн', text: 'Нашла маленькую кофейню во дворе — там пахнет свежей выпечкой и совсем не хочется смотреть на часы ☕', created: Date.now() - 86400000 },
            { id: 'post-4', author: 'Даня Белый', initials: 'ДБ', category: 'Друзья', text: 'Сегодня выбрался на долгую прогулку без маршрута. Иногда именно так находятся любимые места 🌿', created: Date.now() - 172800000 },
        ];
        samples.forEach(post => {
            const card = document.createElement('article');
            card.className = 'post-card card'; card.dataset.postId = post.id; card.dataset.category = post.category; card.dataset.author = post.author; card.dataset.search = `${post.author} ${post.text}`.toLocaleLowerCase('ru'); card.dataset.created = String(post.created);
            card.innerHTML = `<header class="post-header"><span class="avatar green">${post.initials}</span><div class="post-author"><strong>${safe(post.author)}</strong><span>вчера</span></div><button class="plain-icon post-menu" data-action="post-menu" aria-label="Ещё действия">•••</button></header><div class="post-copy"><p>${safe(post.text)}</p></div><div class="post-stats"><span class="reaction-stack"><i>♥</i></span><span class="like-count">0 реакций</span><button data-action="comments-scroll">0 комментариев</button></div><div class="post-actions"><button class="post-action like-action" data-action="like" aria-pressed="false">${icon('heart')}<span>Нравится</span></button><button class="post-action" data-action="comment">${icon('comment')}<span>Комментировать</span></button><button class="post-action" data-action="share">${icon('share')}<span>Поделиться</span></button><button class="post-action save-action" data-action="save" aria-label="Сохранить" aria-pressed="false">${icon('bookmark')}</button></div><div class="comments-preview" data-comments><div class="comment-composer"><span class="avatar peach avatar-xs">АН</span><input type="text" maxlength="240" placeholder="Написать комментарий…" aria-label="Комментарий"><button data-action="submit-comment" aria-label="Отправить комментарий">${icon('send')}</button></div></div>`;
            $('#post-list').append(card); updatePostState(card);
        });
    }
    function hydrate() {
        setTheme();
        renderCircles();
        const savedDraft = state.draft || '';
        const noticeDot = $('.notification-dot'); if (noticeDot) noticeDot.hidden = state.noticeRead;
        if (state.myStory?.expiresAt && Date.now() > Date.parse(state.myStory.expiresAt)) { state.myStory = null; persist(); }
        if (state.myStory) $('.add-story > span:last-child').textContent = 'Ваша история ✓';
        const storedPosts = [...state.posts];
        state.posts = [];
        storedPosts.reverse().forEach(post => {
            $('#post-input').value = post.text || '';
            selectedPhoto = post.photo || '';
            publishPost(post);
        });
        if (state.loadedMore) appendOlderPosts();
        state.draft = savedDraft; $('#post-input').value = savedDraft; $('#publish-post').disabled = !savedDraft.trim(); persist();
        $('.audience-button').innerHTML = `<span class="audience-dot"></span>${safe(state.audience)} <span class="down-caret">⌄</span>`;
        if (state.loadedMore) $('[data-action="load-more"]').textContent = 'Ты всё посмотрела ✨';
        $$('.post-card').forEach(card => {
            updatePostState(card);
            $$('.comment-row', card).forEach((row, index) => {
                row.dataset.commentId ||= `${card.dataset.postId}-seed-${index}`;
                const button = row.querySelector('[data-action="like-comment"]');
                const liked = state.commentLikes.includes(row.dataset.commentId);
                if (button) { button.classList.toggle('comment-liked', liked); button.textContent = liked ? '♥' : '♡'; button.setAttribute('aria-pressed', String(liked)); }
            });
            const savedComments = state.comments[card.dataset.postId] || [];
            const area = card.querySelector('[data-comments]');
            savedComments.forEach((comment, index) => {
                const row = document.createElement('div'); row.className = 'comment-row user-comment'; row.dataset.commentId = `${card.dataset.postId}-user-${index}`; row.innerHTML = `<span class="avatar peach avatar-xs">АН</span><p><strong>${safe(state.displayName)}</strong> ${safe(comment)}</p><button data-action="like-comment" aria-pressed="${state.commentLikes.includes(row.dataset.commentId)}">${state.commentLikes.includes(row.dataset.commentId) ? '♥' : '♡'}</button>`;
                row.querySelector('button').classList.toggle('comment-liked', state.commentLikes.includes(row.dataset.commentId));
                area.prepend(row);
            });
            const countButton = card.querySelector('[data-action="comments-scroll"]');
            if (countButton && savedComments.length) { const count = (parseInt(countButton.textContent, 10) || 0) + savedComments.length; card.dataset.commentCount = String(count); countButton.textContent = commentLabel(count); }
        });
        $$('.friend-suggestion').forEach(row => {
            const following = state.followed.includes(row.dataset.friend);
            const button = row.querySelector('[data-action="follow"]');
            button.classList.toggle('followed', following);
            button.textContent = following ? '✓' : '+';
            button.setAttribute('aria-label', following ? `Вы подписаны на ${row.dataset.friend}` : `Добавить ${row.dataset.friend}`);
        });
        const eventButton = $('[data-action="join-event"]');
        if (eventButton) { eventButton.setAttribute('aria-pressed', String(state.joined)); if (state.joined) { eventButton.textContent = 'Ты идёшь ✓'; eventButton.classList.add('joined'); } }
        refreshFeed();
    }

    document.addEventListener('input', event => {
        if (event.target.id === 'post-input') { state.draft = event.target.value; persist(); $('#publish-post').disabled = !event.target.value.trim() && !selectedPhoto; }
        if (event.target.id === 'global-search') refreshFeed();
    });
    document.addEventListener('click', async event => {
        const actionEl = event.target.closest('[data-action], [data-nav], [data-filter], [data-tag], [data-story], [data-custom-circle]');
        if (!actionEl) return;
        const action = actionEl.dataset.action;
        if (actionEl.dataset.filter) { event.preventDefault(); setFilter(actionEl.dataset.filter); return; }
        if (actionEl.dataset.customCircle) { setFilter(actionEl.dataset.customCircle); return; }
        if (actionEl.dataset.tag) { event.preventDefault(); setFilter(actionEl.dataset.tag === 'путешествия' ? 'Путешествия' : 'Дизайн'); return; }
        if (actionEl.dataset.story) { const stories = { 'Лиза': 'Нашла книжный, где можно пить кофе между полками 📚', 'Миша': 'Дорога к морю сегодня особенно красивая 🌊', 'Катя': 'Новый эскиз и первая чашка кофе дня ☕', 'Даня': 'Вышел на прогулку — вернусь с новыми идеями 🌿', 'Ника': 'Маленькие радости этого утра ✨' }; openModal(`<div class="modal-kicker">ИСТОРИЯ ДРУГА · 24 ЧАСА</div><h2 id="modal-title">${safe(actionEl.dataset.story)}</h2><div class="story-preview"><p>${stories[actionEl.dataset.story] || 'Делится моментом дня ✨'}</p></div><button class="button button-primary modal-submit" data-action="close-modal">Понятно</button>`); return; }
        if (actionEl.dataset.nav) {
            const nav = actionEl.dataset.nav;
            $$('.nav-item, .mobile-nav button').forEach(el => {
                const selected = el.dataset.nav === nav;
                el.classList.toggle('active', selected);
                if (selected) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
            });
            if (nav === 'saved') setFilter('Сохранённое');
            else if (nav === 'friends') { setFilter('Все'); friendDirectoryModal(); }
            else if (nav === 'events') eventsModal();
            else setFilter('Все');
            if (nav === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (actionEl.id === 'publish-post') { publishPost(); return; }
        if (action === 'theme') { state.theme = state.theme === 'dark' ? 'light' : 'dark'; setTheme(); if (!$('#modal-backdrop').hidden) settingsModal(); toast(state.theme === 'dark' ? 'Включена тёмная тема 🌙' : 'Включена светлая тема ☀️'); return; }
        if (action === 'profile') { profileModal(); return; }
        if (action === 'settings') { settingsModal(); return; }
        if (action === 'close-modal') { closeModal(); return; }
        if (action === 'save-profile') {
            const name = $('#profile-name').value.trim(); if (!name) { toast('Укажи имя, чтобы сохранить профиль'); return; }
            state.displayName = name; state.bio = $('#profile-bio').value.trim(); persist();
            const firstName = name.split(/\s+/)[0];
            $$('.side-profile strong').forEach(el => el.textContent = name); $$('.dynamic-author').forEach(el => el.textContent = name);
            const greeting = $('.welcome-row h1'); if (greeting) greeting.innerHTML = `Привет, ${safe(firstName)} <span class="wave" aria-hidden="true">✳</span>`;
            const composerPrompt = $('.composer-prompt'); if (composerPrompt) composerPrompt.textContent = `Что у тебя нового, ${firstName}?`;
            closeModal(); toast('Профиль обновлён'); return;
        }
        if (action === 'privacy-switch') { state.privateProfile = !state.privateProfile; persist(); settingsModal(); return; }
        if (action === 'notification-switch') { state.notifications = !state.notifications; persist(); settingsModal(); toast(state.notifications ? 'Уведомления включены' : 'Уведомления выключены'); return; }
        if (action === 'reset-demo') { if (window.confirm('Удалить публикации, настройки и другие данные демо из этого браузера?')) { localStorage.removeItem(STORAGE_KEY); location.reload(); } return; }
        if (action === 'like') {
            const id = actionEl.closest('.post-card').dataset.postId;
            state.liked = state.liked.includes(id) ? state.liked.filter(item => item !== id) : [...state.liked, id]; persist(); updatePostState(actionEl.closest('.post-card'));
            const card = actionEl.closest('.post-card'); const initial = Number(card.dataset.initialLikes ?? (card.dataset.initialLikes = parseInt(card.querySelector('.like-count').textContent, 10) || 0));
            card.querySelector('.like-count').textContent = `${Math.max(0, initial + (state.liked.includes(id) ? 1 : 0))} реакций`;
            actionEl.classList.toggle('is-liked', state.liked.includes(id)); actionEl.setAttribute('aria-pressed', String(state.liked.includes(id))); toast(state.liked.includes(id) ? 'Твоя реакция добавлена 🤍' : 'Реакция убрана'); return;
        }
        if (action === 'save') {
            const id = actionEl.closest('.post-card').dataset.postId;
            state.saved = state.saved.includes(id) ? state.saved.filter(item => item !== id) : [...state.saved, id]; persist(); updatePostState(actionEl.closest('.post-card')); actionEl.setAttribute('aria-pressed', String(state.saved.includes(id)));
            toast(state.saved.includes(id) ? 'Сохранили в закладки' : 'Убрали из сохранённого'); if (activeFilter === 'Сохранённое') refreshFeed(); return;
        }
        if (action === 'comment' || action === 'comments' || action === 'comments-scroll') { const card = actionEl.closest('.post-card'); card.querySelector('.comment-composer input')?.focus(); card.querySelector('.comments-preview').classList.add('comments-open'); return; }
        if (action === 'submit-comment') {
            const card = actionEl.closest('.post-card'); const input = card.querySelector('.comment-composer input'); const value = input.value.trim(); if (!value) { input.focus(); return; }
            const id = card.dataset.postId; state.comments[id] = [...(state.comments[id] || []), value]; persist();
            const row = document.createElement('div'); row.className = 'comment-row user-comment'; row.dataset.commentId = `${id}-user-${state.comments[id].length - 1}`; row.innerHTML = `<span class="avatar peach avatar-xs">АН</span><p><strong>${safe(state.displayName)}</strong> ${safe(value)}</p><button data-action="like-comment" aria-pressed="false">♡</button>`;
            card.querySelector('[data-comments]').prepend(row);
            const countButton = card.querySelector('[data-action="comments-scroll"]');
            if (countButton) { const nextCount = Number(card.dataset.commentCount || parseInt(countButton.textContent, 10) || 0) + 1; card.dataset.commentCount = String(nextCount); countButton.textContent = commentLabel(nextCount); }
            input.value = ''; card.querySelector('.comments-preview').classList.add('comments-open'); toast('Комментарий опубликован'); return;
        }
        if (action === 'like-comment') { const row = actionEl.closest('.comment-row'); const id = row.dataset.commentId || `${row.closest('.post-card').dataset.postId}-seed-${$$('.comment-row', row.closest('.post-card')).indexOf(row)}`; row.dataset.commentId = id; state.commentLikes = state.commentLikes.includes(id) ? state.commentLikes.filter(item => item !== id) : [...state.commentLikes, id]; persist(); const liked = state.commentLikes.includes(id); actionEl.classList.toggle('comment-liked', liked); actionEl.textContent = liked ? '♥' : '♡'; actionEl.setAttribute('aria-pressed', String(liked)); return; }
        if (action === 'share') {
            const url = `${location.origin}${location.pathname}#${actionEl.closest('.post-card').dataset.postId}`;
            try { await navigator.clipboard.writeText(url); toast('Ссылка на публикацию скопирована'); } catch { toast('Ссылка: ' + url); } return;
        }
        if (action === 'follow' || action === 'friend-toggle') {
            const row = actionEl.closest('.friend-suggestion'); const who = actionEl.dataset.friend || row?.dataset.friend;
            if (!who) return;
            state.followed = state.followed.includes(who) ? state.followed.filter(name => name !== who) : [...state.followed, who]; persist();
            const following = state.followed.includes(who); actionEl.classList.toggle('followed', following); actionEl.textContent = following ? '✓' : '+'; actionEl.setAttribute('aria-label', following ? `Вы подписаны на ${who}` : `Добавить ${who}`); actionEl.setAttribute('aria-pressed', String(following));
            $$('.friend-suggestion').filter(item => item.dataset.friend === who).forEach(item => { const button = item.querySelector('[data-action="follow"]'); if (button && button !== actionEl) { button.classList.toggle('followed', following); button.textContent = following ? '✓' : '+'; button.setAttribute('aria-label', following ? `Вы подписаны на ${who}` : `Добавить ${who}`); } });
            if (action === 'follow') toast(following ? `${who} теперь в твоём кругу 🤍` : `Подписка на ${who} отменена`);
            else if (actionEl.previousElementSibling?.querySelector('small')) actionEl.previousElementSibling.querySelector('small').textContent = following ? 'Уже в твоём кругу' : 'Можно добавить в друзья';
            return;
        }
        if (action === 'join-event') { state.joined = !state.joined; persist(); $$('[data-action="join-event"]').forEach(button => { button.textContent = state.joined ? 'Ты идёшь ✓' : 'Пойду'; button.classList.toggle('joined', state.joined); button.setAttribute('aria-pressed', String(state.joined)); }); toast(state.joined ? 'Записали тебя на встречу! ☕' : 'Участие отменено'); return; }
        if (action === 'focus-composer') { $('#post-input').focus(); $('#post-input').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
        if (action === 'attach-photo') { $('#photo-file').click(); return; }
        if (action === 'emoji') { const input = $('#post-input'); const start = input.selectionStart; input.setRangeText(' 😊', start, input.selectionEnd, 'end'); input.dispatchEvent(new Event('input', { bubbles: true })); input.focus(); return; }
        if (action === 'audience') { openModal(`<div class="modal-kicker">КТО УВИДИТ ПУБЛИКАЦИЮ</div><h2 id="modal-title">Выбери аудиторию</h2><button class="audience-choice" data-action="audience-select" data-audience="Друзья">◉ <span><strong>Друзья</strong><small>Люди из твоего круга</small></span>${state.audience === 'Друзья' ? '✓' : ''}</button><button class="audience-choice" data-action="audience-select" data-audience="Все">◎ <span><strong>Все</strong><small>Любой пользователь Круга</small></span>${state.audience === 'Все' ? '✓' : ''}</button><div class="modal-footnote">В демо-режиме выбор сохраняется только на этом устройстве.</div>`); return; }
        if (action === 'audience-select') { state.audience = actionEl.dataset.audience; persist(); $('.audience-button').innerHTML = `<span class="audience-dot"></span>${safe(state.audience)} <span class="down-caret">⌄</span>`; closeModal(); toast(`Аудитория: ${state.audience}`); return; }
        if (action === 'story') {
            if (state.myStory) openModal(`<div class="modal-kicker">ТВОЯ ИСТОРИЯ · 24 ЧАСА</div><h2 id="modal-title">${safe(state.displayName)}</h2><div class="story-preview"><p>${safe(state.myStory.text)}</p></div><button class="modal-option danger" data-action="delete-story">Удалить историю</button>`);
            else openModal(`<div class="modal-kicker">МОМЕНТ НА 24 ЧАСА</div><h2 id="modal-title">Поделись историей</h2><label class="form-label">Что происходит?<textarea id="story-input" class="modal-input" maxlength="180" rows="3" placeholder="Расскажи о своём моменте…"></textarea></label><button class="button button-primary modal-submit" data-action="create-story">Опубликовать историю</button>`);
            return;
        }
        if (action === 'create-story') { const text = $('#story-input').value.trim(); if (!text) { toast('Напиши пару слов для истории'); return; } state.myStory = { text, expiresAt: new Date(Date.now() + 86400000).toISOString() }; persist(); $('.add-story > span:last-child').textContent = 'Ваша история ✓'; closeModal(); toast('История опубликована на 24 часа'); return; }
        if (action === 'delete-story') { state.myStory = null; persist(); $('.add-story > span:last-child').textContent = 'Ваша история'; closeModal(); toast('История удалена'); return; }
        if (action === 'all-stories') { openModal(`<div class="modal-kicker">ИСТОРИИ</div><h2 id="modal-title">Моменты твоего круга</h2>${state.myStory ? `<div class="story-preview"><strong>Твоя история</strong><p>${safe(state.myStory.text)}</p></div>` : '<p class="modal-description">Историй пока нет. Создай первую — она будет видна 24 часа.</p>'}<button class="button button-primary modal-submit" data-action="story">Создать историю</button>`); return; }
        if (action === 'notifications') { state.noticeRead = true; persist(); const dot = $('.notification-dot'); if (dot) dot.hidden = true; openModal(`<div class="modal-kicker">ВСЁ ВАЖНОЕ</div><h2 id="modal-title">Уведомления</h2><div class="notification-item"><span>🤍</span><p><strong>Лиза Ким</strong> и ещё 3 человека оценили твою публикацию.<small>15 минут назад</small></p></div><div class="notification-item"><span>🎂</span><p>Сегодня день рождения у <strong>Дани Белого</strong>.<small>1 час назад</small></p></div><div class="notification-item"><span>☕</span><p><strong>Катя Власова</strong> пригласила тебя на скетчинг.<small>Вчера</small></p></div><div class="modal-footnote">Демо-уведомления; настоящие появятся после подключения аккаунтов.</div>`); return; }
        if (action === 'post-menu') {
            const card = actionEl.closest('.post-card'); const own = card.dataset.postId.startsWith('local-');
            openModal(`<div class="modal-kicker">ПУБЛИКАЦИЯ</div><h2 id="modal-title">Что сделать?</h2><button class="modal-option" data-action="save-from-menu">${icon('bookmark')}Сохранить публикацию</button>${own ? '<button class="modal-option danger" data-action="delete-post">Удалить публикацию</button>' : '<button class="modal-option" data-action="hide-post">Скрыть публикацию</button><button class="modal-option danger" data-action="report-post">Пожаловаться</button>'}`);
            $('#modal-content').dataset.postId = card.dataset.postId; return;
        }
        if (action === 'save-from-menu') { const id = $('#modal-content').dataset.postId; const card = document.querySelector(`[data-post-id="${CSS.escape(id)}"]`); card.querySelector('[data-action="save"]').click(); closeModal(); return; }
        if (action === 'hide-post' || action === 'delete-post') { const id = $('#modal-content').dataset.postId; const card = document.querySelector(`[data-post-id="${CSS.escape(id)}"]`); if (action === 'hide-post') state.hidden = [...new Set([...state.hidden, id])]; else state.posts = state.posts.filter(post => post.id !== id); persist(); closeModal(); refreshFeed(); toast(action === 'delete-post' ? 'Публикация удалена' : 'Публикация скрыта'); return; }
        if (action === 'report-post') { const id = $('#modal-content').dataset.postId; state.reported = [...new Set([...(state.reported || []), id])]; persist(); closeModal(); toast('Жалоба сохранена в демо'); return; }
        if (action === 'sort') { sortNewest = !sortNewest; actionEl.innerHTML = `${sortNewest ? 'Сначала новое' : 'Сначала старое'} <span>⌄</span>`; refreshFeed(); return; }
        if (action === 'birthday') { openModal(`<div class="modal-kicker">ДЕНЬ РОЖДЕНИЯ ДАНИ</div><h2 id="modal-title">Подарим немного тепла 🎂</h2><textarea class="modal-input" id="birthday-message" rows="4">С днём рождения! Пусть впереди будет побольше радостных моментов и классных людей рядом 🤍</textarea><button class="button button-primary modal-submit" data-action="send-birthday">Отправить поздравление</button>`); return; }
        if (action === 'send-birthday') { const text = $('#birthday-message').value.trim(); if (!text) { toast('Напиши поздравление'); return; } state.sentGreetings = [...(state.sentGreetings || []), { to: 'Даня Белый', text, time: new Date().toISOString() }]; persist(); closeModal(); toast('Поздравление сохранено в демо 🎉'); return; }
        if (action === 'new-circle') { openModal(`<div class="modal-kicker">СВОИ ЛЮДИ</div><h2 id="modal-title">Создать круг</h2><p class="modal-description">Собери публикации по интересам.</p><label class="form-label">Название круга<input id="circle-name" class="modal-input" maxlength="40" placeholder="Например, Мои люди"></label><label class="form-label">Показывать публикации<select id="circle-category" class="modal-input"><option>Друзья</option><option>Дизайн</option><option>Путешествия</option></select></label><button class="button button-primary modal-submit" data-action="create-circle">Создать круг</button>`); return; }
        if (action === 'create-circle') { const name = $('#circle-name').value.trim(); if (!name) return toast('Введи название круга'); if (state.circles.some(circle => circle.name.toLocaleLowerCase('ru') === name.toLocaleLowerCase('ru'))) return toast('Круг с таким названием уже есть'); state.circles.push({ id: `circle-${Date.now()}`, name, category: $('#circle-category').value }); persist(); renderCircles(); closeModal(); toast(`Круг «${name}» создан`); return; }
        if (action === 'load-more') { if (state.loadedMore) { toast('Ты просмотрела все публикации ✨'); return; } state.loadedMore = true; persist(); appendOlderPosts(); refreshFeed(); actionEl.textContent = 'Ты всё посмотрела ✨'; toast('Добавили ещё публикации'); return; }
        if (action === 'birthday-more') { openModal(`<div class="modal-kicker">СЕГОДНЯ</div><h2 id="modal-title">День рождения Дани</h2><p class="modal-description">Отправь Дане тёплые слова — поздравление можно отредактировать.</p><button class="button button-primary modal-submit" data-action="birthday">Написать поздравление</button>`); return; }
        if (action === 'event-more') { eventsModal(); return; }
        if (['about', 'help', 'privacy', 'terms'].includes(action)) { openModal(`<div class="modal-kicker">КРУГ · СОЦИАЛЬНАЯ СЕТЬ</div><h2 id="modal-title">${({ about: 'Люди рядом', help: 'Чем помочь?', privacy: 'Твоя приватность', terms: 'Правила Круга' })[action]}</h2><p class="modal-description">Круг — место, где можно делиться моментами с теми, кто действительно рядом. Мы только начинаем и будем рады твоим идеям.</p><button class="button button-primary modal-submit" data-action="close-modal">Понятно</button>`); return; }
    });
    $('#modal-backdrop').addEventListener('click', event => { if (event.target.id === 'modal-backdrop') closeModal(); });
    document.addEventListener('keydown', event => {
        if (event.key === 'Enter' && event.target.matches('.comment-composer input')) { event.preventDefault(); event.target.closest('.comment-composer').querySelector('[data-action="submit-comment"]').click(); return; }
        if (event.key === 'Escape' && !$('#modal-backdrop').hidden) { closeModal(); return; }
        if (event.key === 'Tab' && !$('#modal-backdrop').hidden) {
            const focusable = $$('.modal-card button:not(:disabled), .modal-card input:not(:disabled), .modal-card textarea:not(:disabled), .modal-card [tabindex]:not([tabindex="-1"])');
            const first = focusable[0]; const last = focusable[focusable.length - 1];
            if (first && last && event.shiftKey && (document.activeElement === first || !$('.modal-card').contains(document.activeElement))) { event.preventDefault(); last.focus(); }
            else if (last && !event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
            return;
        }
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); $('#global-search').focus(); }
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'enter') publishPost();
    });
    const photoInput = document.createElement('input'); photoInput.type = 'file'; photoInput.id = 'photo-file'; photoInput.accept = 'image/*'; photoInput.hidden = true; document.body.append(photoInput);
    photoInput.addEventListener('change', () => {
        const file = photoInput.files?.[0]; if (!file) return;
        if (!file.type.startsWith('image/')) return toast('Выбери файл изображения');
        if (file.size > 5 * 1024 * 1024) return toast('Фото должно быть меньше 5 МБ');
        const reader = new FileReader(); reader.onload = () => { selectedPhoto = String(reader.result); const preview = $('#attachment-preview'); preview.innerHTML = `<img src="${selectedPhoto}" alt="Предпросмотр фото"><button type="button" data-action="remove-photo" aria-label="Убрать фото">${icon('close')}</button>`; preview.hidden = false; $('#publish-post').disabled = false; }; reader.readAsDataURL(file); photoInput.value = '';
    });
    document.addEventListener('click', event => { if (event.target.closest('[data-action="remove-photo"]')) { selectedPhoto = ''; $('#attachment-preview').hidden = true; $('#publish-post').disabled = !$('#post-input').value.trim(); } });

    hydrate();
})();
