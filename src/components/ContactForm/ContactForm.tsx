import React, { useState } from 'react';
import styles from './ContactForm.module.css';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setNameError('');
    setEmailError('');
    setMessageError('');
    setFormSuccess(false);

    let isValid = true;

    if (!name.trim()) {
      setNameError('Por favor, ingresa tu nombre.');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Por favor, ingresa tu email.');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Por favor, ingresa un email válido.');
      isValid = false;
    }

    if (!message.trim()) {
      setMessageError('Por favor, ingresa tu mensaje.');
      isValid = false;
    }

    if (isValid) {
      setIsSubmitting(true);

      console.log('Datos del formulario:', { name, email, message });
      setTimeout(() => {
        setIsSubmitting(false);
        setFormSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
        console.log('Formulario enviado (simulado) con éxito!');
      }, 2000);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Contáctanos</h2>
      <p className={styles.paragraph}>
        ¿Tienes alguna pregunta o comentario? ¡Nos encantaría escucharte!
        Completa el formulario y nos pondremos en contacto contigo lo antes posible.
      </p>

      <div className={styles.contactForm}>
        {formSuccess ? (
          <div className={styles.successMessage}>
            ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>Nombre:</label>
              <input
                type="text"
                id="name"
                className={styles.formInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => !name.trim() ? setNameError('Por favor, ingresa tu nombre.') : setNameError('')} // Valida al salir del campo
                disabled={isSubmitting}
              />
              {nameError && <p className={styles.errorMessage}>{nameError}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email:</label>
              <input
                type="email"
                id="email"
                className={styles.formInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  if (!email.trim()) setEmailError('Por favor, ingresa tu email.');
                  else if (!validateEmail(email)) setEmailError('Por favor, ingresa un email válido.');
                  else setEmailError('');
                }}
                disabled={isSubmitting}
              />
              {emailError && <p className={styles.errorMessage}>{emailError}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>Mensaje:</label>
              <textarea
                id="message"
                className={styles.formTextarea}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={() => !message.trim() ? setMessageError('Por favor, ingresa tu mensaje.') : setMessageError('')}
                disabled={isSubmitting}
              ></textarea>
              {messageError && <p className={styles.errorMessage}>{messageError}</p>}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        )}
      </div>

      <div className={styles.contactInfo}>
        <p>También puedes contactarnos directamente:</p>
        <p>Email: <a href="mailto:info@miapp.com" style={{ color: '#007bff', textDecoration: 'none' }}>info@miapp.com</a></p>
        <p>Teléfono: +56 9 1234 5678</p>
        <p>Redes Sociales: @mi_app</p>
      </div>
    </div>
  );
};

export default ContactForm;