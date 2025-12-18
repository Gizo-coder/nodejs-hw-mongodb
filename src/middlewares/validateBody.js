import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      console.log('VALIDATION ERROR:', error.details);
      return next(createHttpError(400, error.message));
    }

    req.body = value;
    next();
  };
};  
