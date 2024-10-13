import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { root } from './routers/root';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { genratePermission, messaging } from './firebase/google';
import { onMessage } from 'firebase/messaging';
import { socket } from './socket';
const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  })
  useEffect(() => {
    genratePermission()
    onMessage(messaging, (payload) => {
      console.log(payload);

    })
  }, [])
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then(function (registration) {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch(function (err) {
        console.log('Service Worker registration failed:', err);
      });
  }
  socket.on('connect', () => {
    console.log('Connected to server');
  });
  socket.on('disconnect', () => {
    console.log('Disconnected from server, trying to reconnect...');
});
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <CssVarsProvider disableTransitionOnChange defaultMode='dark'>
          <CssBaseline />
          <RouterProvider router={createBrowserRouter(root)} />
          <ReactQueryDevtools initialIsOpen={false} />
        </CssVarsProvider>
      </QueryClientProvider>
    </div>
  )
}

export default App
