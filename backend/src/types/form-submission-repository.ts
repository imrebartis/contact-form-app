'use strict';

export interface FormSubmissionResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  queryType: string;
  created_at: Date;
  updated_at: Date;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  queryType: string;
}

export interface FormSubmissionRepository {
  create(data: FormData): Promise<FormSubmissionResult>;
  findAll(): Promise<FormSubmissionResult[]>;
  findByPk(id: string): Promise<FormSubmissionResult | null>;
  deleteById(id: string): Promise<boolean>;
  update(
    id: string,
    data: Partial<FormData>
  ): Promise<FormSubmissionResult | null>;
}
