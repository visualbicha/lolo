import React, { createContext, useContext, useState, useCallback } from 'react';

const AuditContext = createContext();

export const AuditProvider = ({ children }) => {
  const [auditLogs, setAuditLogs] = useState([]);

  const addAuditLog = useCallback(async (action, details) => {
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      
      const newLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action,
        details,
        ipAddress: ipData.ip,
        status: 'success'
      };

      setAuditLogs(prevLogs => [newLog, ...prevLogs]);
      
      try {
        await fetch('/api/audit-logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newLog)
        });
      } catch (error) {
        console.error('Failed to save audit log to server:', error);
      }

    } catch (error) {
      const newLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action,
        details,
        ipAddress: '0.0.0.0',
        status: 'error'
      };
      
      setAuditLogs(prevLogs => [newLog, ...prevLogs]);
    }
  }, []);

  const clearAuditLogs = useCallback(() => {
    setAuditLogs([]);
  }, []);

  const getAuditLogs = useCallback(() => {
    return auditLogs;
  }, [auditLogs]);

  const getLogsByIp = useCallback((ip) => {
    return auditLogs.filter(log => log.ipAddress === ip);
  }, [auditLogs]);

  const getLogsByDateRange = useCallback((startDate, endDate) => {
    return auditLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  }, [auditLogs]);

  return (
    <AuditContext.Provider value={{
      auditLogs,
      addAuditLog,
      clearAuditLogs,
      getAuditLogs,
      getLogsByIp,
      getLogsByDateRange
    }}>
      {children}
    </AuditContext.Provider>
  );
};

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
};