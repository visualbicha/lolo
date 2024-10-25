import React from 'react';
import { FaFileDownload } from 'react-icons/fa';

const BillingHistory = () => {
  const billingHistory = [
    { id: 1, date: '2023-06-01', amount: '$19.99', status: 'Paid' },
    { id: 2, date: '2023-05-01', amount: '$19.99', status: 'Paid' },
    { id: 3, date: '2023-04-01', amount: '$19.99', status: 'Paid' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-gray-300">
        <thead className="text-white">
          <tr>
            <th className="py-2">Date</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Status</th>
            <th className="py-2">Invoice</th>
          </tr>
        </thead>
        <tbody>
          {billingHistory.map((bill) => (
            <tr key={bill.id} className="border-t border-gray-700">
              <td className="py-2">{bill.date}</td>
              <td className="py-2">{bill.amount}</td>
              <td className="py-2">{bill.status}</td>
              <td className="py-2">
                <button className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center">
                  <FaFileDownload className="mr-1" /> Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillingHistory;