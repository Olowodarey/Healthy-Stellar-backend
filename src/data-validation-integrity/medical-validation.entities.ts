import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('medical_code_registry')
@Index(['codeSystem', 'code'], { unique: true })
@Index(['codeSystem', 'isActive'])
export class MedicalCodeRegistry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  codeSystem: string; // ICD-10, CPT, LOINC, NDC, SNOMED

  @Column({ length: 50 })
  code: string;

  @Column({ length: 500 })
  description: string;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 20, nullable: true })
  version: string;

  @Column({ type: 'date', nullable: true })
  effectiveDate: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('data_quality_reports')
@Index(['recordId', 'recordType'])
@Index(['assessedAt'])
export class DataQualityReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  recordId: string;

  @Column({ length: 100 })
  recordType: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  overallScore: number;

  @Column({ type: 'jsonb' })
  qualityScores: Record<string, unknown>[];

  @Column({ type: 'jsonb' })
  issues: Record<string, unknown>[];

  @Column({ default: false })
  isPassing: boolean;

  @Column({ type: 'int', default: 70 })
  passingThreshold: number;

  @CreateDateColumn()
  assessedAt: Date;
}

@Entity('clinical_alerts')
@Index(['patientId', 'alertType'])
@Index(['severity', 'isResolved'])
@Index(['createdAt'])
export class ClinicalAlertEntity {
  @PrimaryGeneratedColumn('uuid')
  alertId: string;

  @Column({ length: 100 })
  alertType: string;

  @Column({ length: 20 })
  severity: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column()
  patientId: string;

  @Column({ type: 'simple-array', nullable: true })
  affectedCodes: string[];

  @Column({ type: 'jsonb' })
  recommendations: string[];

  @Column({ type: 'jsonb', nullable: true })
  references: string[];

  @Column({ default: true })
  requiresAcknowledgment: boolean;

  @Column({ default: true })
  isActionable: boolean;

  @Column({ default: false })
  isResolved: boolean;

  @Column({ nullable: true })
  resolvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @Column({ nullable: true })
  overrideReason: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('governance_policies')
@Index(['policyType', 'isActive'])
export class GovernancePolicyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200, unique: true })
  policyName: string;

  @Column({ length: 100 })
  policyType: string;

  @Column({ type: 'jsonb' })
  rules: Record<string, unknown>;

  @Column({ type: 'date' })
  effectiveDate: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 100, nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('governance_compliance_logs')
@Index(['policyId', 'checkedAt'])
@Index(['isCompliant', 'checkedAt'])
export class GovernanceComplianceLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  policyId: string;

  @ManyToOne(() => GovernancePolicyEntity)
  @JoinColumn({ name: 'policyId' })
  policy: GovernancePolicyEntity;

  @Column()
  resourceId: string;

  @Column({ length: 100 })
  resourceType: string;

  @Column({ default: true })
  isCompliant: boolean;

  @Column({ type: 'jsonb', nullable: true })
  violations: Record<string, unknown>[];

  @Column({ length: 100, nullable: true })
  checkedBy: string;

  @CreateDateColumn()
  checkedAt: Date;
}

@Entity('reference_data_updates')
@Index(['codeSystem', 'updatedAt'])
export class ReferenceDataUpdateLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  codeSystem: string;

  @Column({ length: 20 })
  version: string;

  @Column({ type: 'int', default: 0 })
  totalCodes: number;

  @Column({ type: 'int', default: 0 })
  addedCodes: number;

  @Column({ type: 'int', default: 0 })
  updatedCodes: number;

  @Column({ type: 'int', default: 0 })
  deprecatedCodes: number;

  @Column({ length: 200, nullable: true })
  sourceUrl: string;

  @Column({ length: 100, nullable: true })
  updatedBy: string;

  @Column({ type: 'jsonb', nullable: true })
  updateSummary: Record<string, unknown>;

  @CreateDateColumn()
  updatedAt: Date;
}
