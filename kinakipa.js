(function () {
    'use strict';

    if (!window.Lampa) return;

    console.log('Kinakipa plugin loaded');

    const PLUGIN_NAME = 'Kinakipa';

    function playTest() {
        const id = 464963;
        const title = 'Kinakipa — тест';

        const url = Lampa.Utils.proxy(
            'https://kinakipa.site/player?id=' + id
        );

        fetch(url)
            .then(r => r.text())
            .then(html => {
                const matches = [...html.matchAll(/https?:\/\/[^"' ]+\.m3u8/g)];
                if (!matches.length) throw 'm3u8 not found';

                Lampa.Player.play({
                    title: title,
                    url: matches[0][0]
                });
            })
            .catch(e => {
                console.error(e);
                Lampa.Noty.show('Kinakipa: ошибка воспроизведения');
            });
    }

    // ✅ добавляем пункт в главное меню
    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {

            Lampa.Menu.add({
                id: 'kinakipa',
                title: PLUGIN_NAME,
                icon: 'movie',
                onSelect: playTest
            });
        }
    });

})();
