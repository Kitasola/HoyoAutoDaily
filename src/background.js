import logger from './utils/logger'
import { getLastdate, getCheckInTime, updateLastdate, updateGameURL, getGamesInfo } from './config'

// 定期実行処理
const check = async () => {
    const lastdate = await getLastdate()
    const { hour: h, minutes: m } = await getCheckInTime()

    // チェックイン時刻(Date)の生成
    const now = new Date()
    const old = new Date()
    old.setHours(h, m, 0, 0)

    // チェックイン時刻以降にログインボーナスページを開く
    if (now.toDateString() != lastdate && old < now) {
        const games_info = await getGamesInfo()
        for (const game of Object.values(games_info)) {
            // 有効ゲームのみ開く
            if (game.enable && game.url != null) {
                await updateLastdate()
                chrome.tabs.create({
                    url: game.url,
                    active: false,
                })
                logger.info(`open ${game.id} web bonus page`)
            }
        }

    }
    logger.info('finish check')
}

// conten_script(content.js)からのメッセージ受信
chrome.runtime.onMessage.addListener((message, sender) => {
    // 完了通知
    if (message === 'finish') {
        chrome.tabs.query({ url: sender.url }, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.remove(tab.id)
            });
        });
    }
})

// games_info.urlの更新
updateGameURL()

// chrome.alarmsに定期タスクとして登録
chrome.alarms.create({ periodInMinutes: 1 })
chrome.alarms.onAlarm.addListener(() => check())
logger.info('register background checker')