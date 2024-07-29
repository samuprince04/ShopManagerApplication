import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { Html5Qrcode } from "html5-qrcode";

export default class HomePageController extends Controller {
  @service productData;
  @service notification;
  @service router;
  @service navigationState; // Inject the navigation state service

  @tracked expandedProduct = null;
  @tracked searchQuery = '';
  @tracked filteredProducts = [];
  @tracked suggestions = [];
  @tracked showResetButton = false;
  @tracked fabMenuVisible = false;
  @tracked showConfirmationPopup = false;
  @tracked deletedSuccessfully = false;
  @tracked isQRCodeScanning = false;
  @tracked showErrorPopup = false;
  @tracked suggestionSelected = false;


  set model(value) {
    this._model = value;
    this.filteredProducts = value;
  }

  get model() {
    return this._model;
  }

  @action
  toggleDescription(product) {
    if (this.expandedProduct === product) {
      this.expandedProduct = null;
    } else {
      this.expandedProduct = product;
    }
  }

  @action
  updateSearchQuery(event) {
    this.searchQuery = event.target.value;
    this.updateSuggestions();
  }

  @action
  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.executeSearch();
    }
  }

  @action
  executeSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredProducts = query.trim() === '' ? this.productData.getProducts() : this.productData.getProducts().filter((product) => {
      return (
        product.titolo.toLowerCase().startsWith(query) ||
        product.paroleChiave.toLowerCase().startsWith(query) ||
        product.codice.toLowerCase().startsWith(query)
      );
    });
    this.suggestionSelected=true;
    this.suggestions = [];
    this.showResetButton = true;
  }

  @action
updateSuggestions() {
  let query = this.searchQuery.toLowerCase();
  if (query === '') {
    this.suggestions = [];
  } else {
    this.suggestions = this.productData.getProducts()
      .filter((product) => {
        let paroleChiaveArray = product.paroleChiave.toLowerCase().split(',').map(parola => parola.trim());
        return (
          product.titolo.toLowerCase().startsWith(query) ||
          paroleChiaveArray.some(parola => parola.startsWith(query)) ||
          product.codice.toLowerCase().startsWith(query)
        );
      })
      .slice(0, 20);
  }
}


  @action
  selectSuggestion(suggestion) {
    this.searchQuery = suggestion.titolo;
    this.filteredProducts = this.productData.getProducts().filter((product) => product.codice === suggestion.codice);
    this.suggestions = [];
    this.showResetButton = true;
    this.suggestionSelected= true;
  }

  @action
  resetSearch() {
    this.searchQuery = '';
    this.filteredProducts = this.productData.getProducts();
    this.showResetButton = false;
    this.suggestions = [];
  }

  @action
  handleAdd() {
    this.toggleFabMenu();
    this.router.transitionTo('add-product-page');
    this.resetSearch();
  }

  @action
  deleteProduct(product) {
    if (window.confirm('Sei sicuro di voler eliminare il prodotto?')) {
      this.showDeletedSuccessfully();
      this.productData.deleteProduct(product);
      console.log(this.filteredProducts.length)
      this.filteredProducts = this.filteredProducts.filter(p => p.codice !== product.codice);
      if(this.suggestionSelected && this.filteredProducts.length===0){
        this.suggestionSelected=false;
        this.resetSearch();
      }
    }
  }

  @action
  toggleFabMenu() {
    this.fabMenuVisible = !this.fabMenuVisible;
  }

  @action
  editProduct(product) {
    this.resetSearch();
    this.router.transitionTo('edit-product-page', product.codice);
  }


  @action
  clearLocalStorageAndLoadPage() {
    if (window.confirm('Sei sicuro di voler svuotare il localStorage e caricare la pagina di upload?')) {
      this.toggleFabMenu();
      localStorage.clear();
      this.productData.clearProducts();
      this.navigationState.allowLoadPage = true; // Set the flag before transitioning
      this.resetSearch()
      this.router.transitionTo('load-page');
    }
  }

  showDeletedSuccessfully() {
    this.deletedSuccessfully = true;
    setTimeout(() => {
      this.deletedSuccessfully = false;
    }, 4000);
  }

  @action
  downloadProducts() {
    const products = this.productData.products;

    const csvContent = [
      ['codice', 'titolo', 'descrizione', 'prezzo', 'quantità', 'numero pulsante', 'parole chiave', 'sezione', 'scaffale'],
      ...products.map(product => [
        product.codice,
        product.titolo,
        `"${product.descrizione.replace(/"/g, '""')}"`,
        product.prezzo,
        product.quantita,
        product.numeroPulsante,
        `"${product.paroleChiave.replace(/"/g, '""')}"`,
        product.sezione,
        product.scaffale
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "products.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  @action
async scanQRCode() {
  this.isQRCodeScanning = true;

  // Attendi che il DOM sia aggiornato e l'elemento sia disponibile
  await this.waitForElement("#reader");

  const qrCodeRegionId = "reader";
  this.html5QrCodeInstance = new Html5Qrcode(qrCodeRegionId);

  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    console.log(`Codice prodotto scansionato: ${decodedText}`);
    const productExists = this.productData.products.some(product => product.codice === decodedText);
    
    if (productExists) {
      this.updateFilteredProducts(decodedText);
      this.suggestionSelected=true;
    } else {
      this.showErrorPopup = true;
      setTimeout(() => {
        this.showErrorPopup = false;
      }, 4000);
    }
    
    this.cancelQRCodeScan();
  };

  const qrCodeErrorCallback = (errorMessage) => {
    console.warn(`Errore nella scansione del codice QR: ${errorMessage}`);
  };

  const container = document.getElementById(qrCodeRegionId);
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  this.html5QrCodeInstance.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: { width: width * 0.8, height: height * 0.5 } // dimensione del box QR code
    },
    qrCodeSuccessCallback,
    qrCodeErrorCallback
  ).catch((err) => {
    console.error("Errore durante l'avvio della scansione:", err);
  });
}


  @action
  waitForElement(selector) {
    return new Promise((resolve) => {
      const checkExist = setInterval(() => {
        if (document.querySelector(selector)) {
          clearInterval(checkExist);
          resolve();
        }
      }, 100);
    });
  }

  @action
  cancelQRCodeScan() {
    console.log("Annullamento della scansione QR code"); // Debug
    this.isQRCodeScanning = false;

    if (this.html5QrCodeInstance) {
      // Ferma la scansione
      this.html5QrCodeInstance.stop().then(() => {
        // Ottieni il flusso della videocamera e fermalo
        return navigator.mediaDevices.enumerateDevices();
      }).then((devices) => {
        devices.forEach((device) => {
          if (device.kind === "videoinput") {
            navigator.mediaDevices.getUserMedia({ video: { deviceId: device.deviceId } })
              .then((stream) => {
                stream.getTracks().forEach((track) => track.stop());
              });
          }
        });
      }).catch((err) => {
        console.error("Errore durante la gestione della videocamera:", err);
      });
    }
  }

  @action
  updateFilteredProducts(codice) {
    this.filteredProducts = this.productData.getProducts().filter(product => product.codice === codice);
    this.showResetButton = true;
  }

}

