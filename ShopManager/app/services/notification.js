import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class NotificationService extends Service {
  @tracked showSuccessMessage = false;
  @tracked successMessage = '';

  showSuccess(message) {
    this.successMessage = message;
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 4000);
  }
}
