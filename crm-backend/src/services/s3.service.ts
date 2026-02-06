import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface UploadFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const region = this.configService.get<string>('S3_REGION', 'auto');
    const accessKeyId =
      this.configService.get<string>('S3_ACCESS_KEY_ID') || '';
    const secretAccessKey =
      this.configService.get<string>('S3_SECRET_ACCESS_KEY') || '';

    const config = {
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      endpoint: undefined as string | undefined,
      region: region || 'us-east-1',
    };

    if (endpoint) {
      config.endpoint = endpoint;
    }

    config.region = region;

    this.s3Client = new S3Client(config);
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME', '');
  }

  async uploadFile(file: UploadFile, folder: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const key = `${folder}/${timestamp}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await this.s3Client.send(command);

      const s3Url = `${key}`;
      return s3Url;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to upload file to S3';
      throw new Error(message);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract key from S3 URL
      const url = new URL(fileUrl);
      const key = url.pathname.substring(1); // Remove leading slash

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to delete file from S3';
      throw new Error(message);
    }
  }
}
