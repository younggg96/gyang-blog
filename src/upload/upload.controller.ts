import { Controller, Post, UploadedFile, UploadedFiles } from '@nestjs/common';
import { image, images } from './upload';
import { sleep } from 'src/helper/helper';

@Controller('upload')
export class UploadController {
  @Post('image')
  @image()
  image(@UploadedFile() file) {
    return {
      url: `http://localhost:3000/${file.path}`,
    };
  }

  @Post('images')
  @images()
  async uploadImgs(@UploadedFiles() files) {
    await sleep(3000);
    const res = files.map((item) => ({
      name: item.originalname,
      url: `http://localhost:3000/${item.path}`,
    }));
    return res;
  }
}
