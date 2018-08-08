import Instabug from 'instabug-reactnative';

export const setAutoScreenShotForInstabug = (autoScreenShotFlag) => {
    Instabug.setEnabledAttachmentTypes(autoScreenShotFlag, true, true, true, true);
};
