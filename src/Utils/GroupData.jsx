import moment from "moment";

export const groupByDate = (data = {}) => {
  if (!Array.isArray(data)) {
    console.warn("groupByDate expected array but got:", data);
    return {};
  }
  return data?.reduce((acc, item) => {
    const dateKey = moment(item.created_at).format("dddd, MMMM D"); // Wednesday, Apr 30
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});
};
