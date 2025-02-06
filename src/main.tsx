import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { CalendarViewProvider } from './store/CalendarProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CalendarViewProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </CalendarViewProvider>
  </React.StrictMode>
);
