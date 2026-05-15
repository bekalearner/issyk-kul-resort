(function () {
    'use strict';

    var ICONS = {
        success: 'fa-check-circle',
        error: 'fa-circle-exclamation',
        warning: 'fa-triangle-exclamation',
        info: 'fa-circle-info',
    };

    var TITLES = {
        success: 'Готово',
        error: 'Ошибка',
        warning: 'Внимание',
        info: 'Информация',
    };

    function ensureContainer() {
        var container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    function show(message, type, options) {
        if (!message) return null;
        type = type || 'info';
        options = options || {};
        var duration = typeof options.duration === 'number' ? options.duration : 5000;
        var container = ensureContainer();

        var toast = document.createElement('div');
        toast.className = 'toast toast--' + type;
        toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

        var icon = document.createElement('i');
        icon.className = 'toast-icon fas ' + (ICONS[type] || ICONS.info);

        var body = document.createElement('div');
        body.className = 'toast-body';

        var title = document.createElement('div');
        title.className = 'toast-title';
        title.textContent = options.title || TITLES[type] || '';

        var msg = document.createElement('div');
        msg.className = 'toast-message';
        msg.textContent = message;

        body.appendChild(title);
        body.appendChild(msg);

        var close = document.createElement('button');
        close.type = 'button';
        close.className = 'toast-close';
        close.setAttribute('aria-label', 'Закрыть');
        close.innerHTML = '&times;';

        toast.appendChild(icon);
        toast.appendChild(body);
        toast.appendChild(close);
        container.appendChild(toast);

        requestAnimationFrame(function () {
            toast.classList.add('toast--visible');
        });

        var hideTimer = null;
        function dismiss() {
            if (!toast.parentNode) return;
            toast.classList.remove('toast--visible');
            toast.classList.add('toast--leaving');
            window.setTimeout(function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 250);
            if (hideTimer) window.clearTimeout(hideTimer);
        }

        close.addEventListener('click', dismiss);
        if (duration > 0) hideTimer = window.setTimeout(dismiss, duration);

        return { dismiss: dismiss, element: toast };
    }

    var api = {
        show: show,
        success: function (m, opts) { return show(m, 'success', opts); },
        error: function (m, opts) { return show(m, 'error', opts); },
        warning: function (m, opts) { return show(m, 'warning', opts); },
        info: function (m, opts) { return show(m, 'info', opts); },
    };

    window.toast = api;

    function bootstrapFromFlash() {
        var initial = window.__INITIAL_TOASTS;
        if (!initial || !Array.isArray(initial)) return;
        initial.forEach(function (t) {
            if (t && t.message) show(t.message, t.type || 'info');
        });
        window.__INITIAL_TOASTS = [];
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrapFromFlash);
    } else {
        bootstrapFromFlash();
    }
})();
