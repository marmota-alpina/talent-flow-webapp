const { getTestApp, runWithAdmin, cleanup, createUser } = require('./setup');
const { assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');

describe('Vacancies Collection Rules', () => {
  const projectId = 'vacancies-test';

  // User IDs for testing
  const candidateUid = 'candidate-user';
  const recruiterUid = 'recruiter-user';
  const adminUid = 'admin-user';

  // Sample data for testing
  const sampleVacancy = {
    title: 'Test Vacancy',
    description: 'A vacancy for testing',
    status: 'active',
    company: 'Test Company',
    location: 'Remote',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Set up the test environment before all tests
  beforeAll(async () => {
    await runWithAdmin(projectId, async (adminDb) => {
      // Create test users with different roles
      await createUser(candidateUid, 'candidate', adminDb);
      await createUser(recruiterUid, 'recruiter', adminDb);
      await createUser(adminUid, 'admin', adminDb);

      // Create sample data
      await adminDb.collection('vacancies').doc('vacancy1').set(sampleVacancy);
    });
  });

  // Clean up after all tests
  afterAll(async () => {
    await cleanup();
  });

  describe('Read Rules', () => {
    test('unauthenticated user can read vacancies', async () => {
      const db = await getTestApp(null, projectId);
      await assertSucceeds(db.collection('vacancies').doc('vacancy1').get());
    });

    test('candidate can read vacancies', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertSucceeds(db.collection('vacancies').doc('vacancy1').get());
    });

    test('recruiter can read vacancies', async () => {
      const db = await getTestApp({ uid: recruiterUid }, projectId);
      await assertSucceeds(db.collection('vacancies').doc('vacancy1').get());
    });

    test('admin can read vacancies', async () => {
      const db = await getTestApp({ uid: adminUid }, projectId);
      await assertSucceeds(db.collection('vacancies').doc('vacancy1').get());
    });
  });

  describe('Write Rules', () => {
    test('unauthenticated user cannot create vacancy', async () => {
      const db = await getTestApp(null, projectId);
      await assertFails(db.collection('vacancies').doc('new-vacancy').set(sampleVacancy));
    });

    test('candidate cannot create vacancy', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('vacancies').doc('new-vacancy').set(sampleVacancy));
    });

    test('recruiter can create vacancy', async () => {
      const db = await getTestApp({ uid: recruiterUid }, projectId);
      await assertSucceeds(db.collection('vacancies').doc('new-vacancy').set(sampleVacancy));
    });

    test('admin can create vacancy', async () => {
      const db = await getTestApp({ uid: adminUid }, projectId);
      await assertSucceeds(db.collection('vacancies').doc('new-vacancy2').set(sampleVacancy));
    });

    test('unauthenticated user cannot update vacancy', async () => {
      const db = await getTestApp(null, projectId);
      await assertFails(db.collection('vacancies').doc('vacancy1').update({ title: 'Updated Vacancy' }));
    });

    test('candidate cannot update vacancy', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('vacancies').doc('vacancy1').update({ title: 'Updated Vacancy' }));
    });

    test('recruiter can update vacancy', async () => {
      const db = await getTestApp({ uid: recruiterUid }, projectId);
      await assertSucceeds(db.collection('vacancies').doc('vacancy1').update({ title: 'Updated Vacancy' }));
    });

    test('admin can update vacancy', async () => {
      const db = await getTestApp({ uid: adminUid }, projectId);
      await assertSucceeds(db.collection('vacancies').doc('vacancy1').update({ title: 'Updated Vacancy Again' }));
    });

    test('unauthenticated user cannot delete vacancy', async () => {
      const db = await getTestApp(null, projectId);
      await assertFails(db.collection('vacancies').doc('vacancy1').delete());
    });

    test('candidate cannot delete vacancy', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('vacancies').doc('vacancy1').delete());
    });

    test('recruiter can delete vacancy', async () => {
      const db = await getTestApp({ uid: recruiterUid }, projectId);
      // Re-create the doc so it can be deleted
      await runWithAdmin(projectId, adminDb => adminDb.collection('vacancies').doc('vacancy1').set(sampleVacancy));
      await assertSucceeds(db.collection('vacancies').doc('vacancy1').delete());
    });

    test('admin can delete vacancy', async () => {
      // Re-create the doc so it can be deleted
      await runWithAdmin(projectId, adminDb => adminDb.collection('vacancies').doc('vacancy1').set(sampleVacancy));
      const db = await getTestApp({ uid: adminUid }, projectId);
      await assertSucceeds(db.collection('vacancies').doc('vacancy1').delete());
    });
  });
});
