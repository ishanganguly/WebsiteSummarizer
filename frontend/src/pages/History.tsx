import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

interface HistoryItem {
  url: string;
  summary: string;
  timestamp: string;
}

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const uuid = localStorage.getItem('userUUID');
      if (!uuid) {
        setError('User ID not found.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://api.local/history?userId=${uuid}`);
        if (!response.ok) throw new Error('Failed to fetch history');

        const data = await response.json();
        setHistory(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white bg-opacity-90 rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Summarization History</h1>
          <button 
            onClick={() => navigate('/')} 
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:shadow-lg transition"
          >
            Back to Home
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : history.length === 0 ? (
          <div className="text-center text-gray-600">No history found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border border-gray-200 px-4 py-3 text-left text-gray-700">URL</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-gray-700">Summary</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-gray-700">Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition">
                    <td className="border border-gray-200 px-4 py-3 text-blue-700">{item.url}</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-800">{item.summary}</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-600">{formatTimestamp(item.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default History;
