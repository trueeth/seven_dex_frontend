export function formatTimestamp(timestamp: number) {

    const now = new Date()
    const period = now.getTime() / 1000 - timestamp

    const months = Math.floor(period / (86400 * 30))
    const days = Math.floor(period / 86400 - months * 30)
    const hours = Math.floor(period % 86400 / 3600)

    return `${months !== 0 ? months + ' Month ' : ''}` + `${days !== 0 ? days + ' Days ' : ''}` + `${hours + ' Hours '}`
}