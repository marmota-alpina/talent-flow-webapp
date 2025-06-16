const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const fs = require('fs');
const path = require('path');

// Store the test environment for each project ID
const testEnvs = {};

/**
 * Gets or creates a test environment for the specified project ID.
 * @param {string} projectId The project ID to use for testing.
 * @returns {Promise<firebase.RulesTestEnvironment>} A promise that resolves with the test environment.
 */
async function getTestEnv(projectId) {
  if (!testEnvs[projectId]) {
    const rulesPath = path.join(__dirname, '../../firestore.rules');
    const rules = fs.readFileSync(rulesPath, 'utf8');

    testEnvs[projectId] = await initializeTestEnvironment({
      projectId,
      firestore: {
        rules
      }
    });
  }

  return testEnvs[projectId];
}

/**
 * Creates a new app with authentication data.
 * @param {object | null} auth The authentication object to use for testing.
 * @param {string} projectId The project ID to use for testing.
 * @returns {firebase.firestore.Firestore} The test context's Firestore instance.
 */
async function getTestApp(auth, projectId) {
  const testEnv = await getTestEnv(projectId);

  if (auth) {
    // CORREÇÃO FINAL APLICADA AQUI:
    // O primeiro argumento deve ser o UID, e o segundo, o objeto de token com o campo 'sub'.
    // A biblioteca parece ser estrita quanto ao formato do token.
    const tokenOptions = { sub: auth.uid, ...auth };
    // Removemos a propriedade 'uid' do objeto de token, pois agora é redundante e pode causar o erro.
    delete tokenOptions.uid;
    return testEnv.authenticatedContext(auth.uid, tokenOptions).firestore();
  } else {
    return testEnv.unauthenticatedContext().firestore();
  }
}

/**
 * Runs a callback with admin privileges, bypassing security rules.
 * @param {string} projectId The project ID to use for testing.
 * @param {Function} callback The function to execute with an admin Firestore instance.
 * @returns {Promise<void>}
 */
async function runWithAdmin(projectId, callback) {
  const testEnv = await getTestEnv(projectId);
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await callback(context.firestore());
  });
}

/**
 * Cleans up the test environment.
 * @returns {Promise<void>} A promise that resolves when the cleanup is complete.
 */
async function cleanup() {
  const cleanupPromises = Object.values(testEnvs).map(env => env.cleanup());
  await Promise.all(cleanupPromises);

  // Clear the test environments
  Object.keys(testEnvs).forEach(key => delete testEnvs[key]);
}

/**
 * Creates a test user with the specified role.
 * @param {string} uid The user ID.
 * @param {string} role The user role.
 * @param {firebase.firestore.Firestore} adminDb The admin Firestore instance.
 * @returns {Promise<void>} A promise that resolves when the user is created.
 */
async function createUser(uid, role, adminDb) {
  await adminDb.collection('users').doc(uid).set({
    uid,
    role,
    name: `Test User (${role})`,
    email: `${role}@example.com`
  });
}

module.exports = {
  getTestApp,
  runWithAdmin,
  cleanup,
  createUser
};
