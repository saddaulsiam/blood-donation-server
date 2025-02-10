export type RequestDonar = {
  donorId: string;
  name: string;
  phoneNumber: string;
  dateOfDonation: string;
  hospitalName: string;
  city: string;
  message: string;
};

export type Status = {
  status: "APPROVED" | "PENDING" | "REJECTED";
};
