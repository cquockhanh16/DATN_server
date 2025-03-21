const path = require("path");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const fs = require("fs");

async function generatePDF(orderData) {
  try {
    console.log(orderData);
    // Load template EJS
    const templatePath = path.resolve(
      __dirname,
      "../views",
      "order-template.ejs"
    );
    const htmlContent = await ejs.renderFile(templatePath, orderData);

    // Khởi tạo Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Load HTML vào Puppeteer
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    const fileName = `order-invoice_${new Date().getTime()}.pdf`;

    // Đường dẫn lưu PDF
    const pdfPath = path.resolve(__dirname, fileName);
    const publicDir = path.join(__dirname, "../public");
    const destinationPath = path.join(publicDir, path.basename(pdfPath));

    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
    });

    fs.renameSync(pdfPath, destinationPath);

    // Đóng trình duyệt
    await browser.close();

    return { fileName, destinationPath }; // Trả về đường dẫn file PDF
  } catch (error) {
    throw new Error("Có lỗi xảy ra khi tạo PDF: " + error.message);
  }
}

module.exports = { generatePDF };
