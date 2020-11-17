import { Cat } from './interfaces/cat.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat): Promise<void> {
    this.cats.push(cat);
    return;
  }

  findAll(): Promise<Cat[]> {
    return new Promise<Cat[]>((resolve: any) => resolve(this.cats));
  }
}
