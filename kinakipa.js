(function () {
    'use strict';

    if (!window.Lampa) return;

    var TEST_MOVIE_ID = 464963;

    /**
     * Компонент Kinakipa
     */
    function kinakipa(object) {
        var html = $('<div></div>');

        this.create = function () {
            this.activity.loader(true);

            loadPlayer(TEST_MOVIE_ID, function (stream_url) {
                this.activity.loader(false);

                if (!stream_url) {
                    Lampa.Noty.show('Kinakipa: не удалось получить m3u8');
                    return;
                }

                Lampa.Player.play({
                    title: 'Kinakipa test (464963)',
                    url: stream_url
                });

            }.bind(this));

            return this.render();
        };

        this.render = function () {
            return html;
        };

        this.start = function () {
            Lampa.Controller.toggle('player');
        };
    }

    /**
     * Парсим /player?id=XXXX и вытаскиваем m3u8
     */
    function loadPlayer(id, callback) {
        var url = 'https://kinakipa.site/player?id=' + id;

        $.get(url, function (html) {
            try {
                var div = document.createElement('div');
                div.innerHTML = html;

                var source = div.querySelector(
                    'source[type="application/vnd.apple.mpegURL"]'
                );

                if (source && source.src && source.src.includes('.m3u8')) {
                    callback(source.src);
                } else {
                    callback(null);
                }
            } catch (e) {
                console.error('Kinakipa parse error', e);
                callback(null);
            }
        }).fail(function (e) {
            console.error('Kinakipa request failed', e);
            callback(null);
        });
    }

    /**
     * Кнопка в левом меню
     */
    function addMenu() {
        var ico =
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">' +
            '<path d="M4 4h16v16H4z"/>' +
            '</svg>';

        var item = $(
            '<li class="menu__item selector" data-action="kinakipa">' +
                '<div class="menu__ico">' + ico + '</div>' +
                '<div class="menu__text">Kinakipa</div>' +
            '</li>'
        );

        item.on('hover:enter', function () {
            Lampa.Activity.push({
                title: 'Kinakipa',
                component: 'kinakipa',
                page: 1
            });
        });

        $('.menu .menu__list').eq(0).append(item);
    }

    /**
     * Инициализация
     */
    Lampa.Component.add('kinakipa', kinakipa);

    if (window.appready) {
        addMenu();
    } else {
        Lampa.Listener.follow('app', addMenu);
    }

})();
