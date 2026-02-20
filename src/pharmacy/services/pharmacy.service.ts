import { Injectable } from '@nestjs/common';

@Injectable()
export class PharmacyService {
  async addDrug(dto: any) {
    return { id: 'drug-uuid', ...dto };
  }

  async checkInteractions(drugIds: string[], patientId: string) {
    return { safe: true, interactions: [], warnings: [] };
  }

  async fillPrescription(id: string, pharmacistId: string) {
    return { id, status: 'filled', filledBy: pharmacistId };
  }
}
