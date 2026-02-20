import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

// Entities
import {
  MedicalCodeRegistry,
  DataQualityReport,
  ClinicalAlertEntity,
  GovernancePolicyEntity,
  GovernanceComplianceLog,
  ReferenceDataUpdateLog,
} from './entities/medical-validation.entities';

// Services
import { Icd10ValidationService } from './services/icd10-validation.service';
import { CptValidationService } from './services/cpt-validation.service';
import { LoincValidationService } from './services/loinc-validation.service';
import { ClinicalDataQualityService } from './services/clinical-data-quality.service';
import { ClinicalDecisionSupportService } from './services/clinical-decision-support.service';
import { ReferenceDataService } from './services/reference-data.service';
import { DataGovernanceService } from './services/data-governance.service';
import { MedicalMonitoringService } from '../medical-monitoring/medical-monitoring.service';

// Controller
import { MedicalValidationController } from './medical-validation.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      MedicalCodeRegistry,
      DataQualityReport,
      ClinicalAlertEntity,
      GovernancePolicyEntity,
      GovernanceComplianceLog,
      ReferenceDataUpdateLog,
    ]),
  ],
  controllers: [MedicalValidationController],
  providers: [
    Icd10ValidationService,
    CptValidationService,
    LoincValidationService,
    ClinicalDataQualityService,
    ClinicalDecisionSupportService,
    ReferenceDataService,
    DataGovernanceService,
    MedicalMonitoringService,
  ],
  exports: [
    Icd10ValidationService,
    CptValidationService,
    LoincValidationService,
    ClinicalDataQualityService,
    ClinicalDecisionSupportService,
    ReferenceDataService,
    DataGovernanceService,
    MedicalMonitoringService,
  ],
})
export class MedicalValidationModule {}
