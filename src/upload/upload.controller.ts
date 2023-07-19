import { Controller, Post, UploadedFile, UploadedFiles } from '@nestjs/common';
import { image, images } from './upload';

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
  uploadImgs(@UploadedFiles() files) {
    const res = files.map((item) => {
      return {
        name: item.originalname,
        url: `http://localhost:3000/${item.path}`,
      };
    });
    return res;
  }
}
