import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { Search, Queue, History, Favorites, NewSongs, Artists, Singers, SongLists, Settings } from './features';
import TopPlayed from './features/TopPlayed/Top100';
import { FirebaseProvider } from './firebase/FirebaseProvider';
import { ErrorBoundary } from './components/common';
import { AuthInitializer } from './components/Auth';

function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <Router>
          <AuthInitializer>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/queue" replace />} />
                <Route path="/search" element={<Search />} />
                <Route path="/queue" element={<Queue />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/new-songs" element={<NewSongs />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/song-lists" element={<SongLists />} />
                <Route path="/history" element={<History />} />
                <Route path="/top-played" element={<TopPlayed />} />
                <Route path="/singers" element={<Singers />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/queue" replace />} />
              </Routes>
            </Layout>
          </AuthInitializer>
        </Router>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}

export default App;
