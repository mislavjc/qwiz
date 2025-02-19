import * as yup from 'yup';

yup.setLocale({
  mixed: {
    required: 'Required.',
  },
});

export const exampleSchema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  country: yup.string().required(),
  programmers: yup.array().of(yup.string()),
  animal: yup.string().required(),
  terms: yup.array().of(yup.string()).required(),
  termsAndCon: yup
    .boolean()
    .oneOf([true], 'You must agree to terms and conditions.'),
  radio: yup.string().required(),
});

export const createQuizSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
});

export const eventSchema = yup.object({
  name: yup.string().required('Name is required.'),
  location: yup.string().required('Location is required.'),
  description: yup.string().required(),
  price: yup.number().required('Price is required.'),
  teamCount: yup.number().required('Team count is required.'),
  startDate: yup.date().required('Start date is required.'),
  startTime: yup.date().required('Start time is required.'),
  quizId: yup.string().required('Quiz is required.'),
});
