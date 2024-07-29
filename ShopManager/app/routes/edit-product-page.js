import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class EditProductPageRoute extends Route {
  @service productData;

  model(params) {
    // Trova e ritorna il prodotto in base al codice passato come parametro
    return this.productData.getProductByCode(params.product_id);
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.product = model; // Imposta il prodotto del controller con il modello caricato
  }
}
