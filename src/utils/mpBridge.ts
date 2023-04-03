
const onCallbackIdList = {}


export function getWeb3Provider() {
    return {
        on(event: string, cb: () => void) {
            postMessage({ action: 'on', payload: { event } })
            onCallbackIdList[event] = cb
        },
        request(params) {
            return new Promise((resolve, reject) => {
                postMessage({
                    action: 'request',
                    payload: params,
                    cb: (payload) => {
                        if (payload?.error) {
                            reject(payload?.message)
                        } else {
                            resolve(payload)
                        }
                    },
                })
            })
        },
        removeEventListener(event: string) {
            if (onCallbackIdList[event]) {
                onCallbackIdList[event] = undefined
            }
        },
    }
}
