import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

type CategoryArticle = {
  categoryId: number;
  articleId: number;
};

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  findOne(id: number) {
    return this.prisma.category.findFirst({
      where: {
        id,
      },
    });
  }

  async findMany(categoriesList: Array<CategoryArticle>) {
    const categories = [];
    const ids = [];
    for (const obj of categoriesList) {
      ids.push(obj?.categoryId);
    }
    for (const id of ids) {
      categories.push(await this.findOne(id));
    }
    return categories;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: updateCategoryDto,
    });
  }

  remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
