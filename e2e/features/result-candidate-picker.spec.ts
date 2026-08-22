import { expect, test } from '@playwright/test';

import * as Lib from '../lib';

test.describe('Result candidate picker', () => {
  test.use({ viewport: { width: 800, height: 900 } });

  test('shows a placeholder until a result candidate is picked', async ({ page }) => {
    await Lib.visitIndex(page);

    const picker = Lib.getResultCandidatePicker(page);
    await expect(picker).toHaveText('Select...');

    await Lib.typeBoard(page, 'i', 'horizontal', { x: 7, y: 7 });
    await Lib.typeRack(page, 'q');
    await Lib.solve(page);

    await expect(picker).not.toContainText('Select...');
    await expect(picker).toContainText('qi');
  });
});
