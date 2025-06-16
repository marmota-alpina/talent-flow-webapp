const { getTestApp, runWithAdmin, cleanup, createUser } = require('./setup');
const { assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');

describe('Resumes Collection Rules', () => {
  const projectId = 'resumes-test';

  // User IDs for testing
  const candidateUid = 'candidate-user';
  const otherCandidateUid = 'other-candidate-user';
  const recruiterUid = 'recruiter-user';
  const adminUid = 'admin-user';

  // Sample data for testing
  const sampleResume = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    summary: 'Experienced developer',
    skills: ['JavaScript', 'Angular', 'Firebase'],
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const sampleRecommendedVacancy = {
    vacancyId: 'vacancy1',
    title: 'Recommended Job',
    matchScore: 0.85,
    createdAt: new Date()
  };

  // Set up the test environment before all tests
  beforeAll(async () => {
    await runWithAdmin(projectId, async (adminDb) => {
      // Create test users with different roles
      await createUser(candidateUid, 'candidate', adminDb);
      await createUser(otherCandidateUid, 'candidate', adminDb);
      await createUser(recruiterUid, 'recruiter', adminDb);
      await createUser(adminUid, 'admin', adminDb);

      // Create sample data
      // Note: Resume IDs match the user IDs of candidates
      await adminDb.collection('resumes').doc(candidateUid).set(sampleResume);
      await adminDb.collection('resumes').doc(otherCandidateUid).set({
        ...sampleResume,
        name: 'Other Candidate'
      });

      // Create a recommended vacancy for the candidate
      await adminDb.collection('resumes').doc(candidateUid)
        .collection('recommendedVacancies').doc('rec1').set(sampleRecommendedVacancy);
    });
  });

  // Clean up after all tests
  afterAll(async () => {
    await cleanup();
  });

  describe('Read Rules', () => {
    test('unauthenticated user cannot read resumes', async () => {
      const db = await getTestApp(null, projectId);
      await assertFails(db.collection('resumes').doc(candidateUid).get());
    });

    test('candidate can read their own resume', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertSucceeds(db.collection('resumes').doc(candidateUid).get());
    });

    test('candidate cannot read another candidate\'s resume', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('resumes').doc(otherCandidateUid).get());
    });

    test('recruiter can read any resume', async () => {
      const db = await getTestApp({ uid: recruiterUid }, projectId);
      await assertSucceeds(db.collection('resumes').doc(candidateUid).get());
    });

    test('admin can read any resume', async () => {
      const db = await getTestApp({ uid: adminUid }, projectId);
      await assertSucceeds(db.collection('resumes').doc(candidateUid).get());
    });
  });

  describe('Write Rules', () => {
    test('unauthenticated user cannot create resume', async () => {
      const db = await getTestApp(null, projectId);
      await assertFails(db.collection('resumes').doc('new-resume').set(sampleResume));
    });

    test('candidate can create their own resume', async () => {
      const newCandidateUid = 'new-candidate';
      await runWithAdmin(projectId, adminDb => createUser(newCandidateUid, 'candidate', adminDb));

      const db = await getTestApp({ uid: newCandidateUid }, projectId);
      await assertSucceeds(db.collection('resumes').doc(newCandidateUid).set(sampleResume));
    });

    test('candidate cannot create resume for another user', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('resumes').doc('another-user').set(sampleResume));
    });

    test('recruiter cannot create resume for a candidate', async () => {
      const db = await getTestApp({ uid: recruiterUid }, projectId);
      await assertFails(db.collection('resumes').doc('new-for-recruiter').set(sampleResume));
    });

    test('admin cannot create resume for a candidate', async () => {
      const db = await getTestApp({ uid: adminUid }, projectId);
      await assertFails(db.collection('resumes').doc('new-for-admin').set(sampleResume));
    });

    test('candidate can update their own resume', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertSucceeds(db.collection('resumes').doc(candidateUid).update({
        summary: 'Updated summary'
      }));
    });

    test('candidate cannot update another candidate\'s resume', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('resumes').doc(otherCandidateUid).update({
        summary: 'Hacked summary'
      }));
    });

    test('recruiter cannot update a candidate\'s resume', async () => {
      const db = await getTestApp({ uid: recruiterUid }, projectId);
      await assertFails(db.collection('resumes').doc(candidateUid).update({
        summary: 'Recruiter updated'
      }));
    });

    test('admin cannot update a candidate\'s resume', async () => {
      const db = await getTestApp({ uid: adminUid }, projectId);
      await assertFails(db.collection('resumes').doc(candidateUid).update({
        summary: 'Admin updated'
      }));
    });

    test('candidate can delete their own resume', async () => {
      const tempCandidateUid = 'temp-candidate';
      await runWithAdmin(projectId, async (adminDb) => {
        await createUser(tempCandidateUid, 'candidate', adminDb);
        await adminDb.collection('resumes').doc(tempCandidateUid).set(sampleResume);
      });

      const db = await getTestApp({ uid: tempCandidateUid }, projectId);
      await assertSucceeds(db.collection('resumes').doc(tempCandidateUid).delete());
    });

    test('candidate cannot delete another candidate\'s resume', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('resumes').doc(otherCandidateUid).delete());
    });

    test('recruiter cannot delete a candidate\'s resume', async () => {
      const db = await getTestApp({ uid: recruiterUid }, projectId);
      await assertFails(db.collection('resumes').doc(candidateUid).delete());
    });

    test('admin cannot delete a candidate\'s resume', async () => {
      const db = await getTestApp({ uid: adminUid }, projectId);
      await assertFails(db.collection('resumes').doc(candidateUid).delete());
    });
  });

  describe('Recommended Vacancies Sub-collection', () => {
    test('candidate can read their own recommended vacancies', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertSucceeds(db.collection('resumes').doc(candidateUid)
        .collection('recommendedVacancies').doc('rec1').get());
    });

    test('candidate cannot read another candidate\'s recommended vacancies', async () => {
      const db = await getTestApp({ uid: otherCandidateUid }, projectId);
      await assertFails(db.collection('resumes').doc(candidateUid)
        .collection('recommendedVacancies').doc('rec1').get());
    });

    test('recruiter cannot read a candidate\'s recommended vacancies', async () => {
      const db = await getTestApp({ uid: recruiterUid }, projectId);
      await assertFails(db.collection('resumes').doc(candidateUid)
        .collection('recommendedVacancies').doc('rec1').get());
    });

    test('admin cannot read a candidate\'s recommended vacancies', async () => {
      const db = await getTestApp({ uid: adminUid }, projectId);
      await assertFails(db.collection('resumes').doc(candidateUid)
        .collection('recommendedVacancies').doc('rec1').get());
    });

    test('candidate cannot write to their recommended vacancies', async () => {
      const db = await getTestApp({ uid: candidateUid }, projectId);
      await assertFails(db.collection('resumes').doc(candidateUid)
        .collection('recommendedVacancies').doc('new-rec').set(sampleRecommendedVacancy));
    });

    test('recruiter cannot write to a candidate\'s recommended vacancies', async () => {
      const db = await getTestApp({ uid: recruiterUid }, projectId);
      await assertFails(db.collection('resumes').doc(candidateUid)
        .collection('recommendedVacancies').doc('new-rec').set(sampleRecommendedVacancy));
    });

    test('admin cannot write to a candidate\'s recommended vacancies', async () => {
      const db = await getTestApp({ uid: adminUid }, projectId);
      await assertFails(db.collection('resumes').doc(candidateUid)
        .collection('recommendedVacancies').doc('new-rec').set(sampleRecommendedVacancy));
    });
  });
});
