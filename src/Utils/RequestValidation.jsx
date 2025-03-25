/**
 * Validate Status OK
 *
 * verify if the response status is success (between 200 and 300)
 * status that is greater or below the condition will throw
 * an exception.
 *
 * @param {object} res
 * @return {Exception}
 */
export function validateStatusOk(res) {
  const status = res.status;

  if (!(status >= 200 && status < 300)) {
    throw new Error("Bad response", { cause: res });
  }

  return res.data;
}

/**
 * Handle Failed Status
 *
 * handle different type of status and none status error
 * to ensure that the proper callBack back will be return to
 * the requester functional component.
 * ex. Login Component Page, Sign up Component Page
 *
 * @param {Exception} err
 * @returns {object}
 */
export function handleFailedStatus(err, parametersCount = 2) {
  if (!err || !err.response) return [500, err];

  const {
    status,
    data: { message },
  } = err.response;

  if (parametersCount === 3) return [status, message, null];

  return [status, message];
}
