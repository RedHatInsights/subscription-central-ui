import React, { useEffect } from 'react';
import AppEntry from './AppEntry';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');

const root = createRoot(container);

const AppEntryWithCallback = () => {
  useEffect(() => root.setAttribute('data-ouia-safe', true));

  return <AppEntry />;
};

container.render(<AppEntryWithCallback />);
