import { unlink } from 'fs/promises';
import sharp from 'sharp';

interface ISizeOptions {
  width: number;
  height: number;
}

type FolderName = 'users' | 'tweets';

export class ImagesService {
  private static instance: ImagesService;

  static get getInstance(): ImagesService {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  private constructor() {}

  async generateFilePath(
    folderName: FolderName,
    userId: string,
    file: Buffer,
    options?: ISizeOptions
  ): Promise<string> {
    const filePath = this.generatePath(folderName, userId);

    if (options) {
      await sharp(file)
        .resize(options.width, options.height)
        .jpeg({ quality: 90 })
        .toFormat('jpg')
        .toFile(`public${filePath}`);
    } else {
      await sharp(file).jpeg({ quality: 90 }).toFormat('jpg').toFile(`public${filePath}`);
    }

    return filePath;
  }

  private generatePath(folderName: FolderName, userId: string): string {
    return `/images/${folderName}/${userId}-${Date.now().toString(36)}.jpg`;
  }

  delete(path: string): Promise<void> {
    return unlink(`public${path}`);
  }
}
