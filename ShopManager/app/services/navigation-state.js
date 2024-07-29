import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class NavigationStateService extends Service {
  @tracked _allowLoadPage = false;

  constructor() {
    super(...arguments);
    this.loadAllowLoadPageFromLocalStorage();
  }

  set allowLoadPage(value) {
    this._allowLoadPage = value;
    localStorage.setItem('allowLoadPage', value);
  }

  get allowLoadPage() {
    return this._allowLoadPage;
  }

  loadAllowLoadPageFromLocalStorage() {
    const storedValue = localStorage.getItem('allowLoadPage');
    const hasOtherData = Object.keys(localStorage).some(key => key !== 'allowLoadPage');
    
    if (hasOtherData) {
      this._allowLoadPage = storedValue === 'true';
    } else {
      this._allowLoadPage = true;
      localStorage.setItem('allowLoadPage', 'true');
    }
  }
}
