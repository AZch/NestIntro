import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Redirect, SetMetadata, UseFilters, UseGuards, UseInterceptors, UsePipes,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CreateCatDto } from './dto/create-cat.dto';
import { ListAllEntitiesDto } from './dto/list-all-entities.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { CatsService } from './cats.service';
import { CustomParseIntPipe } from '../common/pipes/custom-parse-int.pipe';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { RolesGuard } from '../common/guards/roles.guard';
import { HttpExeptionFilter } from '../common/filters/http-exeption.filter';
import { Roles } from '../common/decorators/roles.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { User } from '../common/decorators/user.decorator';
import { UserEntity } from '../../../sample/21-serializer/src/entities/user.entity';
import { Auth } from '../common/decorators/auth.decorator';
import { Worker } from 'worker_threads';
import { DynamicPool } from 'node-worker-threads-pool';

function runService(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./service.js', { workerData });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

const dynamicPool = new DynamicPool(4);

@Controller('cats')
@UseGuards(new RolesGuard())
@UseInterceptors(LoggingInterceptor)
// @Controller({ host: 'admin.example.com' })
export class CatsController {
  @Inject()
  private readonly catsService: CatsService;

  @Post()
  // @UsePipes(new JoiValidationPipe(createCatSchema))
  @UseFilters(new HttpExeptionFilter())
  @HttpCode(HttpStatus.CREATED)
  // @SetMetadata('roles', ['admin'])
  @Roles('admin')
  async create(@Body() createCatDto: CreateCatDto): Promise<string> {
    await this.catsService.create(createCatDto);
    return 'cat created';
  }

  @Post()
  @Header('Cache-Control', 'none')
  @Redirect('https://docs.nestjs.com', 302)
  createWithRedirect(@Body() createCatDto: CreateCatDto): string {
    throw new ForbiddenException();
    this.catsService.create(createCatDto);
    return 'create with redirect';
  }

  @Get('all')
  async findAll(@Query() query: ListAllEntitiesDto): Promise<string> {
    const worker = new Worker('./worker.js', {
      workerData: {
        value: 15,
        path: './worker.ts',
      },
    });
    dynamicPool
      .exec({
        task: (n) => n + 1,
        param: 1,
      })
      .then((result) => {
        console.log(result);
      });

    dynamicPool
      .exec({
        task: (n) => n + 2,
        param: 20,
      })
      .then((result) => {
        console.log(result);
      });
    await this.catsService.findAll();
    return `This action returns all cats (limit: ${query.limit} items) ${result}`;
  }

  @Get(':id')
  findOne(@Param('id', CustomParseIntPipe) id: number): Observable<string> {
    return of(`This action returns a #${id} cat`);
  }

  @Get(':id')
  @Auth('admin')
  findByUserOne(@User('firstName') user: UserEntity): Observable<string> {
    return of(`This action returns a #${user} user`);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<string> {
    return `This action updates a #${id} cat with ${updateCatDto}`;
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return `This action removes a #${id} cat`;
  }

  // @Post()
  // createWithResponse(@Res() res: Response) {
  //   res.status(HttpStatus.CREATED).send();
  // }
  //
  // @Get()
  // findAllWithResponse(@Res() res: Response) {
  //   res.status(HttpStatus.OK).json([]);
  // }
}
