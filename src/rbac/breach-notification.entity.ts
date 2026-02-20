import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  MAIL = 'MAIL',
  PHONE = 'PHONE',
  MEDIA = 'MEDIA',
  HHS_PORTAL = 'HHS_PORTAL',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
}

@Entity('breach_notifications')
@Index(['incidentId'])
@Index(['status', 'scheduledAt'])
export class BreachNotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  incidentId: string;

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel;

  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  recipient: string | null;

  @Column({ type: 'text', nullable: true })
  notificationContent: string | null;

  @Column({ type: 'timestamptz' })
  scheduledAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  sentAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  deadlineAt: Date | null;

  @Column({ type: 'integer', default: 0 })
  retryCount: number;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

export enum PolicyType {
  DATA_ACCESS = 'DATA_ACCESS',
  MINIMUM_NECESSARY = 'MINIMUM_NECESSARY',
  ROLE_BASED = 'ROLE_BASED',
  BREAK_GLASS = 'BREAK_GLASS',
  TIME_BASED = 'TIME_BASED',
}

@Entity('access_policies')
@Index(['policyType', 'isActive'])
export class AccessPolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: PolicyType })
  policyType: PolicyType;

  @Column({ type: 'jsonb' })
  rules: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  allowedRoles: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  allowedResources: string[] | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 64, nullable: true })
  createdBy: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  updatedBy: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
