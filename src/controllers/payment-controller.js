const moment = require("moment");
const {
  ProductCode,
  VNPay,
  VnpLocale,
  ignoreLogger,
  dateFormat,
} = require("vnpay");
const crypto = require("crypto");
const axios = require("axios");

require("dotenv").config();

class PaymentController {
  static CreatePaymentUrl = async (req, res, next) => {
    try {
      let { orderIdd, amountt } = req.body;
      var partnerCode = "MOMO";
      var accessKey = process.env.MOMO_ACCESSKEY;
      var secretkey = process.env.MOMO_SERCETKEY;
      var requestId = partnerCode + new Date().getTime() + "-" + orderIdd;
      var orderId = requestId;
      var orderInfo = "pay with MoMo";
      var redirectUrl = "https://momo.vn/return";
      var ipnUrl = "http://localhost:2000/api/v1/callback";
      var amount = +amountt;
      var requestType = "captureWallet";
      var extraData = ""; //pass empty value if your merchant does not have stores

      //before sign HMAC SHA256 with format
      //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
      var rawSignature =
        "accessKey=" +
        accessKey +
        "&amount=" +
        amount +
        "&extraData=" +
        extraData +
        "&ipnUrl=" +
        ipnUrl +
        "&orderId=" +
        orderId +
        "&orderInfo=" +
        orderInfo +
        "&partnerCode=" +
        partnerCode +
        "&redirectUrl=" +
        redirectUrl +
        "&requestId=" +
        requestId +
        "&requestType=" +
        requestType;
      //puts raw signature
      // console.log("--------------------RAW SIGNATURE----------------");
      // console.log(rawSignature);
      //signature
      var signature = crypto
        .createHmac("sha256", secretkey)
        .update(rawSignature)
        .digest("hex");
      // console.log("--------------------SIGNATURE----------------");
      // console.log(signature);

      //json object send to MoMo endpoint
      const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: "vi",
      });
      let result;
      result = await axios({
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",

        // url: " https://test-payment.momo.vn/v2/gateway/querySession",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestBody),
        },
        data: requestBody,
      });

      // console.log(res);

      return res.status(200).json({ data: result.data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static MomoIPNHandler = async (req, res) => {
    try {
      const {
        partnerCode,
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        signature,
        // ... các tham số khác từ Momo
      } = req.body;

      // 1. Kiểm tra chữ ký (signature) để đảm bảo request hợp lệ từ Momo
      const rawSignature = `accessKey=${
        process.env.MOMO_ACCESSKEY
      }&amount=${amount}&extraData=&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${new Date().getTime()}&resultCode=${resultCode}&transId=${transId}`;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.MOMO_SERCETKEY)
        .update(rawSignature)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("Invalid signature from Momo");
        return res
          .status(403)
          .json({ RspCode: 403, Message: "Invalid signature" });
      }

      // 2. Xử lý theo resultCode
      if (resultCode === "0") {
        // Thanh toán thành công
        // TODO: Cập nhật database, gửi email xác nhận,...
        console.log(
          `Payment successful for order ${orderId}, amount ${amount}`
        );

        // 3. Trả response cho Momo (bắt buộc)
        return res.status(200).json({
          RspCode: 0,
          Message: "Confirm Success",
        });
      } else {
        // Thanh toán thất bại
        console.log(`Payment failed for order ${orderId}: ${message}`);
        // TODO: Cập nhật trạng thái đơn hàng

        return res.status(200).json({
          RspCode: 0,
          Message: "Confirm Success",
        });
      }
    } catch (error) {
      console.error("Error handling Momo IPN:", error);
      return res.status(500).json({
        RspCode: 99,
        Message: "Internal Server Error",
      });
    }
  };
}

module.exports = PaymentController;
