const cron = require("node-cron");
const { checkExpiredProducts } = require("../services/pawn-product-service");

function setupCronJobs() {
  //   Job kiểm tra sản phẩm quá hạn hàng ngày
  cron.schedule(
    "*/10 * * * *",
    async () => {
      await checkExpiredProducts();
    },
    {
      scheduled: true,
      timezone: "Asia/Ho_Chi_Minh",
    }
  );

  //   cron.schedule(
  //     "* * * * *",
  //     async () => {
  //       await checkExpiredProducts();
  //     },
  //     {
  //       scheduled: true,
  //       timezone: "Asia/Ho_Chi_Minh",
  //     }
  //   );

  // Thêm các cron job khác nếu cần
  // cron.schedule('*/5 * * * *', anotherTask);

  console.log("Đã khởi tạo cron jobs");
}

module.exports = setupCronJobs;
