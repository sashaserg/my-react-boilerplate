// template answer for all requests
const templateJSON =
  {
    confirmation: false,
    answer: {}
  };

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

class Response
{
  static send(res, confirmation, answer)
  {
    // get template object
    let result = templateJSON;

    // fill out the template
    result.confirmation = confirmation;
    result.answer =  Object.assign( {}, { ...answer} );

    // respond with filled template
    res.json(result);
  }
}

export default Response;