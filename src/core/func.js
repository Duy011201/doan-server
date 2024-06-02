const bcrypt = require('bcryptjs');
const setting = require('../config/setting');

function isEmpty(value) {
  if (typeof value === 'string') {
    // Kiểm tra chuỗi
    return !value.trim(); // Trả về true nếu chuỗi là rỗng hoặc chỉ gồm khoảng trắng
  } else if (typeof value === 'object' && value !== null) {
    // Kiểm tra đối tượng hoặc mảng
    return !Object.keys(value).length; // Trả về true nếu không có thuộc tính hoặc phần tử nào
  } else {
    // Trường hợp còn lại, bao gồm mảng rỗng, null và undefined
    return !value; // Trả về true nếu giá trị là null, undefined hoặc mảng rỗng
  }
}

function timeDiff(time1, time2, nDay) {
  const timeDiff = Math.abs(time1 - time2);

  // Đổi milliseconds thành số ngày
  const oneDayInMilliseconds = 1000 * 60 * 60 * 24;
  const daysDiff = timeDiff / oneDayInMilliseconds;

  // Kiểm tra xem khoảng cách giữa hai thời gian có nhỏ hơn n ngày không
  return daysDiff < nDay;
}

function isEmail(email) {
  return !isEmpty(email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function bcryptComparePassword(checkPassword, passwordInDB) {
  // default length < 5 length > 20
  if (
    !isEmpty(checkPassword) &&
    checkPassword.length < 5 &&
    checkPassword.length > 20
  )
    return false;

  try {
    return await bcrypt.compare(checkPassword, passwordInDB);
  } catch (err) {
    console.error('Error comparing passwords:', err);
    throw err;
  }
}

function generateRandomVerifyCode() {
  // default gen 6 number
  return Math.floor(100000 + Math.random() * 900000);
}

async function bcryptHashPassword(password) {
  // default length < 5 and length > 20
  if (!isEmpty(password) && password.length < 5 && password.length > 20) {
    throw new Error(setting.RESPONSE_MESSAGE.ERROR_ENCODE);
  }

  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

function filterFields(array, fieldsToKeep) {
  // using filer fields for data get to database
  return array.map((item) => {
    const filteredItem = {};
    fieldsToKeep.forEach((field) => {
      if (item.hasOwnProperty(field)) {
        filteredItem[field] = item[field];
      }
    });
    return filteredItem;
  });
}

module.exports = {
  isEmpty,
  isEmail,
  bcryptComparePassword,
  bcryptHashPassword,
  generateRandomVerifyCode,
  timeDiff,
  filterFields,
};
