export interface ValidateUser {
    _id: string;
    Name: string;
    UserName: string;
    RoomNumber: number | string;
    TotalFee: number;
    FeePaid: number;
    FeeDue: number;
    PhoneNumber: string;
    JoiningDate: Date | string;
    role: 'student' | 'admin' | string;
    IsActive: boolean;
    Email: string;
    __v: number;
  }
  