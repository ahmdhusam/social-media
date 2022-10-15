import { unlink } from 'fs/promises';
import sharp from 'sharp';

interface ISizeOptions {
  width: number;
  height: number;
}

export class ImagesService {
  async generateFilePath(userId: string, file: Buffer, options: ISizeOptions): Promise<string> {
    const filePath = this.generatePath(userId);
    await sharp(file)
      .resize(options.width, options.height)
      .jpeg({ quality: 90 })
      .toFormat('jpg')
      .toFile(`public${filePath}`);

    return filePath;
  }

  private generatePath(userId: string): string {
    return `/images/users/${userId}-${Date.now().toString(36)}.jpg`;
  }

  delete(path: string): Promise<void> {
    return unlink(`public${path}`);
  }
}
