'use strict';

import { v4 as uuidv4 } from 'uuid';

import {
  FormData,
  FormSubmissionRepository,
  FormSubmissionResult,
} from '../../src/types/form-submission-repository';

export class MockFormSubmissionService implements FormSubmissionRepository {
  // Store submissions in memory
  private data: FormSubmissionResult[] = [];

  // Create method to be spied on in tests
  async create(formData: FormData): Promise<FormSubmissionResult> {
    // Validate required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'message',
      'queryType',
    ] as const;
    for (const field of requiredFields) {
      if (!formData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const now = new Date();
    const submission: FormSubmissionResult = {
      id: uuidv4(),
      ...formData,
      created_at: now,
      updated_at: now,
    };

    this.data.push(submission);
    return submission;
  }

  async findAll(): Promise<FormSubmissionResult[]> {
    return this.data;
  }

  async findByPk(id: string): Promise<FormSubmissionResult | null> {
    return this.data.find((submission) => submission.id === id) || null;
  }

  async update(
    id: string,
    data: Partial<FormData>
  ): Promise<FormSubmissionResult | null> {
    const submission = this.data.find((submission) => submission.id === id);
    if (submission) {
      Object.assign(submission, data, { updated_at: new Date() });
      return submission;
    }
    return null;
  }

  async deleteById(id: string): Promise<boolean> {
    const initialLength = this.data.length;
    this.data = this.data.filter((submission) => submission.id !== id);
    return initialLength > this.data.length;
  }
}
