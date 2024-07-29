import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class HomePageRoute extends Route {
  @service productData;

  model() {
    return this.productData.getProducts();
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.model = model; // Imposta il modello nel controller
  }
}