export interface CreateAuditDTO {
  name: string;
  type: string;
  periodStart: Date | string;
  periodEnd: Date | string;
  auditor: string;
  completionDate: Date | string;
}

export interface UpdateAuditDTO {
  name?: string;
  type?: string;
  periodStart?: Date | string;
  periodEnd?: Date | string;
  auditor?: string;
  completionDate?: Date | string;
}
