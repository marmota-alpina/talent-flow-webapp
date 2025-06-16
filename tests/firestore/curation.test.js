const { getTestApp, runWithAdmin, cleanup, createUser } = require('./setup');
const { assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');

describe('Curation Collections Rules', () => {
  const projectId = 'curation-test';

  // User IDs for testing
  const candidateUid = 'candidate-user';
  const recruiterUid = 'recruiter-user';
  const adminUid = 'admin-user';

  // Sample data for testing
  const sampleTechnology = {
    name: 'Test Technology',
    description: 'A technology for testing',
    status: 'active',
    category: 'testing'
  };

  // Set up the test environment before all tests
  beforeAll(async () => {
    await runWithAdmin(projectId, async (adminDb) => {
      // Create test users with different roles
      await createUser(candidateUid, 'candidate', adminDb);
      await createUser(recruiterUid, 'recruiter', adminDb);
      await createUser(adminUid, 'admin', adminDb);

      // Create sample data
      await adminDb.collection('technologies').doc('tech1').set(sampleTechnology);
      await adminDb.collection('softSkills').doc('skill1').set({
        name: 'Test Skill',
        description: 'A skill for testing',
        status: 'active'
      });
    });
  });

  // Clean up after all tests
  afterAll(async () => {
    await cleanup();
  });

  describe('Read Rules', () => {
    test('unauthenticated user can read technologies', async () => {
      const db = await getTestApp(null, projectId);
      await assertSucceeds(db.collection('technologies').doc('tech1').get());
    });

    test('unauthenticated user can read softSkills', async () => {
      const db = await getTestApp(null, projectId);
      await assertSucceeds(db.collection('softSkills').doc('skill1').get());
    });

    test('candidate can read technologies', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertSucceeds(db.collection('technologies').doc('tech1').get());
    });

    test('recruiter can read technologies', async () => {
      const db = await getTestApp({ uid: recruiterUid }, projectId);
      await assertSucceeds(db.collection('technologies').doc('tech1').get());
    });

    test('admin can read technologies', async () => {
      const db = await getTestApp({ uid: adminUid }, projectId);
      await assertSucceeds(db.collection('technologies').doc('tech1').get());
    });
  });

  describe('Write Rules', () => {
    test('unauthenticated user cannot create technology', async () => {
      const db = await getTestApp(null, projectId);
      await assertFails(db.collection('technologies').doc('new-tech').set(sampleTechnology));
    });

    test('candidate cannot create technology', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('technologies').doc('new-tech').set(sampleTechnology));
    });

    test('recruiter cannot create technology', async () => {
      const db = await getTestApp({ uid: recruiterUid }, projectId);
      await assertFails(db.collection('technologies').doc('new-tech').set(sampleTechnology));
    });

    test('admin can create technology', async () => {
      const db = await getTestApp({ uid: adminUid }, projectId);
      await assertSucceeds(db.collection('technologies').doc('new-tech').set(sampleTechnology));
    });

    test('unauthenticated user cannot update technology', async () => {
      const db = await getTestApp(null, projectId);
      await assertFails(db.collection('technologies').doc('tech1').update({ name: 'Updated Tech' }));
    });

    test('candidate cannot update technology', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('technologies').doc('tech1').update({ name: 'Updated Tech' }));
    });

    test('recruiter cannot update technology', async () => {
      const db = await getTestApp({ uid: recruiterUid }, projectId);
      await assertFails(db.collection('technologies').doc('tech1').update({ name: 'Updated Tech' }));
    });

    test('admin can update technology', async () => {
      const db = await getTestApp({ uid: adminUid }, projectId);
      await assertSucceeds(db.collection('technologies').doc('tech1').update({ name: 'Updated Tech' }));
    });

    test('unauthenticated user cannot delete technology', async () => {
      const db = await getTestApp(null, projectId);
      await assertFails(db.collection('technologies').doc('tech1').delete());
    });

    test('candidate cannot delete technology', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('technologies').doc('tech1').delete());
    });

    test('recruiter cannot delete technology', async () => {
      const db = await getTestApp({ uid: recruiterUid }, projectId);
      await assertFails(db.collection('technologies').doc('tech1').delete());
    });

    test('admin can delete technology', async () => {
      const db = await getTestApp({ uid: adminUid }, projectId);
      // Re-create the doc so it can be deleted
      await runWithAdmin(projectId, adminDb => adminDb.collection('technologies').doc('tech1').set(sampleTechnology));
      await assertSucceeds(db.collection('technologies').doc('tech1').delete());
    });
  });

  // Test the fallback rule for other curation collections
  describe('Fallback Rules for Other Collections', () => {
    test('admin can create document in experienceLevels collection', async () => {
      const db = await getTestApp({ uid: adminUid }, projectId);
      await assertSucceeds(db.collection('experienceLevels').doc('level1').set({
        name: 'Junior',
        description: 'Junior level',
        status: 'active'
      }));
    });

    test('candidate cannot create document in experienceLevels collection', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('experienceLevels').doc('level2').set({
        name: 'Senior',
        description: 'Senior level',
        status: 'active'
      }));
    });
  });
});
