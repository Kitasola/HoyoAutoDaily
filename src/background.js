import logger from './utils/logger'
import {
    getLastdate,
    getCheckInTime,
    updateLastdate,
    updateGameURL,
    getGamesInfo,
    onCheckingGame,
    offCheckingGame,
    getAlarmStat,
    onAlarm,
    offAlarm,
} from './config'

// 定期実行処理
const check = async () => {
    // ステータス取得
    const lastdate = await getLastdate()
    const now = new Date()

    // チェックイン時刻(Date)の生成
    const { hour: h, minutes: m } = await getCheckInTime()
    const old = new Date()
    old.setHours(h, m, 0, 0)

    const games_info = await getGamesInfo()
    for (const game of Object.values(games_info)) {
        // 有効ゲームのみ処理
        if (!game.enable || game.url === null) {
            continue
        }

        // チェックイン済みなら終了
        if (!game.checking && now.toDateString() === lastdate) {
            continue
        }

        // チェックイン時刻以降にログインボーナスページを開く
        if (now.toDateString() != lastdate && old < now && !game.checking) {
            // ステータス更新
            await onCheckingGame(game.id)
            await updateLastdate()
            chrome.tabs.create({
                url: game.url,
                active: false,
            })
            // Hoyoverse API制限の回避
            await new Promise((resolve) => setTimeout(resolve, 10000))
            logger.debug(`open ${game.id} web bonus page`)
        } else if (game.checking) {
            // 上記チェックイン処理の後始末
            if (game.enable && game.url != null) {
                try {
                    chrome.tabs.query({ url: game.url }, (tabs) => {
                        tabs.forEach(tab => {
                            chrome.tabs.remove(tab.id)
                        });
                    });
                    // ステータス更新
                    await offCheckingGame(game.id)
                }
                catch (error) {
                    logger.error(`${game.id} error: ${error}`)
                    continue
                }
            }
            logger.debug(`close ${game.id} web bonus page`)
        }
    }
    logger.debug('finish check')
}

// games_info.urlの更新
updateGameURL()

// chrome.alarmsに定期タスクとして登録
chrome.alarms.create({ periodInMinutes: 1 })
chrome.alarms.onAlarm.addListener(() => check())
logger.info('register background checker')
// const runBackground = async () => {
//     const alarm = await getAlarmStat()
//     if (!alarm) {
//         chrome.alarms.create({ periodInMinutes: 1 })
//         chrome.alarms.onAlarm.addListener(() => check())
//         await onAlarm()
//         logger.info('register background checker')
//     }
// }

// runBackground()