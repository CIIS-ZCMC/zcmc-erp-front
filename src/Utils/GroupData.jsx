import moment from "moment";

export const groupByDate = (data) => {
  return data.reduce((acc, item) => {
    const dateKey = moment(item.created_at).format("dddd, MMMM D"); // Wednesday, Apr 30
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});
};
