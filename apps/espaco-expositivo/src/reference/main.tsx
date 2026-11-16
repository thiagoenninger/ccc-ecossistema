import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@ccc/design-tokens/styles.css';
import '../styles/global.css';
import { TokenReference } from './TokenReference';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Elemento #root não encontrado em tokens.html.');
}

createRoot(container).render(
  <StrictMode>
    <TokenReference />
  </StrictMode>,
);
