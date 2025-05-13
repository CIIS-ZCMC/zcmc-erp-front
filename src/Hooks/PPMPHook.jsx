import { create } from "zustand";
import erp_api from "../Services/ERP_API";
import { post } from "../Services/RequestMethods";

const PATH = "ppmp";

const usePPMPHook = create((set) => ({
  ppmp: {},
  modes: [],
  activities: [],
  ppmpLoading: false,
  ppmpError: null,

  getPPMPItems: async (callback) => {
    return erp_api
      .get(`${PATH}-items`)
      .then((res) => {
        const { status } = res;

        if (!(status >= 200 && status < 300)) {
          throw new Error("Bad response.", { cause: res });
        }

        if (status === 201) {
          return callback(201, res.data.message);
        }

        return res;
      })
      .then((res) => {
        const { data, message } = res.data;

        set(() => ({
          ppmp: data,
        }));

        callback(200, message, data);
      })
      .catch((err) => {
        console.error("Error fetching ppmp:", err);
        callback(err?.response?.status || 500, err?.response?.data || "Error");
      });
  },
  getProcModes: async (callback) => {
    return erp_api
      .get(`procurement-modes`)
      .then((res) => {
        const { status } = res;

        if (!(status >= 200 && status < 300)) {
          throw new Error("Bad response.", { cause: res });
        }

        if (status === 201) {
          return callback(201, res.data.message);
        }

        return res;
      })
      .then((res) => {
        const { data, message } = res.data;

        set(() => ({
          modes: data,
        }));

        callback(200, message, data);
      })
      .catch((err) => {
        console.error("Error fetching ppmp:", err);
        callback(err?.response?.status || 500, err?.response?.data || "Error");
      });
  },
  getActivities: async (callback) => {
    return erp_api
      .get(`activities`)
      .then((res) => {
        const { status } = res;

        if (!(status >= 200 && status < 300)) {
          throw new Error("Bad response.", { cause: res });
        }

        if (status === 201) {
          return callback(201, res.data.message);
        }

        return res;
      })
      .then((res) => {
        const { data, message } = res.data;

        set(() => ({
          activities: data,
        }));

        callback(200, message, data);
      })
      .catch((err) => {
        console.error("Error fetching ppmp:", err);
        callback(err?.response?.status || 500, err?.response?.data || "Error");
      });
  },
  postPPMP: async (body, callback) => {
    post({
      url: `${PATH}-items`,
      form: body,
      success: (response) => {
        const { message } = response.data;
        callback(response.status, message);
      },
      failed: callback,
    });
    // return erp_api
    //   .post(`${PATH}-items`, body)
    //   .then((res) => {
    //     const { status } = res;
    //     console.log("res", res);
    //     // if (!(status >= 200 && status < 300)) {
    //     //   throw new Error("Bad response.", { cause: res });
    //     // }

    //     if (status === 201) {
    //       console.log("I am here");
    //       return callback(201, res.data.data.message);
    //     }

    //     return res;
    //   })
    //   .then((res) => {
    //     const {
    //       status,
    //       data: { data, message },
    //     } = res;

    //     callback(status, message, data);
    //   })
    //   .catch((err) => {
    //     return callback(err.status, "Something went wrong");
    //   });
  },
}));

export default usePPMPHook;
