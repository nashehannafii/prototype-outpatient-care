import React from 'react';
import { createRoot } from 'react-dom/client';
import HeartCarePlanner from './heart-care-planner';
import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <HeartCarePlanner />
  </React.StrictMode>
);
