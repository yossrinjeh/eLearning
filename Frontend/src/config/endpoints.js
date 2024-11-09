const BASE_URL = 'https://elearning.test/api';

export const endpoints = {
  // Authentication endpoints
  auth: {
    register: `${BASE_URL}/register`,
    login: `${BASE_URL}/login`,
    logout: `${BASE_URL}/logout`,
  },

  // Rooms endpoints
  rooms: {
    list: `${BASE_URL}/rooms`,
    create: `${BASE_URL}/rooms`,
    get: (id) => `${BASE_URL}/rooms/${id}`,
    update: (id) => `${BASE_URL}/rooms/${id}`,
    delete: (id) => `${BASE_URL}/rooms/${id}`,
  },

  // Formations endpoints
  formations: {
    list: `${BASE_URL}/formations`,
    create: `${BASE_URL}/formations`,
    get: (id) => `${BASE_URL}/formations/${id}`,
    update: (id) => `${BASE_URL}/formations/${id}`,
    delete: (id) => `${BASE_URL}/formations/${id}`,
  },

  // Enrollments endpoints
  enrollments: {
    list: `${BASE_URL}/enrollments`,
    create: `${BASE_URL}/enrollments`,
    get: (id) => `${BASE_URL}/enrollments/${id}`,
    update: (id) => `${BASE_URL}/enrollments/${id}`,
    delete: (id) => `${BASE_URL}/enrollments/${id}`,
  },

  // Evaluations endpoints
  evaluations: {
    list: `${BASE_URL}/evaluations`,
    create: `${BASE_URL}/evaluations`,
    get: (id) => `${BASE_URL}/evaluations/${id}`,
    update: (id) => `${BASE_URL}/evaluations/${id}`,
    delete: (id) => `${BASE_URL}/evaluations/${id}`,
  },

  // Student evaluations endpoints
  studentEvaluations: {
    list: `${BASE_URL}/student-evaluations`,
    create: `${BASE_URL}/student-evaluations`,
    get: (id) => `${BASE_URL}/student-evaluations/${id}`,
    update: (id) => `${BASE_URL}/student-evaluations/${id}`,
    delete: (id) => `${BASE_URL}/student-evaluations/${id}`,
  },

  // Trainers endpoints
  trainers: {
    list: `${BASE_URL}/trainers`,
    create: `${BASE_URL}/trainers`,
    get: (id) => `${BASE_URL}/trainers/${id}`,
    update: (id) => `${BASE_URL}/trainers/${id}`,
    delete: (id) => `${BASE_URL}/trainers/${id}`,
  },

  // Users endpoints
  users: {
    list: `${BASE_URL}/users`,
    create: `${BASE_URL}/users`,
    get: (id) => `${BASE_URL}/users/${id}`,
    update: (id) => `${BASE_URL}/users/${id}`,
    delete: (id) => `${BASE_URL}/users/${id}`,
  },
};

export default endpoints; 