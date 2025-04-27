import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';

// Add animation keyframes directly to the document head
const AppStyles = () => {
  useEffect(() => {
    // Create a style element

    document.title = "WebSummarizer";
    const styleEl = document.createElement('style');
    
    // Define animations
    styleEl.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      .page-transition {
        animation: fadeIn 0.6s ease-out;
      }
    `;
    
    // Append to head
    document.head.appendChild(styleEl);
    
    // Cleanup
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  return null;
};

// Page transition component
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="page-transition">
      {children}
    </div>
  );
};

const AppContent = () => (
  <PageTransition>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/history" element={<History />} />
    </Routes>
  </PageTransition>
);

function App() {
  return (
    <Router>
      <AppStyles />
      <AppContent />
    </Router>
  );
}

export default App;