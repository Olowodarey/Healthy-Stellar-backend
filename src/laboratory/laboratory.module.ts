import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabTest } from './entities/lab-test.entity';
import { LabOrder } from './entities/lab-order.entity';
import { LabResult } from './entities/lab-result.entity';
import { Specimen } from './entities/specimen.entity';
import { LaboratoryController } from './controllers/laboratory.controller';
import { LaboratoryService } from './services/laboratory.service';

@Module({
  imports: [TypeOrmModule.forFeature([LabTest, LabOrder, LabResult, Specimen])],
  controllers: [LaboratoryController],
  providers: [LaboratoryService],
  exports: [LaboratoryService],
})
export class LaboratoryModule {}
