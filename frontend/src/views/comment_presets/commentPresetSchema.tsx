import * as yup from 'yup';
import { dimeDate, localizeSchema, requiredNumber } from '../../utilities/validation';

export const commentPresetSchema = localizeSchema(() =>
  yup.object({
    comment_preset: yup.string().required(),
  }),
);

export const commentPresetTemplate = {
  comment_preset: 'Kommentarvorschlag',
};
