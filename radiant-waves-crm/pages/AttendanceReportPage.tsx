
import React, { useMemo, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';
import { Role } from '../types';

declare const jsPDF: any;
declare const XLSX: any;

const AttendanceReportPage: React.FC = () => {
    const { users, attendanceRecords } = useAppContext();
    const tableRef = useRef<HTMLTableElement>(null);

    const reportData = useMemo(() => {
        return users
            .filter(user => user.role === Role.AGENT) // Only show agents in report
            .map(user => {
                const userAttendance = attendanceRecords.filter(rec => rec.userId === user.id);
                // This is a simplification. A real app would need a date range filter.
                // Here we will just calculate based on available records.
                let presentDays = 0;
                let lateCheckInCount = 0;
                let earlyCheckOutCount = 0;

                const uniqueDays = new Set(userAttendance.map(rec => rec.date));
                presentDays = uniqueDays.size;

                userAttendance.forEach(rec => {
                    if (rec.checkInTime) {
                        const checkIn = new Date(rec.checkInTime);
                        if (checkIn.getHours() > 9 || (checkIn.getHours() === 9 && checkIn.getMinutes() > 0)) {
                            lateCheckInCount++;
                        }
                    }
                    if (rec.checkOutTime) {
                        const checkOut = new Date(rec.checkOutTime);
                        if (checkOut.getHours() < 17) {
                            earlyCheckOutCount++;
                        }
                    }
                });
                
                return {
                    staffName: user.staffName,
                    empId: user.empId,
                    salary: user.salary,
                    presentDays,
                    lateCheckInCount,
                    earlyCheckOutCount,
                };
            });
    }, [users, attendanceRecords]);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(reportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");
        XLSX.writeFile(wb, "AttendanceReport.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF.default();
        doc.text("Attendance Report", 14, 16);
        (doc as any).autoTable({
            head: [['Staff Name', 'Emp ID', 'Salary', 'Present Days', 'Late Check-ins', 'Early Check-outs']],
            body: reportData.map(item => Object.values(item)),
            startY: 20,
        });
        doc.save("AttendanceReport.pdf");
    };
    
    const printReport = () => {
        const printContent = tableRef.current?.outerHTML;
        if (printContent) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow?.document.write('<html><head><title>Attendance Report</title>');
            printWindow?.document.write('<style>body{font-family:sans-serif; padding: 20px;} table{width:100%;border-collapse:collapse; margin-top: 20px;} h1{text-align:center;} th,td{border:1px solid #ddd;padding:8px;text-align:left}</style>');
            printWindow?.document.write('</head><body>');
            printWindow?.document.write('<h1>Attendance Report</h1>');
            printWindow?.document.write(printContent);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            printWindow?.print();
        }
    };

    return (
        <Layout>
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Attendance Report</h1>
                    <div className="flex space-x-2">
                        <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"><i className="fa-solid fa-file-excel mr-2"></i>Excel</button>
                        <button onClick={exportToPDF} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"><i className="fa-solid fa-file-pdf mr-2"></i>PDF</button>
                        <button onClick={printReport} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"><i className="fa-solid fa-print mr-2"></i>Print</button>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200" ref={tableRef}>
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emp ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present Days</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late Check-ins</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Early Check-outs</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.map(item => (
                                <tr key={item.empId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.staffName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.empId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.salary.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.presentDays}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.lateCheckInCount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.earlyCheckOutCount}</td>
                                </tr>
                            ))}
                              {reportData.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-500">No attendance data found for agents.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default AttendanceReportPage;
