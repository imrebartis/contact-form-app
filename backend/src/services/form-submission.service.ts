'use strict';

import { CreationAttributes } from 'sequelize';

import FormSubmission from '../models/form-submission';
import {
  FormData,
  FormSubmissionRepository,
  FormSubmissionResult,
} from '../types/form-submission-repository';
import { getSequelizeInstance } from '../util/db';

/**
 * Implementation of FormSubmissionRepository using Sequelize
 */
class FormSubmissionService implements FormSubmissionRepository {
  /**
   * Create a new form submission
   * @param data The form data to save
   * @returns Promise with the created submission
   */
  async create(data: FormData): Promise<FormSubmissionResult> {
    // Cast the FormData to the type Sequelize expects for creation
    const submissionData: CreationAttributes<FormSubmission> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      message: data.message,
      queryType: data.queryType,
    };

    const sequelize = await getSequelizeInstance();
    const FormSubmissionModel =
      sequelize.models.FormSubmission || FormSubmission;

    try {
      const newContact = await FormSubmissionModel.create(submissionData);
      return newContact.toJSON() as FormSubmissionResult;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  /**
   * Find all form submissions
   * @returns Promise with array of form submissions
   */
  async findAll(): Promise<FormSubmissionResult[]> {
    const sequelize = await getSequelizeInstance();
    const FormSubmissionModel =
      sequelize.models.FormSubmission || FormSubmission;

    const submissions = await FormSubmissionModel.findAll({
      order: [['created_at', 'DESC']],
    });
    return submissions.map(
      (submission) => submission.toJSON() as FormSubmissionResult
    );
  }

  /**
   * Find a submission by primary key
   * @param id The ID of the submission
   * @returns Promise with the found submission or null
   */
  async findByPk(id: string): Promise<FormSubmissionResult | null> {
    const sequelize = await getSequelizeInstance();
    const FormSubmissionModel =
      sequelize.models.FormSubmission || FormSubmission;

    const submission = await FormSubmissionModel.findByPk(id);
    return submission ? (submission.toJSON() as FormSubmissionResult) : null;
  }

  /**
   * Update a submission
   * @param id The ID of the submission to update
   * @param data The data to update
   * @returns Promise with the updated submission or null
   */
  async update(
    id: string,
    data: Partial<FormData>
  ): Promise<FormSubmissionResult | null> {
    const sequelize = await getSequelizeInstance();
    const FormSubmissionModel =
      sequelize.models.FormSubmission || FormSubmission;

    const submission = await FormSubmissionModel.findByPk(id);
    if (!submission) return null;
    const updatedSubmission = await submission.update(data);
    return updatedSubmission.toJSON() as FormSubmissionResult;
  }

  /**
   * Delete a form submission by ID
   * @param id The ID of the submission to delete
   * @returns Promise with a boolean indicating if a record was deleted
   */
  async deleteById(id: string): Promise<boolean> {
    const sequelize = await getSequelizeInstance();
    const FormSubmissionModel =
      sequelize.models.FormSubmission || FormSubmission;

    const deleteCount = await FormSubmissionModel.destroy({
      where: { id },
    });
    return deleteCount > 0;
  }
}

// Create a singleton instance for easy import in other modules
const formSubmissionService = new FormSubmissionService();
export default formSubmissionService;
