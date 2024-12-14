import { Module } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { ConfigsController } from './configs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, ConfigSchema } from './schemas/config.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }])],
  controllers: [ConfigsController],
  providers: [ConfigsService],
  exports: [ConfigsService]
})
export class ConfigsModule { }
