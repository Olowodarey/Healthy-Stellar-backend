import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class TestOrderItem {
  @ApiProperty({ example: 'test-uuid' })
  @IsString()
  testId: string;

  @ApiProperty({ example: 'CBC' })
  @IsString()
  testCode: string;
}

export class CreateLabOrderDto {
  @ApiProperty({ example: 'patient-12345-anon' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'provider-001' })
  @IsString()
  providerId: string;

  @ApiProperty({ type: [TestOrderItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestOrderItem)
  tests: TestOrderItem[];

  @ApiPropertyOptional({ example: 'routine' })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  clinicalInfo?: string;
}

export class CreateLabResultDto {
  @ApiProperty({ example: 'order-uuid' })
  @IsString()
  orderId: string;

  @ApiProperty({ example: 'test-uuid' })
  @IsString()
  testId: string;

  @ApiProperty({ example: '14.5' })
  @IsString()
  result: string;

  @ApiProperty({ example: 'g/dL' })
  @IsString()
  unit: string;

  @ApiProperty({ example: '12.0-16.0' })
  @IsString()
  referenceRange: string;

  @ApiProperty({ example: 'tech-001' })
  @IsString()
  performedBy: string;
}

export class CreateSpecimenDto {
  @ApiProperty({ example: 'order-uuid' })
  @IsString()
  orderId: string;

  @ApiProperty({ example: 'patient-12345-anon' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'Blood' })
  @IsString()
  specimenType: string;

  @ApiProperty({ example: 'phlebotomist-001' })
  @IsString()
  collectedBy: string;
}
