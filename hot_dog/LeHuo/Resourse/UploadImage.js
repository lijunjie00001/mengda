
import config from './Config'
import RNFS  from 'react-native-fs'
export default class UploadImage {

    static async UploadImage(image){
        try{
            let successFiles = []
            for(i in image) {
               let obj= await this.fecthImage(image[i]);
               if(obj.code==='1'){
                   let reuslt={
                       path:image[i].path,
                       fileId:obj.result.fileId
                   }
                   successFiles.push(reuslt)
               }
            }
           return successFiles;
        }catch (err){
            throw err
        }
    }
    static async fecthImage(obj) {
        return new Promise(function (resolve, reject) {
            let url = config.baseUrl + 'addFile';
            let formData = new FormData();
            let file = {uri: obj.path, type: 'multipart/form-data', name: 'icon.jpg'}
            formData.append('file',file);
            let header = {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            };
            let request = fetch(url, header);
            request.then(function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.json());
                    }
                    else {
                        error.response = response;
                        reject(response);
                    }
            })['catch'](function (error) {

                    reject(error);

            });

        })
        }

    static async fecthIcon(obj){
        let result= await this.fecthImage(obj);
        console.log('.......',result);
        let image;
        if(result.code==='1'){
             image={
                path:obj.path,
                fileId:result.result.fileId
            }
        }
        return image;
    }
    static async downImage(url,path){
        return new Promise(function (resolve, reject) {
            let filePath=RNFS.TemporaryDirectoryPath + '/' + path;
            let DownloadFileOptions = {
                fromUrl: url,
                toFile: filePath
            }
            let result = RNFS.downloadFile(DownloadFileOptions).promise;
            result.then(function (val) {
                     resolve(filePath)
                }, function (val) {
                    console.log('Error Result:' + JSON.stringify(val));
                }
            ).catch(function (error) {
                console.log(error.message);
            });
        });


    }

};
