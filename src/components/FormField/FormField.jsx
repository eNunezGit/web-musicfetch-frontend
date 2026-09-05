import './FormField.css';

/** Campo de formulario reutilizable: etiqueta, control y mensaje de error. */
function FormField({
  label,
  name,
  type = 'text',
  value,
  error = '',
  placeholder,
  onChange,
  ...inputProps
}) {
  const fieldId = `field-${name}`;

  return (
    <label className="form-field" htmlFor={fieldId}>
      <span className="form-field__label">{label}</span>
      <input
        id={fieldId}
        className={`form-field__input${error ? ' form-field__input_invalid' : ''}`}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required
        {...inputProps}
      />
      <span className="form-field__error">{error}</span>
    </label>
  );
}

export default FormField;
