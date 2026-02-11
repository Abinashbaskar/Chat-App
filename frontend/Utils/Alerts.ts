import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';

export const showToast = (type: ALERT_TYPE, title: string, textBody: string) => {
    Toast.show({
        type,
        title,
        textBody,
    });
};

export const showDialog = (type: ALERT_TYPE, title: string, textBody: string, buttonText: string = 'Close') => {
    Dialog.show({
        type,
        title,
        textBody,
        button: buttonText,
    });
};

export const Alerts = {
    success: (title: string, message: string) => showToast(ALERT_TYPE.SUCCESS, title, message),
    error: (title: string, message: string) => showToast(ALERT_TYPE.DANGER, title, message),
    warning: (title: string, message: string) => showToast(ALERT_TYPE.WARNING, title, message),
    info: (title: string, message: string) => showToast(ALERT_TYPE.INFO, title, message),

    // Dialog versions if needed
    successDialog: (title: string, message: string) => showDialog(ALERT_TYPE.SUCCESS, title, message),
    errorDialog: (title: string, message: string) => showDialog(ALERT_TYPE.DANGER, title, message),
};
