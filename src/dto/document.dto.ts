export interface CreateDocumentDTO {
  name: string;
  category: string;
  documentDate: Date | string;
  partiesInvolved: string;
}

export interface UpdateDocumentDTO {
  name?: string;
  category?: string;
  documentDate?: Date | string;
  partiesInvolved?: string;
}
