
export enum Role {
  ADMIN = 'Admin',
  AGENT = 'Agent',
}

export interface User {
  id: string;
  staffName: string;
  designation: string;
  empId: string;
  joiningDate: string;
  mobile: string;
  role: Role;
  salary: number;
  userId: string;
  password?: string; // Optional because we don't want to expose it everywhere
}

export interface CustomerData {
  id: string;
  date: string;
  createdBy: string;
  customerName: string;
  mobile: string;
  houseNo: string;
  place: string;
  city: string;
  district: string;
  pincode: string;
  state: string;
  landmark: string;
  connectionType: 'Home' | 'Commercial';
  billFile?: { name: string; content: string };
  kwa: string;
  status: 'Interested' | 'Appointment Fixed' | 'Not Interested';
  appointmentDateTime?: string;
  latitude: number;
  longitude: number;
  remarks: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  empId: string;
  staffName: string;
  date: string;
  checkInTime?: string;
  checkInLocation?: { lat: number; lon: number };
  checkOutTime?: string;
  checkOutLocation?: { lat: number; lon: number };
}
