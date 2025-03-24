'use strict';

import { DataTypes, Sequelize } from 'sequelize';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import FormSubmission from '../src/models/form-submission';
import { MockFormSubmissionService } from './mocks/mock-form-submission-service';

// Skip tests if in Vercel environment
const runTests = process.env.VERCEL !== '1';

(runTests ? describe : describe.skip)('Database Operations', () => {
  let testDb: Sequelize;
  let formSubmissionService: MockFormSubmissionService;

  beforeAll(async () => {
    testDb = new Sequelize('sqlite::memory:', {
      logging: false,
    });

    FormSubmission.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        queryType: {
          type: DataTypes.ENUM('general', 'support'),
          allowNull: false,
          defaultValue: 'general',
          validate: {
            isIn: [['general', 'support']],
          },
        },
      },
      {
        sequelize: testDb,
        tableName: 'form_submissions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );

    await testDb.sync({ force: true });
  });

  beforeEach(() => {
    // Use the mock service for the tests
    formSubmissionService = new MockFormSubmissionService();
  });

  afterAll(async () => {
    await testDb.close();
  });

  it('should create a new contact', async () => {
    const contactData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      message: 'This is a test message',
      queryType: 'support',
    };

    const newContact = await formSubmissionService.create(contactData);
    expect(newContact).toBeDefined();
    expect(newContact.id).toBeDefined();
    expect(newContact.firstName).toBe('John');
    expect(newContact.lastName).toBe('Doe');
    expect(newContact.email).toBe('john.doe@example.com');
    expect(newContact.message).toBe('This is a test message');
    expect(newContact.queryType).toBe('support');
  });

  it('should delete a contact by id', async () => {
    // First create a contact
    const contactData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      message: 'This is a test message',
      queryType: 'support',
    };

    const newContact = await formSubmissionService.create(contactData);
    const deleted = await formSubmissionService.deleteById(newContact.id);
    expect(deleted).toBe(true);

    // Verify it was deleted
    const foundContact = await formSubmissionService.findByPk(newContact.id);
    expect(foundContact).toBeNull();
  });

  it('should return false when deleting non-existent contact', async () => {
    const deleted = await formSubmissionService.deleteById('non-existent-id');
    expect(deleted).toBe(false);
  });
});
