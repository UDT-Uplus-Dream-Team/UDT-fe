import { test, expect } from '@playwright/test';

// JWT 토큰 설정 (auth-test.spec.ts와 동일한 토큰 사용)
const TEST_JWT =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwiUk9MRSI6IlJPTEVfVVNFUiIsImlhdCI6MTc1NDU0NDc0NSwiZXhwIjoxNzU0NTUwMTQ1fQ.2rTMDe81ruitsf7hA411rEZoI1WnhEUGMxicKaul5683DPE0O6_T5Jn91_IkhxY_xUd98YJ1RgEnlxmf8f2wxg';

test.describe('모바일 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // JWT가 설정되지 않았으면 테스트 스킵
    if (!TEST_JWT) {
      test.skip(true, 'JWT 토큰을 설정해주세요');
    }

    // JWT 쿠키 설정
    await page.context().addCookies([
      {
        name: 'Authorization',
        value: TEST_JWT,
        domain: 'local.banditbool.com',
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      },
    ]);
  });

  test('모바일 추천페이지', async ({ page, isMobile }) => {
    test.skip(!isMobile, '모바일에서만 실행');

    await page.goto('/recommend');
    await expect(page.locator('body')).toBeVisible();
    console.log('모바일에서 추천페이지 접근 성공');
  });

  test('반응형 디자인 테스트', async ({ page }) => {
    const viewports = [
      { name: '모바일', width: 375, height: 667 },
      { name: '태블릿', width: 768, height: 1024 },
      { name: '데스크톱', width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      console.log(
        `${viewport.name} 크기 테스트 (${viewport.width}x${viewport.height})`,
      );

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto('/recommend');
      await expect(page.locator('body')).toBeVisible();

      console.log(`${viewport.name} 크기에서 정상 로딩`);
    }
  });

  test('모바일 터치 스와이프', async ({ page, isMobile }) => {
    test.skip(!isMobile, '모바일에서만 실행');

    await page.goto('/recommend');
    await expect(page.locator('body')).toBeVisible();

    // 터치 이벤트로 스와이프 시뮬레이션
    const swipeArea = page.locator('div').first();
    const box = await swipeArea.boundingBox();

    if (box) {
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      // 터치 스와이프 (우측)
      await page.touchscreen.tap(centerX, centerY);
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX + 100, centerY, { steps: 5 });
      await page.mouse.up();

      console.log('모바일 터치 스와이프 완료');
    }
  });
});
