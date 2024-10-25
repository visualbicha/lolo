import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    resources: {
      en: {
        translations: {
          'Welcome': 'Welcome',
          'Login': 'Login',
          'Register': 'Register',
          'Email': 'Email',
          'Password': 'Password',
          'Submit': 'Submit',
          'Error': 'Error',
          'Success': 'Success'
        }
      },
      es: {
        translations: {
          'Welcome': 'Bienvenido',
          'Login': 'Iniciar Sesión',
          'Register': 'Registrarse',
          'Email': 'Correo',
          'Password': 'Contraseña',
          'Submit': 'Enviar',
          'Error': 'Error',
          'Success': 'Éxito'
        }
      }
    },
    ns: ['translations'],
    defaultNS: 'translations'
  });

export default i18n;