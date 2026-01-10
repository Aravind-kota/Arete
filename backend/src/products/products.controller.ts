import { Controller, Get, Query, Param, ValidationPipe, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductFilterDto } from './dto/product-filter.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query(new ValidationPipe({ transform: true })) filterDto: ProductFilterDto) {
    return this.productsService.findAll(filterDto);
  }

  @Get('count')
  count() {
    return this.productsService.count();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }
}
