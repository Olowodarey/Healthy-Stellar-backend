import { APP_FILTER, APP_GUARD, APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BillingModule } from './billing/billing.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { CommonModule } from './common/common.module';
import { PatientModule } from './patients/patients.module';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { TreatmentPlanningModule } from './treatment-planning/treatment-planning.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { InfectionControlModule } from './infection-control/infection-control.module';
import { TenantModule } from './tenant/tenant.module';
import { DatabaseConfig } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { ValidationModule } from './common/validation/validation.module';
import { MedicalEmergencyErrorFilter } from './common/errors/medical-emergency-error.filter';
import { MedicalDataValidationPipe } from './common/validation/medical-data.validator.pipe';
import { TenantInterceptor } from './tenant/interceptors/tenant.interceptor';
import { ThrottlerConfigService } from './common/throttler/throttler.config';
import { CustomThrottlerGuard } from './common/throttler/custom-throttler.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    // Rate limiting with Redis-backed storage
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfigService,
    }),
    // Application modules
    TenantModule,
    CommonModule,
    AuthModule,
    BillingModule,
    MedicalRecordsModule,
    PatientModule,
    LaboratoryModule,
    DiagnosisModule,
    TreatmentPlanningModule,
    PharmacyModule,
    EmergencyOperationsModule,
    ValidationModule,
    InfectionControlModule,
    NotificationsModule,
    QueueModule,
    FhirModule,
    AccessControlModule,
    StellarModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: MedicalEmergencyErrorFilter,
    },
    {
      provide: APP_PIPE,
      useClass: MedicalDataValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
