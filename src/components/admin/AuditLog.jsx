import React, { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaDownload } from 'react-icons/fa';
import { useAudit } from '../../contexts/AuditContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Pagination from '../Pagination';

const AuditLog = () => {
  const { auditLogs } = useAudit();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10);
  const [filterType, setFilterType] = useState('all');

  // Filter logs based on search term, date range, and type
  const filteredLogs = (auditLogs || []).filter(log => {
    if (!log) return false;

    const username = String(log.username || '');
    const action = String(log.action || '');
    const details = String(log.details || '');

    const matchesSearch = 
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDateRange = 
      (!dateRange.start || new Date(log.timestamp) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(log.timestamp) <= new Date(dateRange.end));

    const matchesType = filterType === 'all' || action.toLowerCase().includes(filterType.toLowerCase());

    return matchesSearch && matchesDateRange && matchesType;
  });

  // Get current logs
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  const formatLogValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Details', 'IP Address', 'Status'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        formatLogValue(log.username),
        formatLogValue(log.action),
        formatLogValue(log.details),
        formatLogValue(log.ipAddress),
        formatLogValue(log.status)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Audit Log</h2>
        <Button onClick={exportLogs} variant="secondary">
          <FaDownload className="mr-2" />
          Export Log
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              id="search"
              label="Search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                id="start-date"
                label="Start Date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <Input
                id="end-date"
                label="End Date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Activity Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
            >
              <option value="all">All Activities</option>
              <option value="login">Login Activities</option>
              <option value="registration">Registrations</option>
              <option value="subscription">Subscriptions</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-4 text-white">Timestamp</th>
                <th className="p-4 text-white">User</th>
                <th className="p-4 text-white">Action</th>
                <th className="p-4 text-white">Details</th>
                <th className="p-4 text-white">IP Address</th>
                <th className="p-4 text-white">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentLogs.map((log, index) => (
                <tr key={log.id || index} className="hover:bg-gray-700">
                  <td className="p-4 text-gray-300">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                  </td>
                  <td className="p-4 text-gray-300">{formatLogValue(log.username)}</td>
                  <td className="p-4 text-gray-300">{formatLogValue(log.action)}</td>
                  <td className="p-4 text-gray-300">{formatLogValue(log.details)}</td>
                  <td className="p-4 text-gray-300">{formatLogValue(log.ipAddress)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      formatLogValue(log.status) === 'success' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {formatLogValue(log.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            No activity logs found matching your criteria
          </div>
        )}

        <div className="mt-4">
          <Pagination
            itemsPerPage={logsPerPage}
            totalItems={filteredLogs.length}
            currentPage={currentPage}
            paginate={setCurrentPage}
          />
        </div>
      </Card>
    </div>
  );
};

export default AuditLog;