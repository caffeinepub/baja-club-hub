import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Home from './pages/Home';
import AboutTeam from './pages/AboutTeam';
import Achievements from './pages/Achievements';
import Events from './pages/Events';
import MemberLocker from './pages/MemberLocker';
import LockerBills from './pages/LockerBills';
import LockerEquipment from './pages/LockerEquipment';
import LockerDocuments from './pages/LockerDocuments';
import LockerPhotos from './pages/LockerPhotos';
import LockerDriveLinks from './pages/LockerDriveLinks';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileSetupModal from './components/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      <ProfileSetupModal />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const aboutTeamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about-team',
  component: AboutTeam,
});

const achievementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/achievements',
  component: Achievements,
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: Events,
});

const memberLockerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/member-locker',
  component: () => (
    <ProtectedRoute>
      <MemberLocker />
    </ProtectedRoute>
  ),
});

const lockerBillsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/member-locker/bills',
  component: () => (
    <ProtectedRoute>
      <LockerBills />
    </ProtectedRoute>
  ),
});

const lockerEquipmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/member-locker/equipment',
  component: () => (
    <ProtectedRoute>
      <LockerEquipment />
    </ProtectedRoute>
  ),
});

const lockerDocumentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/member-locker/documents',
  component: () => (
    <ProtectedRoute>
      <LockerDocuments />
    </ProtectedRoute>
  ),
});

const lockerPhotosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/member-locker/photos',
  component: () => (
    <ProtectedRoute>
      <LockerPhotos />
    </ProtectedRoute>
  ),
});

const lockerDriveLinksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/member-locker/drive-links',
  component: () => (
    <ProtectedRoute>
      <LockerDriveLinks />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutTeamRoute,
  achievementsRoute,
  eventsRoute,
  memberLockerRoute,
  lockerBillsRoute,
  lockerEquipmentRoute,
  lockerDocumentsRoute,
  lockerPhotosRoute,
  lockerDriveLinksRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
