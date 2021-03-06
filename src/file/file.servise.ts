import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import * as path from 'path'
import * as fs from 'fs'
import * as uuid from 'uuid'
import * as dotenv from 'dotenv'
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
dotenv.config()
export enum FileType {
    VIDEO = 'video',
    IMAGE = 'image'
}
@Injectable()
export class FileServise{

    createFile(type: FileType, file): string {
        try {
            const fileExtension = file.originalname.split('.').pop()
            const fileName = uuid.v4() + '.' + fileExtension
            const filePath = path.resolve(__dirname, '..', 'static', type)
            if(!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true})
            }
            fs.writeFileSync(path.resolve(filePath, fileName), file.buffer)
            return type + '/' + fileName
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    removeFile(fileName: string) {
        // const filePath = path.resolve(__dirname, '..', 'static',fileName)
        // try {
        //     fs.unlinkSync(filePath)
        //     console.log("fileremooved")
        //   } catch(err) {
        //     console.error("file error",err)
        //   }
        return true
    }

    async uploadImage(
        file: Express.Multer.File,
      ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
          const upload = v2.uploader.upload_stream({ resource_type: "auto"},(error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
          toStream(file.buffer).pipe(upload);
          
        });
      }
}