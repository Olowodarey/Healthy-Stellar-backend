import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum IncidentType {
  DATA_BREACH = 'DATA_BREACH',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  RANSOMWARE = 'RANSOMWARE',
  INSIDER_THREAT = 'INSIDER_THREAT',
  PHISHING = 'PHISHING',
  MALWARE = 'MALWARE',
  DENIAL_OF_SERVICE = 'DENIAL_OF_SERVICE',
  LOST_DEVICE = 'LOST_DEVICE',
  IMPROPER_DISCLOSURE = 'IMPROPER_DISCLOSURE',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum IncidentStatus {
  DETECTED = 'DETECTED',
  INVESTIGATING = 'INVESTIGATING',
  CONTAINED = 'CONTAINED',
  REMEDIATED = 'REMEDIATED',
  CLOSED = 'CLOSED',
  ESCALATED = 'ESCALATED',
}

@Entity('security_incidents')
@Index(['status', 'severity'])
@Index(['type', 'createdAt'])
export class SecurityIncident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: IncidentType })
  type: IncidentType;

  @Column({ type: 'enum', enum: IncidentSeverity })
  severity: IncidentSeverity;

  @Column({ type: 'enum', enum: IncidentStatus, default: IncidentStatus.DETECTED })
  status: IncidentStatus;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  affectedSystem: string | null;

  @Column({ type: 'integer', default: 0 })
  affectedPatientsCount: number;

  @Column({ type: 'jsonb', nullable: true })
  affectedDataTypes: string[] | null;

  @Column({ type: 'boolean', default: false })
  phiInvolved: boolean;

  @Column({ type: 'boolean', default: false })
  breachNotificationRequired: boolean;

  @Column({ type: 'boolean', default: false })
  hhsNotified: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  hhsNotificationDate: Date | null;

  @Column({ type: 'boolean', default: false })
  patientsNotified: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  patientNotificationDate: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  detectedAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  containedAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  remediatedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  rootCause: string | null;

  @Column({ type: 'text', nullable: true })
  remediationSteps: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  reportedBy: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  assignedTo: string | null;

  @Column({ type: 'jsonb', nullable: true })
  relatedAuditLogIds: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  evidenceLinks: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  timeline: Array<{ timestamp: Date; event: string; actor: string }> | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
