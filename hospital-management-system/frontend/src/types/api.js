/**
 * API Contract Types
 *
 * Bu dosya backend DTO'ları ile frontend arasındaki tutarlılığı sağlar.
 * Backend'de değişiklik yapıldığında bu dosyayı da güncellemeyi unutmayın.
 *
 * Backend DTO locations:
 * - LoginRequest: backend/src/main/java/com/hospital/dto/LoginRequest.java
 * - SignUpRequest: backend/src/main/java/com/hospital/dto/SignUpRequest.java
 */

/**
 * Creates a login request object
 * @param {string} username - User's username (fullName for patients)
 * @param {string} password - User's password
 * @returns {Object} LoginRequest compatible with backend
 */
export const createLoginRequest = (username, password) => ({
  username,
  password,
});

/**
 * Creates a signup request object for patients
 * @param {Object} params
 * @param {string} params.identityNumber - 11-digit identity number
 * @param {string} params.fullName - Patient's full name
 * @param {string} params.gender - 'M' or 'F'
 * @param {string} params.phoneNumber - Phone number
 * @param {string} params.dateOfBirth - Date of birth (YYYY-MM-DD)
 * @param {string} params.password - Password
 * @returns {Object} SignUpRequest compatible with backend
 */
export const createSignUpRequest = ({
  identityNumber,
  fullName,
  gender,
  phoneNumber,
  dateOfBirth,
  password,
}) => ({
  identityNumber,
  fullName,
  gender,
  phoneNumber,
  dateOfBirth,
  password,
});
/**
 * Creates a doctor search/filter request object
 * Backend DTO: backend/src/main/java/com/hospital/dto/DoctorSearchRequest.java
 * @param {Object} params
 * @param {string} params.policlinicName - Selected policlinic name
 * @param {string} params.cityName - Selected city name
 * @param {number} params.minRating - Minimum doctor rating (1-5)
 * @param {number} params.maxRating - Maximum doctor rating (1-5)
 * @returns {Object} DoctorSearchRequest compatible with backend
 */
export const createDoctorSearchRequest = ({
  policlinicName,
  cityName,
  minRating,
  maxRating,
}) => ({
  policlinicName,
  cityName,
  minRating: minRating ? Number(minRating) : null,
  maxRating: maxRating ? Number(maxRating) : null,
});

/**
 * Creates an appointment booking request object
 * Backend DTO: backend/src/main/java/com/hospital/dto/CreateAppointmentRequest.java
 * @param {Object} params
 * @param {number} params.year - Appointment year
 * @param {number} params.month - Appointment month
 * @param {number} params.day - Appointment day
 * @param {number} params.hour - Appointment hour
 * @param {number} params.minute - Appointment minute
 * @param {number} params.patientSSN - Patient's identity number
 * @param {number} params.doctorID - Doctor's ID
 * @returns {Object} CreateAppointmentRequest compatible with backend
 */
export const createAppointmentRequest = ({
  year,
  month,
  day,
  hour,
  minute,
  patientSSN,
  doctorID,
}) => ({
  year,
  month,
  day,
  hour,
  minute,
  patientSSN,
  doctorID,
});

//Creates a find appointments request object
/**
 * Creates a find appointments request object
 * Backend DTO: backend/src/main/java/com/hospital/dto/FindAppointmentRequest.java
 * @param {Object} params
 * @param {number} params.patientSSN - Patient's identity number
 * @returns {Object} FindAppointmentRequest compatible with backend
 */
export const createFindAppointmentRequest = ({ patientSSN }) => ({
  patientSSN,
});

// Cancel appointment
/**
 * @param {Object} params
 * @param {number} params.appointmentID
 * @returns {Object} CancelAppointmentRequest
 */
export const CancelAppointmentRequest = ({}) => ({
  appointmentID,
});

/**
 * API Response structure
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the request was successful
 * @property {string} [message] - Success message
 * @property {string} [error] - Error message if success is false
 */
