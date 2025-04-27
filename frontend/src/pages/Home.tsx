import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import Footer from '../components/Footer';
import { Search, BookOpen, Globe, Sparkles } from 'lucide-react';

// Define types for API responses
interface SummaryResponse {
  url: string;
  summary: string;
  timestamp: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [uuid, setUuid] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fadeInAnimation = {
    animation: 'fadeIn 0.8s ease-out forwards',
    opacity: 0,
  };

  useEffect(() => {
    const storedUuid = localStorage.getItem("userUUID") || uuidv4();
    setUuid(storedUuid);
    localStorage.setItem("userUUID", storedUuid);
  }, []);

  const handleSummarize = async () => {
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setError(null);
    setIsLoading(true);
    setSummary(null);

    try {
      const response = await fetch('http://api.local/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url,  userId: uuid }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: SummaryResponse = await response.json();
      setSummary(data.summary);
    } catch (err) {
      console.error('Error summarizing website:', err);
      setError('Failed to summarize website. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 px-4 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
      </div>

      {/* Logo */}
      <div className="mb-6 transform transition-all duration-700 hover:scale-105 flex items-center">
        <Globe className="text-blue-600 w-10 h-10 mr-2" />
        <Sparkles className="text-purple-600 w-6 h-6 absolute ml-8" />
      </div>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center max-w-2xl w-full">
        <h1 
          className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 text-center"
          style={fadeInAnimation}
        >
          Website Summarizer
        </h1>
        
        <p 
          className="text-gray-700 text-lg mb-8 text-center max-w-xl"
          style={{
            ...fadeInAnimation,
            animationDelay: '0.3s',
          }}
        >
          Enter any website URL to get a short and meaningful summary generated using AI.
        </p>

        <div 
          className="w-full max-w-md relative"
          style={{
            ...fadeInAnimation,
            animationDelay: '0.6s',
          }}
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12 bg-white bg-opacity-90 transition-all duration-300"
          />
          <Search className="absolute left-4 top-4 text-gray-400" size={20} />
        </div>

        {error && (
          <div className="mt-4 text-red-500 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <button
          onClick={handleSummarize}
          disabled={isLoading}
          className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center"
          style={{
            ...fadeInAnimation,
            animationDelay: '0.9s',
          }}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            <>Summarize</>
          )}
        </button>

        {/* Summary Result Section */}
        {summary && (
          <div 
            className="mt-8 w-full max-w-2xl bg-white bg-opacity-90 p-6 rounded-xl shadow-lg"
            style={{
              animation: 'fadeIn 1s ease-out forwards',
            }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Summary of {url}</h2>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => navigate('/history')}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <BookOpen className="mr-1" size={16} />
                View in History
              </button>
            </div>
          </div>
        )}

        {/* Feature Cards - Only show if no summary is displayed */}
        {!summary && (
          <div 
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
            style={{
              ...fadeInAnimation,
              animationDelay: '1.2s',
            }}
          >
            <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Globe className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Any Website</h3>
              <p className="text-gray-600 mt-2">Works with any public website or article online.</p>
            </div>
            
            <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BookOpen className="text-purple-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">AI Powered</h3>
              <p className="text-gray-600 mt-2">Advanced AI extracts the most important information.</p>
            </div>
            
            <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-pink-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Sparkles className="text-pink-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Save Time</h3>
              <p className="text-gray-600 mt-2">Get the key points without reading the entire content.</p>
            </div>
          </div>
        )}
      </div>

      <button
        className="fixed top-5 right-5 px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center group"
        onClick={() => navigate('/history')}
        style={{
          ...fadeInAnimation,
          animationDelay: '1.5s',
        }}
      >
        <BookOpen className="mr-2 transition-transform duration-300 transform group-hover:-translate-y-1" size={18} />
        History
      </button>

      <Footer />
    </div>
  );
};

export default Home;
