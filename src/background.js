import logger from './utils/logger'
import { getLastdate, getCheckInTime, updateLastdate, changeCheckInTime, getGamesInfo } from './config'

// 
const check = async () => {
    const lastdate = await getLastdate()
    const { hour: h, minutes: m } = await getCheckInTime()

    // チェックイン時刻(Date)の生成
    const now = new Date()
    const old = new Date()
    old.setHours(h, m, 0, 0)

    // チェックイン時刻以降にログインボーナスページを開く
    if (now.toDateString() != lastdate && old < now) {
        await updateLastdate()
        chrome.tabs.create({
            url: 'https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481',
            active: false,
        })
        logger.info('open web bonus page')
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

// chrome.alarmsに定期タスクとして登録
chrome.alarms.create({ periodInMinutes: 1 })
chrome.alarms.onAlarm.addListener(() => check())
logger.info('register background checker')