import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ProductDataService extends Service {
  @tracked products = [];

  constructor() {
    super(...arguments);
    this.loadProducts();
  }

  saveProducts() {
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  loadProducts() {
    const productsFromStorage = localStorage.getItem('products');
    if (productsFromStorage) {
      this.products = JSON.parse(productsFromStorage);
    } else {
      this.products = [];
    }
  }

  addProducts(newProducts) {
    this.products = [...this.products, ...newProducts];
    this.saveProducts();
  }

  clearProducts() {
    this.products = [];
    localStorage.removeItem('products');
  }

  getProducts() {
    return this.products;
  }

  deleteProduct(product) {
    this.products = this.products.filter(p => p.codice !== product.codice);
    this.saveProducts();
  }

  updateProduct(updatedProduct) {
    this.products = this.products.map(product =>
      product.codice === updatedProduct.codice ? updatedProduct : product
    );
    this.saveProducts();
  }

  getProductByCode(codice) {
    return this.products.find(product => product.codice === codice);
  }
  
}
