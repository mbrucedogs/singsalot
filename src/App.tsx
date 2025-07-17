import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Navigation from './components/Navigation/Navigation';
import { Search, Queue, History, TopPlayed } from './features';

function App() {
  return (
    <Router>
      <Layout>
        <Navigation />
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/history" element={<History />} />
          <Route path="/top-played" element={<TopPlayed />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
