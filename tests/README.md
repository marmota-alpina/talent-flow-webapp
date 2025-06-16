# Firestore Security Rules Tests

This directory contains tests for the Firestore security rules defined in the `firestore.rules` file at the root of the project.

## Setup

Before running the tests, make sure you have installed the dependencies:

```bash
cd tests
npm install
```

## Running the Tests

You can run the tests using the following command from the project root:

```bash
npm run test:rules
```

Or directly from the tests directory:

```bash
cd tests
npm test
```

## Test Structure

The tests are organized by collection:

- `users.test.js`: Tests for the users collection rules
- `curation.test.js`: Tests for the curation collections rules (technologies, softSkills, experienceLevels)
- `vacancies.test.js`: Tests for the vacancies collection rules
- `resumes.test.js`: Tests for the resumes collection rules and recommendedVacancies sub-collection

## Test Methodology

The tests use the `@firebase/rules-unit-testing` library to simulate different user scenarios:

- Unauthenticated users
- Authenticated users with different roles (candidate, recruiter, admin)
- Users trying to access their own data vs. others' data

Each test verifies that the security rules correctly allow or deny access based on the user's authentication status and role.
