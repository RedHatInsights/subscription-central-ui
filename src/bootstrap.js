import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import AppEntry from './AppEntry';

const container = document.getElementById('root');

const root = createRoot(container);

const AppEntryWithCallback = () => {
  useEffect(() => root.setAttribute('data-ouia-safe', true));

  return <AppEntry />;
};

container.render(<AppEntryWithCallback />);
