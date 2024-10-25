import React, { useState } from 'react';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { useReports } from '../../contexts/ReportContext';
import { useAudit } from '../../contexts/AuditContext';
import Pagination from '../Pagination';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ReportManagement = () => {
  const { reports, updateReportStatus, deleteReport } = useReports();
  const { addAuditLog } = useAudit();
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredReports = reports.filter(report => 
    filterStatus === 'all' || report.status.toLowerCase() === filterStatus
  );

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

  const handleReviewReport = async (id) => {
    await updateReportStatus(id, 'Reviewed');
    await addAuditLog('Review Report', {
      reportId: id,
      action: 'Review',
      status: 'success'
    });
  };

  const handleDismissReport = async (id) => {
    if (window.confirm('Are you sure you want to dismiss this report?')) {
      await deleteReport(id);
      await addAuditLog('Dismiss Report', {
        reportId: id,
        action: 'Dismiss',
        status: 'success'
      });
    }
  };

  const handleViewDetails = async (report) => {
    setSelectedReport(report);
    await addAuditLog('View Report Details', {
      reportId: report.id,
      action: 'View',
      status: 'success'
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Report Management</h2>
      
      <Card className="mb-4">
        <div className="flex justify-end mb-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-700 text-white rounded p-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Action</th>
                <th className="p-3 text-left">IP Address</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((report) => (
                <tr key={report.id} className="border-b border-gray-700">
                  <td className="p-3">{new Date(report.timestamp).toLocaleString()}</td>
                  <td className="p-3">{report.username}</td>
                  <td className="p-3">{report.action}</td>
                  <td className="p-3">{report.ipAddress}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded ${
                      report.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleViewDetails(report)}
                        variant="secondary"
                        size="small"
                      >
                        <FaEye />
                      </Button>
                      <Button
                        onClick={() => handleReviewReport(report.id)}
                        variant="success"
                        size="small"
                        disabled={report.status === 'Reviewed'}
                      >
                        <FaCheck />
                      </Button>
                      <Button
                        onClick={() => handleDismissReport(report.id)}
                        variant="danger"
                        size="small"
                      >
                        <FaTimes />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          itemsPerPage={reportsPerPage}
          totalItems={filteredReports.length}
          paginate={setCurrentPage}
          currentPage={currentPage}
        />
      </Card>

      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4 text-white">Report Details</h3>
            <div className="space-y-2">
              <p><strong>Timestamp:</strong> {new Date(selectedReport.timestamp).toLocaleString()}</p>
              <p><strong>User:</strong> {selectedReport.username}</p>
              <p><strong>Action:</strong> {selectedReport.action}</p>
              <p><strong>Details:</strong> {selectedReport.details}</p>
              <p><strong>IP Address:</strong> {selectedReport.ipAddress}</p>
              <p><strong>Status:</strong> {selectedReport.status}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setSelectedReport(null)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;