export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    roleId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Role {
    id: string;
    name: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Attendance {
    id: string;
    employeeId: string;
    date: Date;
    checkIn: Date;
    checkOut: Date | null;
    status: 'present' | 'absent' | 'late';
    createdAt: Date;
    updatedAt: Date;
  }