import { IsInt } from 'class-validator';

export class ListAllEntitiesDto {
  @IsInt()
  readonly limit: number;
}