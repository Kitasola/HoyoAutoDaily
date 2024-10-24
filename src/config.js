import logger from './utils/logger'

const config = {
    'games_info': {
        'HG0': {
            'id': 'HG0',
            'name': 'Genshin Impact',
            'act_id': 'e202102251931481',
            'enable': false,
            'page_url': null,
            'info_url': 'https://sg-hk4e-api.hoyolab.com/event/sol/info',
            'sign_url': 'https://sg-hk4e-api.hoyolab.com/event/sol/sign',
            'checking': false,
            'signname': '',
        },
        'HG1': {
            'id': 'HG1',
            'name': 'Hokai Star Rail',
            'act_id': 'e202303301540311',
            'enable': false,
            'page_url': null,
            'info_url': 'https://sg-public-api.hoyolab.com/event/luna/os/info',
            'sign_url': 'https://sg-public-api.hoyolab.com/event/luna/os/sign',
            'checking': false,
            'signname': '',
        },
        'HG2': {
            'id': 'HG2',
            'name': 'Zenless Zone Zero',
            'act_id': 'e202406031448091',
            'enable': false,
            'page_url': null,
            'info_url': 'https://sg-public-api.hoyolab.com/event/luna/zzz/os/info',
            'sign_url': 'https://sg-public-api.hoyolab.com/event/luna/zzz/os/sign',
            'checking': false,
            'signname': 'zzz',
        },
    },
    'lastdate': new Date(0).toDateString(),
    'check_in_time': {
        'hour': 1,
        'minutes': 5
    }, // TZ=Asia/Tokyo
    'alarm': false,
}

export const getGamesInfo = async () => {
    const data = await chrome.storage.sync.get('games_info')
        .catch(() => { })

    if ('games_info' in data == false) {
        logger.debug('not found games_info')
        await chrome.storage.sync.set({ 'games_info': config.games_info })
        return config.games_info
    }

    return data.games_info
};

export const changeEnableGame = async (id, enable) => {
    const games_info = await getGamesInfo()
    games_info[id].enable = (enable === true)
    await chrome.storage.sync.set({ 'games_info': games_info, })
    logger.debug(`${id}'s info change ${games_info[id].enable}`)
};

export const onCheckingGame = async (id) => {
    const games_info = await getGamesInfo()
    games_info[id].checking = true
    await chrome.storage.sync.set({ 'games_info': games_info, })
    logger.debug(`${id}'s checking on`)
};

export const offCheckingGame = async (id) => {
    const games_info = await getGamesInfo()
    games_info[id].checking = false
    await chrome.storage.sync.set({ 'games_info': games_info, })
    logger.debug(`${id}'s checking off`)
};

export const getLastdate = async () => {
    const data = await chrome.storage.sync.get('lastdate')
        .catch(() => { })

    if ('lastdate' in data == false) {
        logger.debug('not found lastdate')
        await chrome.storage.sync.set({ 'lastdate': config.lastdate })
        return config.lastdate
    }

    return data.lastdate
};

export const updateLastdate = async () => {
    await chrome.storage.sync.set({ 'lastdate': new Date().toDateString(), })
    logger.debug('update lastdate')
}

export const getCheckInTime = async () => {
    const data = await chrome.storage.sync.get('check_in_time')
        .catch(() => { })

    if ('check_in_time' in data == false) {
        logger.debug('not found check_in_time')
        await chrome.storage.sync.set({ 'check_in_time': config.check_in_time })
        return config.check_in_time
    }

    return data.check_in_time
};

export const changeCheckInTime = async (h, m) => {
    await chrome.storage.sync.set({
        'check_in_time': {
            'hour': h,
            'minutes': m,
        },
    })
    logger.debug(`check in time change "${h}:${m}"`)
}

export const updateGamePageURL = async () => {
    const manifest = chrome.runtime.getManifest()
    const games_info = await getGamesInfo()

    for (const game of Object.values(games_info)) {
        const target = manifest.content_scripts[0].matches.find(
            (url) => url.includes(game.act_id)
        )
        if (target) {
            games_info[game.id].page_url = target
        }
    }

    await chrome.storage.sync.set({ 'games_info': games_info, })
    logger.debug(`update games_info page_url`)
}

export const getAlarmStat = async () => {
    const data = await chrome.storage.sync.get('alarm')
        .catch(() => { })

    if ('alarm' in data == false) {
        logger.debug('not found alarm')
        await chrome.storage.sync.set({ 'alarm': config.alarm })
        return config.alarm
    }

    return data.alarm
};

export const onAlarm = async () => {
    await chrome.storage.sync.set({ 'alarm': true, })
    logger.debug('change alarm')
}

export const offAlarm = async () => {
    await chrome.storage.sync.set({ 'alarm': false, })
    logger.debug('change alarm')
}