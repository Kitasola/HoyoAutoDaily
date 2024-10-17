import { changeEnableGame, getGamesInfo } from './config';

window.addEventListener('load', async () => {
    const games_info = await getGamesInfo()

    const parent = document.querySelector('.enable-game')

    for (const game of Object.values(games_info)) {
        let input_data = document.createElement('input')
        input_data.type = 'checkbox'
        input_data.id = game.id
        input_data.name = 'enable_game'
        input_data.checked = game.enable
        input_data.addEventListener('change', (e) => {
            const input = e.target
            changeEnableGame(input.id, input.checked)
        })


        let label_data = document.createElement('label')
        label_data.className = 'checkbox'
        label_data['for'] = game.id
        label_data.textContent = game.name
        label_data.indeterminate = true
        label_data.prepend(input_data)

        parent.appendChild(label_data)
    }
});
