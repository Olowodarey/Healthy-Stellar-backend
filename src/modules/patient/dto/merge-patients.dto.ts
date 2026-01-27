export class MergePatientsDto {
  @ApiProperty()
  @IsString()
  masterPatientId: string;

  @ApiProperty()
  @IsString()
  duplicatePatientId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}
