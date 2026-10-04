import { expect, test } from '@playwright/test';

test('production desktop opens, minimizes, restores and closes an archive window', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/');
  await expect(page.getByText('Read-only showcase', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Open ChatGPT', exact: true }).click();
  const archive = page.getByRole('region', { name: 'ChatGPT window' });
  await expect(archive).toBeVisible();
  await page.getByRole('button', { name: 'Minimize ChatGPT', exact: true }).click();
  await expect(archive).toHaveCount(0);
  await page.getByRole('button', { name: 'Open ChatGPT', exact: true }).click();
  await expect(archive).toBeVisible();
  await page.getByRole('button', { name: 'Close ChatGPT', exact: true }).click();
  await expect(archive).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});

test('a delayed previous conversation cannot replace the newly selected one', async ({ page }) => {
  const detail = (id: string) => ({
    id, title: `Conversation ${id}`, summary: null, tags: [], message_count: 1,
    created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z',
  });
  const paginated = (data: unknown[]) => ({ success: true, data: { data, has_more: false, next_cursor: null } });
  let releaseA!: () => void;
  let markAStarted!: () => void;
  let markAFinished!: () => void;
  const aStarted = new Promise<void>(resolve => { markAStarted = resolve; });
  const aReleased = new Promise<void>(resolve => { releaseA = resolve; });
  const aFinished = new Promise<void>(resolve => { markAFinished = resolve; });

  await page.route('**/api/chatgpt/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/chatgpt/tags') return route.fulfill({ json: { success: true, data: [] } });
    if (path === '/api/chatgpt/conversations') return route.fulfill({ json: paginated([detail('A'), detail('B')]) });
    if (path === '/api/chatgpt/conversations/A') {
      markAStarted();
      await aReleased;
      try { await route.fulfill({ json: { success: true, data: detail('A') } }); }
      finally { markAFinished(); }
      return;
    }
    if (path.endsWith('/messages')) {
      const id = path.split('/').at(-2);
      return route.fulfill({ json: paginated([{
        id: `message-${id}`, role: 'assistant', content_md: `Message for ${id}`,
        created_at: '2026-01-01T00:00:00Z', order_index: 0, assets: [],
      }]) });
    }
    if (path === '/api/chatgpt/conversations/B') return route.fulfill({ json: { success: true, data: detail('B') } });
    return route.abort();
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Open ChatGPT', exact: true }).click();
  await page.getByRole('button', { name: /Conversation A/ }).click();
  await aStarted;
  await page.getByRole('button', { name: /Conversation B/ }).click();
  await expect(page.getByText('Message for B', { exact: true })).toBeVisible();
  releaseA();
  await aFinished;
  // Allow a fulfilled obsolete response to settle; the regression used to replace B here.
  await page.waitForTimeout(200);
  await expect(page.getByRole('heading', { name: 'Conversation B', exact: true })).toBeVisible();
  await expect(page.getByText('Message for A', { exact: true })).toHaveCount(0);
});
