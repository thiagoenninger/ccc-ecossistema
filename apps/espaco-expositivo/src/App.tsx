import styles from './App.module.css';

export function App() {
  return (
    <main className={styles.root}>
      <p className={styles.eyebrow}>Centro Cultural de Cubatão</p>
      <h1 className={styles.title}>Espaço Expositivo</h1>
      <p className={styles.note}>
        Esqueleto técnico da Etapa E01. Tela provisória, sem identidade visual: o Design System
        Galeria Contemporânea v2.0 será aplicado a partir da Etapa E02.
      </p>
    </main>
  );
}
