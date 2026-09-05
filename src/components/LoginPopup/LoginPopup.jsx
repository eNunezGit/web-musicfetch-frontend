import { useEffect } from 'react';
import FormField from '../FormField/FormField';
import PopupWithForm from '../PopupWithForm/PopupWithForm';
import { useForm } from '../../hooks/useForm';

const INITIAL_VALUES = { email: '', password: '' };

function LoginPopup({
  isOpen,
  isSubmitting,
  submitError,
  onClose,
  onLogin,
  onSwitch,
}) {
  const { values, errors, isValid, handleChange, resetForm } = useForm(INITIAL_VALUES);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onLogin(values);
  }

  return (
    <PopupWithForm
      name="login"
      title="Sign in"
      submitText="Sign in"
      submittingText="Signing in…"
      isOpen={isOpen}
      isValid={isValid}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onClose={onClose}
      onSubmit={handleSubmit}
      onSwitch={onSwitch}
      switchText="Don't have an account yet?"
      switchActionText="Sign up"
    >
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
        autoComplete="current-password"
      />
    </PopupWithForm>
  );
}

export default LoginPopup;
