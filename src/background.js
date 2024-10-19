import logger from './utils/logger'
import {
    getLastdate,
    getCheckInTime,
    updateLastdate,
    updateGameURL,
    getGamesInfo,
    getChecking,
    onChecking,
    offChecking,
    getAlarmStat,
    onAlarm,
    offAlarm,
} from './config'

// 定期実行処理
const check = async () => {
    // ステータス取得
    const lastdate = await getLastdate()
    const status = await getChecking()
    const now = new Date()
    // チェックイン済みなら終了
    if (!status && now.toDateString() === lastdate) {
        return
    }

    // チェックイン時刻(Date)の生成
    const { hour: h, minutes: m } = await getCheckInTime()
    const old = new Date()
    old.setHours(h, m, 0, 0)

    // チェックイン時刻以降にログインボーナスページを開く
    if (now.toDateString() != lastdate && old < now && !status) {
        const games_info = await getGamesInfo()
        for (const game of Object.values(games_info)) {
            // 有効ゲームのみ開く
            if (game.enable && game.url != null) {
                // ステータス更新
                await onChecking()
                await updateLastdate()
                chrome.tabs.create({
                    url: game.url,
                    active: false,
                })
                logger.debug(`open ${game.id} web bonus page`)
            }
        }

        logger.debug('start check in')
    } else if (status) {
        const games_info = await getGamesInfo()
        for (const game of Object.values(games_info)) {
            // 上記チェックイン処理の後始末
            if (game.enable && game.url != null) {
                // ステータス更新
                await offChecking()
                chrome.tabs.query({ url: game.url }, (tabs) => {
                    tabs.forEach(tab => {
                        chrome.tabs.remove(tab.id)
                    });
                });
            }
        }
        logger.debug('finish check in')
    }
    logger.debug('finish check')
}

// games_info.urlの更新
updateGameURL()

// chrome.alarmsに定期タスクとして登録
const runBackground = async () => {
    const alarm = await getAlarmStat()
    if (!alarm) {
        chrome.alarms.create({ periodInMinutes: 1 })
        chrome.alarms.onAlarm.addListener(() => check())
        await onAlarm()
        logger.info('register background checker')
    }
}

runBackground()