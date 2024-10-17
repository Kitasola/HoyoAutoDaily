import { getLastdate, changeEnableGame, getGamesInfo } from './config';

window.addEventListener('load', async () => {
    // YYYY/MM/DD変換
    const lastdate = new Date(await getLastdate())
        .toLocaleDateString("ja-JP", {
            year: "numeric", month: "2-digit",
            day: "2-digit"
        })
    const games_info = await getGamesInfo()

    // 最終ログイン日時
    const parent_status_board = document.querySelector('.status-board')
    let last_login_date = document.createElement('a')
    last_login_date.textContent = `最終ログイン日時 ${lastdate}`
    parent_status_board.appendChild(last_login_date)

    // ゲーム一覧
    const parent_enable_game = document.querySelector('.enable-game')
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

        parent_enable_game.appendChild(label_data)
    }
});
