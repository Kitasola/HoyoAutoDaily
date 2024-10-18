import logger from './utils/logger'

const config = {
    'games_info': {
        'HG0': {
            'id': 'HG0',
            'name': 'Genshin Impact',
            'enable': false,
            'url': null,
        },
        'HG1': {
            'id': 'HG1',
            'name': 'Hokai Star Rail',
            'enable': false,
            'url': null,
        },
        'HG2': {
            'id': 'HG2',
            'name': 'Zenless Zone Zero',
            'enable': false,
            'url': null,
        },
    },
    'lastdate': new Date(0).toDateString(),
    'checking': false,
    'check_in_time': {
        'hour': 1,
        'minutes': 5
    }, // TZ=Asia/Tokyo
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
    logger.debug(`${games_info[id].name}'s info change ${games_info[id].enable}`)
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

export const updateGameURL = async () => {
    const manifest = chrome.runtime.getManifest()
    const games_info = await getGamesInfo()

    for (const game of Object.values(games_info)) {
        const target = manifest.content_scripts.find(
            (script) => script.js.some(
                (file) => file.includes(game.id)
            )
        )
        if (target) {
            games_info[game.id].url = target.matches[0]
        }
    }

    await chrome.storage.sync.set({ 'games_info': games_info, })
    logger.debug(`update games_info url`)
}

export const getChecking = async () => {
    const data = await chrome.storage.sync.get('checking')
        .catch(() => { })

    if ('checking' in data == false) {
        logger.debug('not found checking')
        await chrome.storage.sync.set({ 'checking': config.lastdate })
        return config.checking
    }

    return data.checking
};

export const onChecking = async () => {
    await chrome.storage.sync.set({ 'checking': true, })
    logger.debug('change checking')
}

export const offChecking = async () => {
    await chrome.storage.sync.set({ 'checking': false, })
    logger.debug('change checking')
}