import Instabug from 'instabug-reactnative';

export const setAutoScreenShotForInstabug = (autoScreenShotFlag) => {
    Instabug.setEnabledAttachmentTypes(autoScreenShotFlag, true, true, true, true);
};

export const setUserForInstabug = (email, name) => {
    Instabug.identifyUserWithEmail(email, name);
};
