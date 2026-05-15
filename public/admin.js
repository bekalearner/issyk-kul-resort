(function () {
    'use strict';

    // ===== Active sidebar link =====
    document.querySelectorAll('.admin-nav a').forEach(function (link) {
        var href = link.getAttribute('href');
        if (!href) return;
        if (href === '/admin' && location.pathname === '/admin') {
            link.classList.add('active');
        } else if (href !== '/admin' && location.pathname.startsWith(href)) {
            link.classList.add('active');
        }
    });

    // ===== Amenity rows (rooms form) =====
    var amenityList = document.getElementById('amenities-list');
    var addAmenityBtn = document.getElementById('add-amenity');

    function makeAmenityRow(value) {
        var row = document.createElement('li');
        row.className = 'amenity-row';
        var safe = String(value || '').replace(/"/g, '&quot;');
        row.innerHTML =
            '<input type="text" name="amenities" placeholder="Например: Wi-Fi высокой скорости" value="' + safe + '">' +
            '<button type="button" class="btn-admin btn-sm btn-danger" data-action="remove">×</button>';
        return row;
    }

    if (addAmenityBtn && amenityList) {
        addAmenityBtn.addEventListener('click', function () {
            amenityList.appendChild(makeAmenityRow(''));
        });
        amenityList.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-action="remove"]');
            if (btn) {
                var row = btn.closest('li');
                if (row && amenityList.children.length > 1) {
                    row.remove();
                } else if (row) {
                    var input = row.querySelector('input');
                    if (input) input.value = '';
                }
            }
        });
    }

    // ===== Icon-select previews =====
    document.querySelectorAll('[data-icon-select]').forEach(function (wrap) {
        var select = wrap.querySelector('[data-icon-input]');
        var preview = wrap.querySelector('[data-icon-preview] i');
        if (!select || !preview) return;
        function update() {
            var value = select.value || 'fa-question';
            preview.className = 'fas ' + value;
        }
        select.addEventListener('change', update);
        update();
    });

    // ===== Badge custom toggle (not used in MVP — kept for future) =====

    // ===== Confirm before destructive actions =====
    document.querySelectorAll('form[data-confirm]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            if (!window.confirm(form.dataset.confirm || 'Уверены?')) {
                e.preventDefault();
            }
        });
    });

    // ===== Client-side validation on admin forms =====
    document.querySelectorAll('form.admin-form').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            // Trigger native validation first
            if (!form.checkValidity()) {
                e.preventDefault();
                var firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                    var label = firstInvalid.closest('.form-field');
                    if (label) label.classList.add('has-error');
                    if (window.toast) {
                        window.toast.error(
                            firstInvalid.validationMessage || 'Заполните обязательные поля корректно',
                        );
                    }
                }
                return;
            }
            // Custom rule: capacityMax >= capacityMin
            var min = form.querySelector('[name="capacityMin"]');
            var max = form.querySelector('[name="capacityMax"]');
            if (min && max) {
                var a = parseInt(min.value, 10);
                var b = parseInt(max.value, 10);
                if (!isNaN(a) && !isNaN(b) && b < a) {
                    e.preventDefault();
                    max.focus();
                    var field = max.closest('.form-field');
                    if (field) field.classList.add('has-error');
                    if (window.toast) {
                        window.toast.error('Максимальная вместимость должна быть не меньше минимальной');
                    }
                }
            }
        });

        // Clear has-error on input
        form.addEventListener('input', function (e) {
            var field = e.target.closest('.form-field');
            if (field) field.classList.remove('has-error');
        });
    });
})();
