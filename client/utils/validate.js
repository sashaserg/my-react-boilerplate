const validate =
{
  success: "success",
  warning: "warning",
  error: "error",
  null: null
};

class Validate
{
  static validateLoginInput(login)
  {
    if(login.length < 4)
    {
      return validate.error;
    }

    return validate.success;
  }

  static validatePasswordInpit(password)
  {
    if(password.length < 4)
    {
      return validate.error;
    }

    if(password.length < 8)
    {
      return validate.warning;
    }

    return validate.success;
  }
}

export default Validate