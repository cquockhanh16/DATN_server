function getTime(time, type = "day") {
  let formatTime = new Date(time);
  switch (type) {
    case "day":
      return formatTime.getDate();
    case "month":
      return formatTime.getMonth() + 1;
    case "year":
      return formatTime.getFullYear();
    default:
      return formatTime.getDate();
  }
}

const getMonthsBetweenDates = (ms1, ms2) => {
  const date1 = new Date(+ms1);
  const date2 = new Date(+ms2);

  // Lấy năm và tháng của từng ngày
  const year1 = date1.getFullYear();
  const month1 = date1.getMonth();

  const year2 = date2.getFullYear();
  const month2 = date2.getMonth();

  // Tính số tháng chênh lệch
  const months = (year2 - year1) * 12 + (month2 - month1);

  // Trả về giá trị tuyệt đối để không bị âm nếu date2 < date1
  return Math.abs(months);
};

module.exports = { getTime, getMonthsBetweenDates };
