import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class EditProductPageController extends Controller {
  @service productData;
  @service router;
  @service notification;

  @tracked product = this.model; // Imposta il prodotto inizialmente al valore del modello

  @tracked errorMessages = [];

  constructor() {
    super(...arguments);
    this.setupProduct();
  }

  setupProduct() {
    // Assicura che il prodotto sia impostato correttamente
    this.product = this.model;
  }

  @action
  handleInput(event) {
    const { name, value } = event.target;
    this.product[name] = value;
  }

  @action
  handleSubmit(event) {
    event.preventDefault();

    this.errorMessages = [];
    const requiredFields = [
      'codice',
      'titolo',
      'descrizione',
      'prezzo',
      'quantita',
      'numeroPulsante',
      'paroleChiave',
      'sezione',
      'scaffale'
    ];

    requiredFields.forEach(field => {
      if (!this.product[field]) {
        this.errorMessages.push(`Il campo ${field} è obbligatorio.`);
      }
    });

    if (this.errorMessages.length === 0) {
      this.productData.updateProduct(this.product); // Usa un metodo per aggiornare il prodotto
      this.notification.showSuccess('Prodotto aggiornato con successo');
      this.router.transitionTo('home-page');
    } else {
      setTimeout(() => {
        this.errorMessages = [];
      }, 4000); // Nasconde il popup dopo 4 secondi
    }
  }

  @action
  handleBack() {
    this.router.transitionTo('home-page');
  }
}
