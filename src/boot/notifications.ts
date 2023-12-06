import { Notify } from 'quasar'

function SuccessNotification(text: string) {
    Notify.create({
        position: 'top',
        color: 'positive',
        message: text,
    })
}

function WarningNotification(text: string) {
    Notify.create({
        position: 'top',
        color: 'warning',
        message: text,
    })
}
function ErrorNotification(text: string) {
    Notify.create({
        position: 'top',
        color: 'error',
        message: text,
    })
}
function InfoNotification(text: string) {
    Notify.create({
        position: 'top',
        color: 'info',
        message: text,
    })
}

//src: https://developer.mozilla.org/en-US/docs/Web/API/Notification/permission_static
function sendNotification(title: string, body: string) {
    if (!('Notification' in window)) {
        // Check if the browser supports notifications
        console.warn(
            'This browser does not support desktop notification. Message notifications will not be present at this moment.'
        )
    } else if (Notification.permission === 'granted') {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        const notification = new Notification(title, { body: body })

        setTimeout(() => notification.close(), 4000)
        // …
    } else if (Notification.permission !== 'denied') {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === 'granted') {
                const notification = new Notification(title, { body: body })

                setTimeout(() => notification.close(), 4000)

                // …
            } else if (permission === 'denied') {
                console.warn(
                    'Message notifications will not be present at this moment due to not allowing notifications in your browser.'
                )
            }
        })
    }
}

export {
    SuccessNotification,
    ErrorNotification,
    WarningNotification,
    InfoNotification,
    sendNotification,
}
