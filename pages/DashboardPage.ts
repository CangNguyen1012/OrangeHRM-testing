import { Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardUrl = "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index";

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.dashboardUrl);
    await this.page.waitForLoadState('networkidle');
  }
}
