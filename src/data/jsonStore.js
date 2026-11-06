// Tiện ích đọc/ghi file JSON dùng chung cho lớp dữ liệu
const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'db');

exports.read = (name) => JSON.parse(fs.readFileSync(path.join(DB_DIR, name), 'utf8'));
exports.write = (name, data) =>
  fs.writeFileSync(path.join(DB_DIR, name), JSON.stringify(data, null, 2), 'utf8');
