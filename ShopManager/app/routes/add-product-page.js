// routes/add-product-page.js

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AddProductPageRoute extends Route {
  @service productData;

  model() {
    return {
      codice: '',
      titolo: '',
      descrizione: '',
      prezzo: '',
      quantita: '',
      numeroPulsante: '',
      paroleChiave: '',
      sezione: '',
      scaffale: ''
    };
  }
}
