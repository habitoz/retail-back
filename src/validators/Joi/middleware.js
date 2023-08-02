import Joi from "joi";

const middleware = (schema, property) => {
  return (req, res, next) => {
    const { error } = Joi.validate(req.body, schema, { abortEarly: false });
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const errors = details.map((error) => {
        return { [error.context.key]: error.message };
      });
      const messages = errors.reduce((obj, item) => (obj[Object.keys(item)[0]] = Object.values(item)[0], obj), {});
      res.status(422).json(messages);
    }
  };
};
export default middleware;
