import { module, test } from 'qunit';
import { setupRenderingTest } from 'shop-manager/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | product-details', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ProductDetails />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <ProductDetails>
        template block text
      </ProductDetails>
    `);

    assert.dom().hasText('template block text');
  });
});
