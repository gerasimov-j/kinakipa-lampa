(function () {
    'use strict';

    if (!window.Lampa) return;

    console.log('Kinakipa plugin loaded');

    const SOURCE_ID = 'kinakipa';
    const SOURCE_TITLE = 'Kinakipa';

    function KinakipaSource() {}

    KinakipaSource.prototype.search = function (query, callback) {
        // временно — заглушка
        callback([]);
    };

    KinakipaSource.prototype.category = function (category, page, callback) {
        // временно — тестовый фильм
        callback([
            {
                id: 464963,
                title: 'Тест Kinakipa',
                poster: '',
                type: 'movie'
            }
        ]);
    };

    KinakipaSource.prototype.play = function (item) {
        const url = Lampa.Utils.proxy(
            'https://kinakipa.site/player?id=' + item.id
        );

        fetch(url)
            .then(r => r.text())
            .then(html => {
                const match = html.match(/https?:\/\/[^"' ]+\.m3u8/);
                if (!match) throw 'no m3u8';

                Lampa.Player.play({
                    title: item.title,
                    url: match[0]
                });
            })
            .catch(e => {
                console.error(e);
                Lampa.Noty.show('Kinakipa: ошибка воспроизведения');
            });
    };

    // ✅ регистрация источника — ПРАВИЛЬНО
    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
            Lampa.Source.add({
                id: SOURCE_ID,
                title: SOURCE_TITLE,
                source: KinakipaSource,
                type: 'movie',
                icon: 'movie'
            });
        }
    });

})();
