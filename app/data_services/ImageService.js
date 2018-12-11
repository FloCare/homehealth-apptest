import AWS from 'aws-sdk';
import {decode, encode} from 'base64-arraybuffer';
import {generateUUID} from '../utils/utils';
import {Image} from '../utils/data/schemas/Models/image/Image';

export class ImageService {
    static imageService;

    static initialiseService(floDB, store) {
        ImageService.imageService = new ImageService(floDB, store);
    }

    static bucketName = 'health.flocare.notes';

    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
        this.s3 = new AWS.S3({
            accessKeyId: 'AKIAIXJUSMYAPRXD25ZA', secretAccessKey: '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'
        });
    }

    static getInstance() {
        if (!ImageService.imageService) {
            throw new Error('Image Data service called without being initialised');
        }
        return ImageService.imageService;
    }

    uploadImageDataToS3(body, imageUUID) {
        console.log('attempt to upload');
        // const uploadParams = {Bucket: ImageService.bucketName, Key: generateUUID(), Body: `data:image/png;base64,${body}`};
        const uploadParams = {Bucket: ImageService.bucketName, Key: imageUUID, Body: body};
        return new Promise((resolve, reject) => {
            this.s3.upload(uploadParams, (err, data) => {
                if (err) {
                    console.log('Error upload', err);
                    reject(err);
                } if (data) {
                    console.log('Upload Success', data);
                    resolve(data);
                }
            });
        });
    }

    uploadImageToS3(imagePath) {
        console.log('attempt to upload');
        const uploadParams = {Bucket: 'health.flocare.notes', Key: generateUUID(), Body: imagePath};
        return new Promise((resolve, reject) => {
            this.s3.upload(uploadParams, (err, data) => {
                if (err) {
                    console.log('Error upload', err);
                    reject(err);
                } if (data) {
                    console.log('Upload Success', data);
                    resolve(data);
                }
            });
        });
    }

    getIDByBucketAndKey(bucket, key) {
        return `Bucket:${bucket}/Key:${key}`;
    }

    getBase64DataForBucketAndKey(bucket, key) {
        const image = this.getImageForBucketAndKey(bucket, key);
        if (!image) { return undefined; }
        return image.uriPrefix + encode(image.rawData);
    }

    getImageForBucketAndKey(bucket, key) {
        if (!bucket || !key) {
            throw new Error('Bucket/Key illegal');
        }
        return this.getImageByID(this.getIDByBucketAndKey(bucket, key));
    }

    getImageByID(imageID) {
        const imageResult = this.floDB.objectForPrimaryKey(Image, imageID);
        console.log(`image query ${imageID}`, !!imageResult);
        return imageResult;
    }

    getImageListener(imageID, callback) {
        const images = this.floDB.objects(Image).filtered('imageID = $0', imageID);
        images.addListener(callback);
        return () => images.removeListener(callback);
    }

    createImage(imageID, base64String) {
        this.floDB.write(() => {
            console.log('going to decode');
            this.floDB.create(Image, {
                imageID,
                uriPrefix: 'data:image/jpeg;base64,',
                rawData: decode(base64String)
            }, true);
            console.log('done decoding');
        });
    }

    fetchAndSaveImageForBucketAndKey(Bucket, Key) {
        // const dataJSON = JSON.parse(note.data);
        console.log('fetch image called', Bucket, Key);
        if (Bucket && Key) {
            console.log('fetch image s3 call');
            return new Promise((resolve, reject) => {
                this.s3.getObject({Bucket, Key}, (err, data) => {
                    if (err) {
                        console.log('error fetching image', err);
                        reject(err);
                    } else {
                        console.log('s3 data recvd for image');
                        this.createImage(this.getIDByBucketAndKey(Bucket, Key), data.Body.toString());
                        resolve();
                    }
                });
            });
        }
    }
}
