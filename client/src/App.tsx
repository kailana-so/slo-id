import { Routes, Route } from 'react-router-dom'
import RootLayout from './components/RootLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MapPage from './pages/MapPage'
import ProfilePage from './pages/ProfilePage'
import ProfileLayout from './pages/ProfileLayout'
import NotesPage from './pages/NotesPage'
import NotePage from './pages/NotePage'
import IdentificationsPage from './pages/IdentificationsPage'
import NearbyPage from './pages/NearbyPage'
import UserMapPage from './pages/UserMapPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<ProfilePage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="note" element={<NotePage />} />
          <Route path="identifications" element={<IdentificationsPage />} />
          <Route path="nearby" element={<NearbyPage />} />
          <Route path="map" element={<UserMapPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </RootLayout>
  )
}

export default App
