import { test, expect } from '@playwright/test';

test.use({ video: 'on' });
// 여기에 실제 JWT 토큰을 입력하세요
const TEST_JWT =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwiUk9MRSI6IlJPTEVfVVNFUiIsImlhdCI6MTc1NDU0NDc0NSwiZXhwIjoxNzU0NTUwMTQ1fQ.2rTMDe81ruitsf7hA411rEZoI1WnhEUGMxicKaul5683DPE0O6_T5Jn91_IkhxY_xUd98YJ1RgEnlxmf8f2wxg';

test.describe('JWT 인증 테스트', () => {
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

  test('주요 페이지 접근 테스트', async ({ page }) => {
    const pages = ['/recommend', '/explore', '/profile'];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      // 페이지가 로딩되고 에러가 없는지 확인
      await expect(page.locator('body')).toBeVisible();
      await expect(page).toHaveURL(
        new RegExp(`.*${pagePath.replace('/', '')}`),
      );

      console.log(`${pagePath} 페이지 접근 성공`);
    }
  });

  test('추천 페이지 스와이프 테스트 (모든 div 대상)', async ({ page }) => {
    await page.goto('/onboarding?step=5');
    await expect(page.locator('body')).toBeVisible();

    // 모든 div 요소를 순회하며 스와이프 가능한 영역 찾기
    const allDivs = page.locator('div');
    const count = await allDivs.count();
    let targetBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null = null;

    for (let i = 0; i < count; i++) {
      const divHandle = allDivs.nth(i);
      const box = await divHandle.boundingBox();
      if (box && box.width > 50 && box.height > 50) {
        // 간단히 크기가 적당한 div를 스와이프 대상이라고 가정
        targetBox = box;
        break;
      }
    }

    if (!targetBox) {
      throw new Error('스와이프 가능한 div 요소를 찾지 못했습니다');
    }

    const centerX = targetBox.x + targetBox.width / 2;
    const centerY = targetBox.y + targetBox.height / 2;

    // 좌측 스와이프
    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX - 200, centerY, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(500);

    // 우측 스와이프
    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX + 200, centerY, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(500);

    // 위쪽 스와이프
    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX, centerY - 200, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(500);
  });
});
