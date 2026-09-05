import { useCallback, useState } from 'react';

/**
 * Maneja los valores, los errores y la validez de un formulario.
 * Se apoya en la validación nativa del navegador (required, type, minLength),
 * así que las reglas viven en el propio marcado.
 */
export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  function handleChange(evt) {
    const { name, value, validationMessage, form } = evt.target;

    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: validationMessage }));
    setIsValid(form.checkValidity());
  }

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsValid(false);
    // initialValues es un literal estable por formulario; no entra en las dependencias
    // para no recrear resetForm en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { values, errors, isValid, handleChange, resetForm };
}
