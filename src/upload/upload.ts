import { applyDecorators, UnsupportedMediaTypeException, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
const MAX_FILE_COUNT = 9;

//上传类型验证
export function filterFilter(type: string) {
  return (req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (!file.mimetype.includes(type)) {
      callback(new UnsupportedMediaTypeException('Error: Loaded file format is incorrect.(Image only)'), false);
    } else {
      callback(null, true);
    }
  };
}

//文件上传
export function upload(field = 'file', options: MulterOptions) {
  return applyDecorators(UseInterceptors(FileInterceptor(field, options)));
}

export function uploadMulti(field = 'file', options: MulterOptions) {
  return applyDecorators(UseInterceptors(FilesInterceptor(field, MAX_FILE_COUNT, options)));
}

//图片上传
export function image(field = 'file') {
  return upload(field, {
    limits: Math.pow(1024, 2) * 2,
    fileFilter: filterFilter('image'),
  } as MulterOptions);
}

export function images(field = 'file') {
  return uploadMulti(field, {
    limits: Math.pow(1024, 2) * 2,
    fileFilter: filterFilter('image'),
  } as MulterOptions);
}

//文档上传
export function document(field = 'file') {
  return upload(field, {
    limits: Math.pow(1024, 2) * 5,
    fileFilter: filterFilter('document'),
  } as MulterOptions);
}
