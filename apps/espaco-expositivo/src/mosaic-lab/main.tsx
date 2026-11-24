import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createLocalRepository } from '@ccc/data-access';
import '@ccc/design-tokens/styles.css';
import '../styles/global.css';
import { MosaicLab } from './MosaicLab';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Elemento #root não encontrado em mosaic.html.');
}

const repository = createLocalRepository({ baseUrl: `${import.meta.env.BASE_URL}content/` });

createRoot(container).render(
  <StrictMode>
    <MosaicLab repository={repository} />
  </StrictMode>,
);
