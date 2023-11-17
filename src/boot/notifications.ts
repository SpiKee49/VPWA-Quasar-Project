import { useQuasar } from 'quasar'

const $q = useQuasar()

function SuccessNotification(text: string) {
    $q.notify({
        position: 'top',
        color: 'positive',
        message: "You've been registered successfuly, continue by logging in",
    })
}

function WarningNotification(text: string) {
    $q.notify({
        position: 'top',
        color: 'warning',
        message: "You've been registered successfuly, continue by logging in",
    })
}
function ErrorNotification(text: string) {
    $q.notify({
        position: 'top',
        color: 'error',
        message: "You've been registered successfuly, continue by logging in",
    })
}
function InfoNotification(text: string) {
    $q.notify({
        position: 'top',
        color: 'info',
        message: "You've been registered successfuly, continue by logging in",
    })
}

export {
    SuccessNotification,
    ErrorNotification,
    WarningNotification,
    InfoNotification,
}
