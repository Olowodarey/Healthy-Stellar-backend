import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMedicalValidationTables1700000000000 implements MigrationInterface {
  name = 'CreateMedicalValidationTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Medical Code Registry
    await queryRunner.query(`
      CREATE TABLE "medical_code_registry" (
        "id"            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "codeSystem"    VARCHAR(20)  NOT NULL,
        "code"          VARCHAR(50)  NOT NULL,
        "description"   VARCHAR(500) NOT NULL,
        "category"      VARCHAR(100),
        "isActive"      BOOLEAN      NOT NULL DEFAULT true,
        "version"       VARCHAR(20),
        "effectiveDate" DATE,
        "expiryDate"    DATE,
        "metadata"      JSONB,
        "createdAt"     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        "updatedAt"     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        CONSTRAINT "UQ_medical_code_registry_system_code" UNIQUE ("codeSystem", "code")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_medical_code_registry_system_active"
        ON "medical_code_registry" ("codeSystem", "isActive")
    `);

    // Data Quality Reports
    await queryRunner.query(`
      CREATE TABLE "data_quality_reports" (
        "id"               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "recordId"         VARCHAR(255) NOT NULL,
        "recordType"       VARCHAR(100) NOT NULL,
        "overallScore"     DECIMAL(5,2) NOT NULL,
        "qualityScores"    JSONB        NOT NULL,
        "issues"           JSONB        NOT NULL,
        "isPassing"        BOOLEAN      NOT NULL DEFAULT false,
        "passingThreshold" INT          NOT NULL DEFAULT 70,
        "assessedAt"       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_data_quality_reports_record"
        ON "data_quality_reports" ("recordId", "recordType");
      CREATE INDEX "IDX_data_quality_reports_assessed"
        ON "data_quality_reports" ("assessedAt")
    `);

    // Clinical Alerts
    await queryRunner.query(`
      CREATE TABLE "clinical_alerts" (
        "alertId"                UUID         PRIMARY KEY,
        "alertType"              VARCHAR(100) NOT NULL,
        "severity"               VARCHAR(20)  NOT NULL,
        "title"                  VARCHAR(200) NOT NULL,
        "message"                TEXT         NOT NULL,
        "patientId"              VARCHAR(255) NOT NULL,
        "affectedCodes"          TEXT,
        "recommendations"        JSONB        NOT NULL,
        "references"             JSONB,
        "requiresAcknowledgment" BOOLEAN      NOT NULL DEFAULT true,
        "isActionable"           BOOLEAN      NOT NULL DEFAULT true,
        "isResolved"             BOOLEAN      NOT NULL DEFAULT false,
        "resolvedBy"             VARCHAR(255),
        "resolvedAt"             TIMESTAMPTZ,
        "overrideReason"         TEXT,
        "createdAt"              TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_clinical_alerts_patient_type"
        ON "clinical_alerts" ("patientId", "alertType");
      CREATE INDEX "IDX_clinical_alerts_severity_resolved"
        ON "clinical_alerts" ("severity", "isResolved");
      CREATE INDEX "IDX_clinical_alerts_created"
        ON "clinical_alerts" ("createdAt")
    `);

    // Governance Policies
    await queryRunner.query(`
      CREATE TABLE "governance_policies" (
        "id"            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "policyName"    VARCHAR(200) NOT NULL UNIQUE,
        "policyType"    VARCHAR(100) NOT NULL,
        "rules"         JSONB        NOT NULL,
        "effectiveDate" DATE         NOT NULL,
        "expiryDate"    DATE,
        "isActive"      BOOLEAN      NOT NULL DEFAULT true,
        "createdBy"     VARCHAR(100),
        "createdAt"     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        "updatedAt"     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_governance_policies_type_active"
        ON "governance_policies" ("policyType", "isActive")
    `);

    // Governance Compliance Logs
    await queryRunner.query(`
      CREATE TABLE "governance_compliance_logs" (
        "id"           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "policyId"     UUID         NOT NULL REFERENCES "governance_policies"("id"),
        "resourceId"   VARCHAR(255) NOT NULL,
        "resourceType" VARCHAR(100) NOT NULL,
        "isCompliant"  BOOLEAN      NOT NULL DEFAULT true,
        "violations"   JSONB,
        "checkedBy"    VARCHAR(100),
        "checkedAt"    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_governance_compliance_logs_policy_checked"
        ON "governance_compliance_logs" ("policyId", "checkedAt");
      CREATE INDEX "IDX_governance_compliance_logs_compliant_checked"
        ON "governance_compliance_logs" ("isCompliant", "checkedAt")
    `);

    // Reference Data Update Logs
    await queryRunner.query(`
      CREATE TABLE "reference_data_updates" (
        "id"             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "codeSystem"     VARCHAR(50)  NOT NULL,
        "version"        VARCHAR(20)  NOT NULL,
        "totalCodes"     INT          NOT NULL DEFAULT 0,
        "addedCodes"     INT          NOT NULL DEFAULT 0,
        "updatedCodes"   INT          NOT NULL DEFAULT 0,
        "deprecatedCodes" INT         NOT NULL DEFAULT 0,
        "sourceUrl"      VARCHAR(200),
        "updatedBy"      VARCHAR(100),
        "updateSummary"  JSONB,
        "updatedAt"      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_reference_data_updates_system_updated"
        ON "reference_data_updates" ("codeSystem", "updatedAt")
    `);

    // Seed default governance policies
    await queryRunner.query(`
      INSERT INTO "governance_policies" ("policyName", "policyType", "rules", "effectiveDate", "isActive", "createdBy")
      VALUES
        (
          'HIPAA PHI Protection Policy',
          'PHI_PROTECTION',
          '{"requireEncryption": true, "auditAllAccess": true, "phiFields": ["ssn", "dob", "mrn", "name", "address", "phone", "email"]}',
          NOW(),
          true,
          'SYSTEM'
        ),
        (
          'Clinical Data Completeness Policy',
          'DATA_QUALITY',
          '{"requiredFields": ["patientId", "providerId", "encounterDate"], "minCompletenessScore": 80}',
          NOW(),
          true,
          'SYSTEM'
        ),
        (
          'HIPAA Audit Requirement Policy',
          'AUDIT_REQUIREMENT',
          '{"requireCreatedBy": true, "requireUpdatedBy": true, "logAllAccess": true}',
          NOW(),
          true,
          'SYSTEM'
        ),
        (
          'Patient Consent Policy',
          'CONSENT_MANAGEMENT',
          '{"requireConsent": true, "consentTypes": ["treatment", "research", "marketing"]}',
          NOW(),
          true,
          'SYSTEM'
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "reference_data_updates"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "governance_compliance_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "governance_policies"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "clinical_alerts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "data_quality_reports"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "medical_code_registry"`);
  }
}
