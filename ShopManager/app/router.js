import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { inject as service } from '@ember/service';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
  @service navigationState;

  constructor() {
    super(...arguments);

    this.on('routeDidChange', (transition) => {
      if (transition.to.name === 'load-page' && !this.navigationState.allowLoadPage) {
        console.log(this.navigationState.allowLoadPage);
        this.replaceWith('home-page');
      }else if(transition.to.name === 'home-page' && this.navigationState.allowLoadPage){
        this.replaceWith('load-page');
      }
    });
  }
}

Router.map(function() {
  this.route('load-page');
  this.route('home-page');
  this.route('add-product-page');
  this.route('edit-product-page', { path: '/edit-product/:product_id' });
});
