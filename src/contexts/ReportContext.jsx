import React, { createContext, useState, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';

const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([
    { id: 1, videoId: 'V001', reason: 'Contenido inapropiado', status: 'Pendiente', timestamp: new Date().toISOString() },
    { id: 2, videoId: 'V002', reason: 'Derechos de autor', status: 'Revisado', timestamp: new Date().toISOString() },
    { id: 3, videoId: 'V003', reason: 'Spam', status: 'Pendiente', timestamp: new Date().toISOString() },
  ]);

  const addReport = useCallback((report) => {
    const newReport = {
      ...report,
      id: Date.now(),
      status: 'Pendiente',
      timestamp: new Date().toISOString()
    };
    setReports(prevReports => [...prevReports, newReport]);
    toast.success('Reporte enviado correctamente');
  }, []);

  const updateReportStatus = useCallback((id, newStatus) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === id ? { ...report, status: newStatus } : report
      )
    );
    toast.success('Estado del reporte actualizado');
  }, []);

  const deleteReport = useCallback((id) => {
    setReports(prevReports => prevReports.filter(report => report.id !== id));
    toast.success('Reporte eliminado');
  }, []);

  const getReportsByVideo = useCallback((videoId) => {
    return reports.filter(report => report.videoId === videoId);
  }, [reports]);

  const getPendingReports = useCallback(() => {
    return reports.filter(report => report.status === 'Pendiente');
  }, [reports]);

  return (
    <ReportContext.Provider value={{
      reports,
      addReport,
      updateReportStatus,
      deleteReport,
      getReportsByVideo,
      getPendingReports
    }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};