import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class LoadPageController extends Controller {
  @service router;
  @service productData;
  @service navigationState;

  @tracked showError = false;

  @action
  triggerFileInput() {
    document.getElementById('fileInput').click();
  }

  @action
  handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          if (this.isValidCSV(text)) {
            this.model.onFileLoaded(text); // Passa il contenuto del file alla funzione onFileLoaded
            this.showError = false; // Nasconde l'errore se il file è valido
            this.navigationState.allowLoadPage = false;
          } else {
            this.showError = true;
            throw new Error('Invalid CSV');
          }
        } catch (error) {
          this.showError = true; // Mostra il popup di errore
          this.hideErrorAfterDelay(); // Nasconde l'errore dopo 4 secondi
        }
      };
      reader.onerror = () => {
        this.showError = true; // Mostra il popup di errore se c'è un errore nella lettura del file
        this.hideErrorAfterDelay(); // Nasconde l'errore dopo 4 secondi
      };
      reader.readAsText(file, 'UTF-8');
    }
    
    // Reimposta il valore dell'elemento file input
    event.target.value = '';
  }
  

  isValidCSV(text) {
    const expectedHeaders = [
      'codice',
      'titolo',
      'descrizione',
      'prezzo',
      'quantità',
      'numero pulsante',
      'parole chiave',
      'sezione',
      'scaffale',
    ];

    // Divide il contenuto del CSV in righe
    const lines = text.trim().split('\n');

    // Verifica che ci sia almeno una riga
    if (lines.length === 0) {
      return false;
    }

    // Estrae le intestazioni dalla prima riga
    const headers = lines[0]
      .split(',')
      .map((header) => header.trim().toLowerCase());

    // Verifica che le intestazioni corrispondano esattamente a quelle attese
    if (headers.length !== expectedHeaders.length) {
      return false;
    }

    for (let i = 0; i < headers.length; i++) {
      if (headers[i] !== expectedHeaders[i]) {
        return false;
      }
    }

    return true;
  }

  hideErrorAfterDelay() {
    setTimeout(() => {
      this.showError = false;
    }, 4000); // Nasconde l'errore dopo 4 secondi
  }
}

