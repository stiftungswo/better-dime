import { setLocale } from 'yup';

export const validationLocalization = () =>
  setLocale({
    mixed: {
      required: 'Dies ist ein erforderliches Feld.',
    },
  });
