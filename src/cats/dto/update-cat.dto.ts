import { IsInt, IsString } from 'class-validator';

export class UpdateCatDto {
  @IsInt()
  readonly age: number;

  @IsString
  readonly breed: string;
}