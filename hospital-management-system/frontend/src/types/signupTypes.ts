export type SignupRequest = {
  fullName: string;
  identityNumber: string;
  gender: "Male" | "Female";
  phoneNumber: string;
  dateOfBirth: string; // "YYYY-MM-DD"
  password: string;
};

export type SignupResponse = boolean;