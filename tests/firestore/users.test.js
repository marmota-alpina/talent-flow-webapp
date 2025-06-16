const { getTestApp, runWithAdmin, cleanup, createUser } = require('./setup');
const { assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');

describe('Users Collection Rules', () => {
  const projectId = 'users-test';

  // User IDs for testing
  const candidateUid = 'candidate-user';
  const recruiterUid = 'recruiter-user';
  const adminUid = 'admin-user';
  const otherUid = 'other-user';

  // Set up the test environment before all tests
  beforeAll(async () => {
    await runWithAdmin(projectId, async (adminDb) => {
      // Create test users with different roles
      await createUser(candidateUid, 'candidate', adminDb);
      await createUser(recruiterUid, 'recruiter', adminDb);
      await createUser(adminUid, 'admin', adminDb);
      await createUser(otherUid, 'candidate', adminDb);
    });
  });

  // Clean up after all tests
  afterAll(async () => {
    await cleanup();
  });

  describe('Read Rules', () => {
    test('unauthenticated user cannot read user profiles', async () => {
      const db = await getTestApp(null, projectId);
      await assertFails(db.collection('users').doc(candidateUid).get());
    });

    test('authenticated user can read any user profile', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertSucceeds(db.collection('users').doc(recruiterUid).get());
    });
  });

  describe('Write Rules', () => {
    test('user can create their own profile', async () => {
      const newUid = 'new-user';
      const db = await getTestApp({ uid: newUid }, projectId);
      await assertSucceeds(db.collection('users').doc(newUid).set({
        uid: newUid,
        role: 'candidate',
        name: 'New User',
        email: 'new@example.com'
      }));
    });

    test('user cannot create profile for another user', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('users').doc('another-new-user').set({
        uid: 'another-new-user',
        role: 'candidate',
        name: 'Other User',
        email: 'other@example.com'
      }));
    });

    test('user can update their own profile', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertSucceeds(db.collection('users').doc(candidateUid).update({
        name: 'Updated Name'
      }));
    });

    test('user cannot update another user\'s profile', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('users').doc(otherUid).update({
        name: 'Hacked Name'
      }));
    });

    test('user cannot change their own role', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('users').doc(candidateUid).update({
        role: 'admin'
      }));
    });

    test('user can delete their own profile', async () => {
      const db = await getTestApp({ uid: otherUid }, projectId);
      await assertSucceeds(db.collection('users').doc(otherUid).delete());
    });

    test('user cannot delete another user\'s profile', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('users').doc(recruiterUid).delete());
    });
  });
});
