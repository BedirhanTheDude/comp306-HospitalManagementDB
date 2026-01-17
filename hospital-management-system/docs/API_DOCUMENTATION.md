# API Documentation

## Base URL
`http://localhost:8080/api`

## Endpoints

### Patients
- `GET /patients` - Get all patients
- `GET /patients/{id}` - Get patient by ID
- `POST /patients` - Create new patient
- `PUT /patients/{id}` - Update patient
- `DELETE /patients/{id}` - Delete patient

### Doctors
- `GET /doctors` - Get all doctors
- `GET /doctors/{id}` - Get doctor by ID
- `POST /doctors` - Create new doctor
- `PUT /doctors/{id}` - Update doctor
- `DELETE /doctors/{id}` - Delete doctor

### Appointments
- `GET /appointments` - Get all appointments
- `GET /appointments/{id}` - Get appointment by ID
- `POST /appointments` - Create new appointment
- `PUT /appointments/{id}` - Update appointment
- `DELETE /appointments/{id}` - Delete appointment

### Branches
- `GET /branches` - Get all branches
- `GET /branches/{id}` - Get branch by ID
- `POST /branches` - Create new branch
- `PUT /branches/{id}` - Update branch
- `DELETE /branches/{id}` - Delete branch

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/register` - User registration
