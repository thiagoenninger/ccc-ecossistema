import styles from './App.module.css';

export function App() {
  return (
    <main className={styles.root}>
      <p className={styles.eyebrow}>Centro Cultural de Cubatão</p>
      <h1 className={styles.title}>Espaço Expositivo</h1>
      <p className={styles.note}>
        Fundação visual da Etapa E02: tokens, temas e fontes do Design System Galeria Contemporânea
        v2.0 aplicados. As telas museográficas começam nas próximas etapas.
      </p>
    </main>
  );
}
