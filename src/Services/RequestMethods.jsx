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
export const read = ({ url, params, token, success, failed }) => {
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
export const download = ({ url, token, title, fileName, success, failed }) => {
    erp_api
        .get(url, { cancelToken: token, responseType: "blob" })
        .then((res) => validateStatusOk(res))
        .then((res) => {
            if (res.status === 200) {
                // Extract the filename from the content-disposition header
                const contentDisposition =
                    res.headers["content-disposition"] ||
                    res.headers["Content-Disposition"];

                console.log(contentDisposition);

                const filename = contentDisposition
                    ? contentDisposition.split("filename=")[1].replace(/"/g, "")
                    : fileName;

                // Create a URL for the file
                const blob = new Blob([res.data], {
                    type: res.headers["content-type"],
                });
                const url = window.URL.createObjectURL(blob);

                // Create a link element
                const link = document.createElement("a");
                link.href = url;
                link.download = filename; // Use the filename from the header

                // Append to the body
                document.body.appendChild(link);

                // Trigger download
                link.click();

                // Clean up
                link.remove();
                window.URL.revokeObjectURL(url);

                // Notify success
                success(200, `Download ${title} Complete.`);
            } else {
                // Handle unexpected status codes
                success(res.status, "Unexpected response status.");
            }
        })
        .catch(() => {
            //   console.error("Error downloading file", error);
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
        .delete(url, { params: param }, form)
        .then((res) => validateStatusOk(res))
        .then((res) => success(res))
        .catch((err) => failed(...handleFailedStatus(err)));
};
