export const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    if (typeof ctrl !== 'function') {
      console.error('ctrlWrapper error: ctrl is not a function', ctrl);
      return next(new Error('ctrl is not a function'));
    }
    try {
      await ctrl(req, res, next);
    } catch (err) { next(err); }
  };
};
