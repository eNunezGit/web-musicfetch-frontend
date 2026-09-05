import { useEffect } from 'react';

/**
 * Ejecuta onEscape cuando se pulsa Esc, solo mientras isActive es true.
 * El listener se retira al desactivarse o al desmontar el componente,
 * de modo que no quedan controladores colgados.
 */
export function useEscapeKey(isActive, onEscape) {
  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    function handleKeyDown(evt) {
      if (evt.key === 'Escape') {
        onEscape();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onEscape]);
}
