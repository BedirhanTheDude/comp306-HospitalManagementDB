export type SignupRequest = {
  fullName: string;
  identityNumber: string;
  gender: "male" | "female" | "other";
  phoneNumber: string;
  dateOfBirth: string; // "YYYY-MM-DD"
  password: string;
};

export type SignupResponse = boolean;