import {
  handleFailedStatus,
  validateStatusOk,
} from "../utils/RequestValidation";
import erp_api from "./ERP_API";

/**
 * Post Method
 *
 * @param {string} url : target end point
 * @param {formData} form : form data for the post request
 * @param {function} success : function to be triggered on success request
 * @param {function} failed : function to be triggered on fail request or error encountered.
 */
export const post = ({ url, params, form, success, failed }) => {
  erp_api
    .post(url, form, { params: params })
    .then((res) => validateStatusOk(res))
    .then((res) => success(res))
    .catch((err) => failed(...handleFailedStatus(err)));
};

/**
 * Upload Post Method
 *
 * Post method that has attachment needed this require a Content Type of multipart/form-data
 *
 * @param {string} url : target end point
 * @param {formData} form : form data for the post request
 * @param {function} success : function to be triggered on success request
 * @param {function} failed : function to be triggered on fail request or error encountered.
 */
export const upload = ({ url, form, success, failed }) => {
  erp_api
    .post(url, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => validateStatusOk(res))
    .then((res) => success(res))
    .catch((err) => failed(...handleFailedStatus(err)));
};

/**
 * Get Method
 *
 * @param {string} url : target end point
 * @param {cancelToken} token : axios cancel token
 * @param {function} success : function to be triggered on success request
 * @param {function} failed : function to be triggered on fail request or error encountered.
 */
export const read = ({ url, params, token, success, failed = () => {} }) => {
  erp_api
    .get(url, { params: params }, { cancelToken: token })
    .then((res) => validateStatusOk(res))
    .then((res) => success(res))
    .catch((err) => failed(...handleFailedStatus(err)));
};

/**
 * Get Method
 *
 * @param {string} url : target end point
 * @param {cancelToken} token : axios cancel token
 * @param {function} success : function to be triggered on success request
 * @param {function} failed : function to be triggered on fail request or error encountered.
 */
export const download = ({
  url,
  params,
  token,
  title,
  fileName,
  success,
  failed,
}) => {
  erp_api
    .get(url, {
      params,
      cancelToken: token,
      responseType: "blob",
    })
    .then((res) => {
      if (res.status === 200) {
        const contentDisposition =
          res.headers["content-disposition"] ||
          res.headers["Content-Disposition"];
        const filename = contentDisposition
          ? contentDisposition.split("filename=")[1].replace(/"/g, "")
          : fileName;

        const blob = new Blob([res.data], {
          type: res.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        success(200, `Download ${title} Complete.`);
      } else {
        success(res.status, "Unexpected response status.");
      }
    })
    .catch((error) => {
      console.error("Download failed:", error);
      failed(500, `Failed to download ${title}.`);
    });
};

/**
 * Put Method
 *
 * @param {string} url : target end point
 * @param {integer} pin : authorization pin when making action of update
 * @param {function} success : function to be triggered on success request
 * @param {function} failed : function to be triggered on fail request or error encountered.
 */
export const update = ({ url, form, param, success, failed }) => {
  erp_api
    .put(url, form, { params: param })
    .then((res) => validateStatusOk(res))
    .then((res) => success(res))
    .catch((err) => failed(...handleFailedStatus(err)));
};

/**
 * Post Method for update
 *
 * Since laravel and axios cause bug on uploading form data on put request
 *
 * @param {string} url : target end point
 * @param {integer} pin : authorization pin when making action of update
 * @param {function} success : function to be triggered on success request
 * @param {function} failed : function to be triggered on fail request or error encountered.
 */
export const updateUpload = ({ url, form, param, success, failed }) => {
  erp_api
    .post(url, form, {
      params: param,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => validateStatusOk(res))
    .then((res) => success(res))
    .catch((err) => failed(...handleFailedStatus(err)));
};

/**
 * Delete Method
 *
 * @param {string} url : target end point
 * @param {function} success : function to be triggered on success request
 * @param {function} failed : function to be triggered on fail request or error encountered.
 */
export const remove = ({ url, form, param, success, failed }) => {
  erp_api
    .delete(url, {
      data: form, // DELETE body (auth pin)
      params: param, // optional query params
    })
    .then((res) => validateStatusOk(res))
    .then((res) => success(res))
    .catch((err) => failed(...handleFailedStatus(err)));
};
