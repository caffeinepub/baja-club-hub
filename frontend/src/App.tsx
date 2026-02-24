import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import AboutTeam from './pages/AboutTeam';
import Achievements from './pages/Achievements';
import Events from './pages/Events';
import MemberLocker from './pages/MemberLocker';
import LockerBills from './pages/LockerBills';
import LockerDocuments from './pages/LockerDocuments';
import LockerEquipment from './pages/LockerEquipment';
import LockerPhotos from './pages/LockerPhotos';
import LockerDriveLinks from './pages/LockerDriveLinks';
import LockerAccessAdmin from './pages/LockerAccessAdmin';
import Settings from './pages/Settings';
import Feedback from './pages/Feedback';
import AdminPanel from './pages/AdminPanel';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

const teamRoute = createRoute({
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
  path: '/locker',
  component: MemberLocker,
});

const lockerBillsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/locker/bills',
  component: LockerBills,
});

const lockerDocumentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/locker/documents',
  component: LockerDocuments,
});

const lockerEquipmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/locker/equipment',
  component: LockerEquipment,
});

const lockerPhotosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/locker/photos',
  component: LockerPhotos,
});

const lockerDriveLinksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/locker/drive-links',
  component: LockerDriveLinks,
});

const lockerAccessAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/locker/access-admin',
  component: LockerAccessAdmin,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});

const feedbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feedback',
  component: Feedback,
});

const adminPanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanel,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  teamRoute,
  achievementsRoute,
  eventsRoute,
  memberLockerRoute,
  lockerBillsRoute,
  lockerDocumentsRoute,
  lockerEquipmentRoute,
  lockerPhotosRoute,
  lockerDriveLinksRoute,
  lockerAccessAdminRoute,
  settingsRoute,
  feedbackRoute,
  adminPanelRoute,
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
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
