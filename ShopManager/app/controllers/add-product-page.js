import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class AddProductPageController extends Controller {
  @service productData;
  @service router;
  @service notification;  // Iniezione del servizio di notifiche

  @tracked product = {
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

  @tracked errorMessages = [];

  @action
  handleInput(event) {
    const { name, value } = event.target;
    this.product[name] = value;
  }

  @action
  handleSubmit(event) {
    event.preventDefault(); // Previene il comportamento di invio predefinito del modulo

    // Controlla se tutti i campi sono riempiti
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
      // Aggiungi il prodotto e resetta il modulo
      this.productData.addProducts([this.product]);
      this.resetForm();
      this.notification.showSuccess('Prodotto aggiunto con successo');
      this.router.transitionTo('home-page');
    } else {
      // Mostra l'errore
      setTimeout(() => {
        this.errorMessages = [];
      }, 4000); // Nasconde il popup dopo 4 secondi
    }
  }

  resetForm() {
    this.product = {
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

  @action
  handleBack() {
    this.router.transitionTo('home-page');
  }
}

