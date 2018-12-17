import {Image} from '../Image';

export const ImageSchemaV1 = {
    name: Image.getSchemaName(),
    primaryKey: 'imageID',
    properties: {
        imageID: 'string',
        uriPrefix: 'string',
        rawData: 'data'
    }
};
