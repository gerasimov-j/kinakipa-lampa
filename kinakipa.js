(function () {
    'use strict';

    if (!window.Lampa) return;

    console.log('Kinakipa plugin loaded');

    const ACTIVITY_ID = 'kinakipa_activity';

    function openActivity() {
        Lampa.Activity.push({
            id: ACTIVITY_ID,
            title: 'Kinakipa',
            component: 'content',
            url: '',
            page: 1,
            type: 'movie',
            source: {
                get: function (params, callback) {
                    callback({
                        results: [
                            {
                                id: 464963,
                                title: 'Тест Kinakipa',
                                poster_path: '',
                                backdrop_path: '',
                                overview: 'Тестовый фильм',
                                release_date: ''
                            }
                        ],
                        page: 1,
                        total_pages: 1
                    });
                }
            },
            onPlay: function (item) {
                const url = Lampa.Utils.proxy(
                    'https://kinakipa.site/player?id=' + item.id
                );

                fetch(url)
                    .then(r => r.text())
                    .then(html => {
                        const m = html.match(/https?:\/\/[^"' ]+\.m3u8/);
                        if (!m) throw 'no stream';

                        Lampa.Player.play({
                            title: item.title,
                            url: m[0]
                        });
                    });
            }
        });
    }

    // ✅ корректная регистрация
    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
            // добавляем пункт в "Приложения"
            Lampa.Apps.add({
                id: 'kinakipa',
                title: 'Kinakipa',
                icon: 'movie',
                onSelect: openActivity
            });
        }
    });

})();
