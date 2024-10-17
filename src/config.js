import logger from './utils/logger'

const config = {
    'games_info': {
        'HG0': {
            'id': 'HG0',
            'name': 'Genshin Impact',
            'enable': false,
        },
        'HG1': {
            'id': 'HG1',
            'name': 'Hokai Star Rail',
            'enable': false,
        },
        'HG2': {
            'id': 'HG2',
            'name': 'Zenless Zone Zero',
            'enable': false,
        },
    },
    'lastdate': new Date(0).toDateString(),
    'check_in_time': {
        'hour': 1,
        'minutes': 5
    }, // TZ=Asia/Tokyo
}

export const getGamesInfo = async () => {
    const data = await chrome.storage.sync.get('games_info')
        .catch(() => { })

    if ('games_info' in data == false) {
        logger.info('not found games_info')
        await chrome.storage.sync.set({ 'games_info': config.games_info })
        return config.games_info
    }

    return data.games_info
};

export const changeEnableGame = async (id, enable) => {
    const games_info = await getGamesInfo()
    games_info[id].enable = (enable === true)
    await chrome.storage.sync.set({ 'games_info': games_info, })
    logger.info(`${games_info[id].name}'s info change ${games_info[id].enable}`)
};

export const getLastdate = async () => {
    const data = await chrome.storage.sync.get('lastdate')
        .catch(() => { })

    if ('lastdate' in data == false) {
        logger.info('not found lastdate')
        await chrome.storage.sync.set({ 'lastdate': config.lastdate })
        return config.lastdate
    }

    return data.lastdate
};

export const updateLastdate = async () => {
    await chrome.storage.sync.set({ 'lastdate': new Date().toDateString(), })
    logger.info('update lastdate')
}

export const getCheckInTime = async () => {
    const data = await chrome.storage.sync.get('check_in_time')
        .catch(() => { })

    if ('check_in_time' in data == false) {
        logger.info('not found check_in_time')
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
    logger.info(`check in time change "${h}:${m}"`)
}