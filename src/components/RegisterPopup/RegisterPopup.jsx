import { useEffect } from 'react';
import FormField from '../FormField/FormField';
import PopupWithForm from '../PopupWithForm/PopupWithForm';
import { useForm } from '../../hooks/useForm';

const INITIAL_VALUES = { name: '', email: '', password: '' };

function RegisterPopup({
  isOpen,
  isSubmitting,
  submitError,
  onClose,
  onRegister,
  onSwitch,
}) {
  const { values, errors, isValid, handleChange, resetForm } = useForm(INITIAL_VALUES);

  // Cada vez que el modal se abre parte de un formulario limpio.
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onRegister(values);
  }

  return (
    <PopupWithForm
      name="register"
      title="Sign up"
      submitText="Sign up"
      submittingText="Creating your account…"
      isOpen={isOpen}
      isValid={isValid}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onClose={onClose}
      onSubmit={handleSubmit}
      onSwitch={onSwitch}
      switchText="Already have an account?"
      switchActionText="Sign in"
    >
      <FormField
        label="Name"
        name="name"
        placeholder="Enter your name"
        value={values.name}
        error={errors.name}
        onChange={handleChange}
        minLength={2}
        maxLength={30}
        autoComplete="name"
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={values.email}
        error={errors.email}
        onChange={handleChange}
        autoComplete="email"
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={values.password}
        error={errors.password}
        onChange={handleChange}
        minLength={8}
        autoComplete="new-password"
      />
    </PopupWithForm>
  );
}

export default RegisterPopup;
