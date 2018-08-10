import Instabug from 'instabug-reactnative';

export const setAutoScreenShotForInstabug = (autoScreenShotFlag) => {
    Instabug.setEnabledAttachmentTypes(autoScreenShotFlag, true, true, true, true);
};

export const setUserForInstabug = (email, name) => {
    Instabug.identifyUserWithEmail(email, name);
};

export const setFeedbackOptionOnly = () => {
    const chatEnabled = false;
    const bugEnabled = false;
    const feedbackEnabled = true;
    Instabug.setPromptOptionsEnabled(chatEnabled, bugEnabled, feedbackEnabled);
};
