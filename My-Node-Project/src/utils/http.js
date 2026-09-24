function sendError(res, error) {
  if (error.statusCode) {
    return res.status(error.statusCode).json({ success: false, message: error.message });
  }

  const statusByCode = {
    ER_DUP_ENTRY: 409,
    ER_NO_REFERENCED_ROW_2: 400,
    ER_ROW_IS_REFERENCED_2: 409,
    ER_DATA_TOO_LONG: 400,
    ER_TRUNCATED_WRONG_VALUE: 400
  };
  const status = statusByCode[error.code] || 500;
  const message = status === 500 ? 'Đã xảy ra lỗi máy chủ' : error.message;

  return res.status(status).json({ success: false, message });
}

function parsePagination(query, defaults = {}) {
  const limit = Number.parseInt(query.limit ?? defaults.limit ?? 20, 10);
  const page = Number.parseInt(query.page ?? defaults.page ?? 1, 10);

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    const error = new Error('limit phải là số nguyên từ 1 đến 100');
    error.statusCode = 400;
    throw error;
  }
  if (!Number.isInteger(page) || page < 1) {
    const error = new Error('page phải là số nguyên lớn hơn hoặc bằng 1');
    error.statusCode = 400;
    throw error;
  }

  return { limit, page, offset: (page - 1) * limit };
}

function requireFields(body, fields) {
  const missing = fields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || (typeof value === 'string' && !value.trim());
  });

  if (missing.length > 0) {
    const error = new Error(`Thiếu trường bắt buộc: ${missing.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }
}

function requireEnum(value, field, values) {
  if (value !== undefined && !values.includes(value)) {
    const error = new Error(`${field} không hợp lệ. Giá trị hợp lệ: ${values.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }
}

module.exports = { sendError, parsePagination, requireFields, requireEnum };
