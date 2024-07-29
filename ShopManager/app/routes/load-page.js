import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Papa from 'papaparse';

export default class LoadPageRoute extends Route {
  @service productData;
  @service router; // Inietta il servizio router

  model() {
    return {
      onFileLoaded: this.handleFileLoaded.bind(this)
    };
  }

  async handleFileLoaded(content) {
    try {
        this.productData.clearProducts(); // Aggiungi questa linea per cancellare i prodotti esistenti
      const parsedData = await this.parseCSV(content);
      const processedData = this.processData(parsedData);
      this.productData.addProducts(processedData);
      console.log(this.productData.getProducts());
      this.router.transitionTo('home-page'); // Usa il servizio router per navigare
    } catch (error) {
      console.error('Error parsing CSV file:', error);
      alert('Errore durante il caricamento del file CSV.');
    }
  }

  async parseCSV(fileContent) {
    return new Promise((resolve, reject) => {
      Papa.parse(fileContent, {
        header: true,
        encoding: 'UTF-8',
        complete: (results) => {
          // Filtra le righe con campo 'codice' vuoto
          const filteredData = results.data.filter(
            (item) => item.codice && item.codice.trim() !== '',
          );
          resolve(filteredData);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  processData(data) {
    return data.map((item) => ({
      codice: item['codice'],
      titolo: item['titolo'],
      descrizione: item['descrizione'],
      prezzo: parseFloat(item['prezzo']),
      quantita: parseInt(item['quantità']),
      numeroPulsante: item['numero pulsante'],
      paroleChiave: item['parole chiave'],
      sezione: item['sezione'],
      scaffale: item['scaffale'],
    }));
  }
}
