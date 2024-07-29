import Model, { attr } from '@ember-data/model';

export default class ProductModel extends Model {
  @attr('string') codice;
  @attr('string') titolo;
  @attr('string') descrizione;
  @attr('number') prezzo;
  @attr('number') quantita;
  @attr('string') numeroPulsante;
  @attr('string') paroleChiave;
  @attr('string') sezione;
  @attr('string') scaffale;
}
