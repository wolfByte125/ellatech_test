import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return await this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    return product;
  }

  async update(updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id: updateProductDto.product_id },
    });

    if (!product) {
      throw new NotFoundException(`Product Not Found`);
    }

    const previousQuantity: number = product.quantity;
    const newQuantity: number =
      previousQuantity + updateProductDto.quantity_change;

    if (newQuantity < 0) {
      throw new BadRequestException('Stock Is Insufficient');
    }

    product.quantity = newQuantity;
    await this.productsRepository.save(product);

    // INSERT INTO TRANSACTION
    const type = updateProductDto.quantity_change > 0 ? 'INCREASE' : 'DECREASE';
    const trx = this.transactionsRepository.create({
      product,
      user: { id: updateProductDto.user_id },
      type,
      quantity_change: updateProductDto.quantity_change,
      previous_quantity: previousQuantity,
      new_quantity: newQuantity,
    });

    await this.transactionsRepository.save(trx);

    return product;
  }

  async remove(id: string): Promise<Product> {
    const product = await this.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product Not Found`);
    }

    return await this.productsRepository.remove(product);
  }

  async getProductStatus(productId: string) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product Not Found`);
    }

    const status = product.quantity > 0 ? 'IN STOCK' : 'OUT OF STOCK';

    return {
      product_id: product.id,
      name: product.name,
      quantity: product.quantity,
      status,
    };
  }
}
