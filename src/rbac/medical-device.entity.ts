import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum DeviceType {
  PATIENT_MONITOR = 'PATIENT_MONITOR',
  INFUSION_PUMP = 'INFUSION_PUMP',
  VENTILATOR = 'VENTILATOR',
  ECG_MACHINE = 'ECG_MACHINE',
  MRI_SCANNER = 'MRI_SCANNER',
  CT_SCANNER = 'CT_SCANNER',
  ULTRASOUND = 'ULTRASOUND',
  LAB_ANALYZER = 'LAB_ANALYZER',
  DRUG_DISPENSER = 'DRUG_DISPENSER',
  WEARABLE_SENSOR = 'WEARABLE_SENSOR',
  MOBILE_CART = 'MOBILE_CART',
  GATEWAY = 'GATEWAY',
}

export enum DeviceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  MAINTENANCE = 'MAINTENANCE',
  DECOMMISSIONED = 'DECOMMISSIONED',
}

export enum DeviceTrustLevel {
  UNTRUSTED = 'UNTRUSTED',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Entity('medical_devices')
@Index(['deviceSerialNumber'], { unique: true })
@Index(['status', 'type'])
export class MedicalDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'enum', enum: DeviceType })
  type: DeviceType;

  @Column({ type: 'varchar', length: 100, unique: true })
  deviceSerialNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  manufacturer: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  model: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  firmwareVersion: string | null;

  @Column({ type: 'enum', enum: DeviceStatus, default: DeviceStatus.INACTIVE })
  status: DeviceStatus;

  @Column({ type: 'enum', enum: DeviceTrustLevel, default: DeviceTrustLevel.UNTRUSTED })
  trustLevel: DeviceTrustLevel;

  @Column({ type: 'text', nullable: true })
  certificateFingerprint: string | null;

  @Column({ type: 'text', nullable: true })
  publicKey: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  apiKeyHash: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  lastKnownIpAddress: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastSeenAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  certExpiresAt: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  allowedCapabilities: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  allowedIpRanges: string[] | null;

  @Column({ type: 'integer', default: 0 })
  failedAuthAttempts: number;

  @Column({ type: 'timestamptz', nullable: true })
  suspendedUntil: Date | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  registeredBy: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
