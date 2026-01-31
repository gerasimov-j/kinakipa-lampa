(function () {
    'use strict';

    if (!window.Lampa) return;

    function getStreams(id) {
        const url = 'https://kinakipa.site/player?id=' + id;

        return fetch(url)
            .then(r => r.text())
            .then(html => {
                const matches = [...html.matchAll(/https?:\/\/[^"' ]+\.m3u8/g)];
                if (!matches.length) throw 'no m3u8';

                // уникальные
                return [...new Set(matches.map(m => m[0]))];
            });
    }

    function play(id, title) {
        getStreams(id)
            .then(list => {
                // пока просто первый
                Lampa.Player.play({
                    title: title || 'Kinakipa',
                    url: list[0]
                });
            })
            .catch(e => {
                console.error(e);
                Lampa.Noty.show('Kinakipa: поток не найден');
            });
    }

    // тест
    Lampa.Storage.listener.follow('app', e => {
        if (e.type === 'ready') {
            play(464963, 'Тест Kinakipa');
        }
    });

})();
