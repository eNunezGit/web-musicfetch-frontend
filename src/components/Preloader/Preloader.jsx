import './Preloader.css';

/** Indicador de carga. Gira mientras una petición está en curso. */
function Preloader({ text = 'Searching…' }) {
  return (
    <output className="preloader">
      <span className="preloader__circle" aria-hidden="true" />
      <span className="preloader__text">{text}</span>
    </output>
  );
}

export default Preloader;
