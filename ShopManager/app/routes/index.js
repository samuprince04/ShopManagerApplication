import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service router;

  beforeModel() {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    if (storedProducts.length > 0) {
      this.router.transitionTo('home-page');
    } else {
      this.router.transitionTo('load-page');
    }
  }
}
