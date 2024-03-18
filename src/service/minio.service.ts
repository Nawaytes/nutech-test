/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as Minio from "minio";
// @ts-ignore
import * as fs from "fs";
import configConstants from "../config/constants";
import * as FileType from "file-type";
export default class MinioService {
  async minioClient() {
    return new Minio.Client({
      endPoint: configConstants.MINIO_HOST,
      port: configConstants.MINIO_PORT,
      useSSL: false,
      accessKey: configConstants.MINIO_ACCESS_KEY,
      secretKey: configConstants.MINIO_SECRET_KEY,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    filePathName: string,
    bucketName: string
  ): Promise<string> {
    try {
      if (!file) {
        throw new Error("No file provided");
      }

      const filePath = __dirname + "/../../" + file.path;
      const buffer = await this.getFileBufferAndLength(filePath);

      // const objectName = `images/${uuidv4()}-${file.originalname}`; // Use the original file name as the object name

      const minioClient = await this.minioClient();

      await minioClient.putObject(
        bucketName,
        filePathName,
        buffer.buffer,
        buffer.length
      );
      console.info(
        `File ${filePathName} uploaded successfully to bucket ${bucketName}`
      );
      return `http://103.150.93.30:9000/${bucketName}/${filePathName}`;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  private async readFileAsBuffer(filePath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  private async getFileBufferAndLength(filePath: string) {
    const fileBuffer = await this.readFileAsBuffer(filePath);
    return {
      buffer: fileBuffer,
      length: fileBuffer.length,
    };
  }

  async getBuffer(bucketName: string, pathName: string): Promise<any> {
    try {
      const minioClient = await this.minioClient();
      let buffer: Buffer[] = [];

      const dataStream = await minioClient.getObject(bucketName, pathName);

      const onDataProcessed = new Promise<Buffer>((resolve, reject) => {
        dataStream.on("error", (err) => {
          console.error("Error during download:", err);
          reject(new Error("Failed to download object from MinIO"));
        });

        dataStream.on("data", (chunk) => {
          buffer.push(chunk);
        });

        dataStream.on("end", () => {
          if (buffer.length === 0) {
            console.error("No data was downloaded from MinIO.");
            reject(new Error("No data received from MinIO"));
          }

          const objectData = Buffer.concat(buffer);
          resolve(objectData);
        });
      });

      // Wait for the Promise to resolve synchronously
      const objectData = await onDataProcessed;
      const fileType = await FileType.fromBuffer(objectData);
      console.info(
        `Downloaded ${objectData.length} bytes from ${bucketName}/${pathName}`
      );

      return {
        objectData,
        mime: fileType,
      };
    } catch (error) {
      console.error("Error getting object from MinIO:", error);
      throw new Error("Failed to get object from MinIO");
    }
  }
}
