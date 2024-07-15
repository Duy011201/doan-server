const productService = require('../service/productService');

const productController = {
  create: (req, res) => {
    return productService.svCreate(req, res);
  },
  update: (req, res) => {
    return productService.svUpdate(req, res);
  },
  getAll: (req, res) => {
    return productService.svGetAll(req, res);
  },
  delete: (req, res) => {
    return productService.svDelete(req, res);
  },
};

module.exports = productController;
