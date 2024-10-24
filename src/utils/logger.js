const logger = (level, message) => console.log(JSON.stringify({
    'app': 'HoyoAutoDaily',
    'level': level,
    'message': message,
    'timestamp': new Date(),
}))

export const debug = process.env.DEBUG ? (message) => logger('Debug', message) : (message) => { }
export const info = (message) => logger('Info', message)
export const warn = (message) => logger('Warn', message)
export const error = (message) => logger('Error', message)
export default { debug, info, warn, error }