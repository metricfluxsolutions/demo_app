
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role, User, CustomerData, AttendanceRecord } from '../types';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  customerData: CustomerData[];
  attendanceRecords: AttendanceRecord[];
  login: (userId: string, pass: string) => boolean;
  logout: () => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  addCustomerData: (data: CustomerData) => void;
  addAttendance: (record: Partial<AttendanceRecord>) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  const [users, setUsers] = useLocalStorage<User[]>('users', []);
  const [customerData, setCustomerData] = useLocalStorage<CustomerData[]>('customerData', []);
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>('attendanceRecords', []);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (users.length === 0) {
        const adminUser: User = { id: 'user-1', staffName: 'Admin User', designation: 'Manager', empId: 'E-001', joiningDate: '2023-01-01', mobile: '9876543210', role: Role.ADMIN, salary: 100000, userId: 'Admin', password: '123456' };
        const agentUser: User = { id: 'user-2', staffName: 'Agent Smith', designation: 'Field Agent', empId: 'E-002', joiningDate: '2023-02-01', mobile: '9876543211', role: Role.AGENT, salary: 50000, userId: 'Agent', password: '123456' };
        setUsers([adminUser, agentUser]);
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (userId: string, pass: string): boolean => {
    const user = users.find(u => u.userId === userId && u.password === pass);
    if (user) {
      const userToStore = { ...user };
      delete userToStore.password;
      setCurrentUser(userToStore);
      navigate('/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  const addUser = (user: User) => {
    setUsers(prev => [...prev, { ...user, id: `user-${Date.now()}` }]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  
  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addCustomerData = (data: CustomerData) => {
    setCustomerData(prev => [...prev, { ...data, id: `data-${Date.now()}` }]);
  };

  const addAttendance = useCallback((record: Partial<AttendanceRecord>) => {
    setAttendanceRecords(prev => {
        const today = new Date().toISOString().split('T')[0];
        const existingRecordIndex = prev.findIndex(r => r.userId === record.userId && r.date === today);
        if (existingRecordIndex !== -1) {
            const updatedRecords = [...prev];
            updatedRecords[existingRecordIndex] = { ...updatedRecords[existingRecordIndex], ...record };
            return updatedRecords;
        } else {
            return [...prev, { 
              id: `att-${Date.now()}`,
              userId: record.userId!, 
              empId: record.empId!,
              staffName: record.staffName!,
              date: today,
              ...record
            }];
        }
    });
  }, [setAttendanceRecords]);


  const value = {
    currentUser,
    users,
    customerData,
    attendanceRecords,
    login,
    logout,
    addUser,
    updateUser,
    deleteUser,
    addCustomerData,
    addAttendance,
    isLoading
  };

  return <AppContext.Provider value={value}>{!isLoading && children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
