import { test, expect, Page, Locator } from '@playwright/test';

// Page Object - BasePage
class BasePage {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly searchBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.getByRole('navigation', { name: 'Sidepanel' });
    this.searchBox = page.getByRole('textbox', { name: 'Search' });
  }

  async clickSidebarLink(moduleName: string) {
    await this.page.getByRole('link', { name: moduleName }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }
}

// Page Object - LoginPage
class LoginPage extends BasePage {
  async login(username: string, password: string) {
    await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLoginPageDisplayed() {
    const usernameField = this.page.getByRole('textbox', { name: 'Username' });
    const passwordField = this.page.getByRole('textbox', { name: 'Password' });
    const loginButton = this.page.getByRole('button', { name: 'Login' });
    
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(loginButton).toBeVisible();
  }
}

// Page Object - DashboardPage
class DashboardPage extends BasePage {
  async verifyDashboardLoaded() {
    await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  }

  async verifyTimeAtWorkWidget() {
    const timeAtWorkWidget = this.page.getByText('Time at Work');
    await expect(timeAtWorkWidget).toBeVisible();
  }

  async verifyMyActionsWidget() {
    const myActionsWidget = this.page.getByText('My Actions');
    await expect(myActionsWidget).toBeVisible();
  }

  async verifyQuickLaunchButtons() {
    const quickLaunchButtons = [
      'Assign Leave', 'Leave List', 'Timesheets', 'Apply Leave', 'My Leave', 'My Timesheet'
    ];
    
    for (const button of quickLaunchButtons) {
      await expect(this.page.getByRole('button', { name: button })).toBeVisible();
    }
  }

  async verifyBuzzLatestPosts() {
    const buzzSection = this.page.getByText('Buzz Latest Posts');
    await expect(buzzSection).toBeVisible();
  }
}

// Tests
test.describe('Authentication & Dashboard', () => {
  test('1.1 - Successful Login with Valid Credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    // 1. Navigate to login page
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await loginPage.verifyLoginPageDisplayed();
    
    // 2. Enter credentials and login
    await loginPage.login('Admin', 'admin123');
    
    // 3. Verify successful login
    const currentURL = await dashboardPage.getCurrentURL();
    expect(currentURL).toContain('/dashboard/index');
    await dashboardPage.verifyDashboardLoaded();
  });

  test('1.2 - View Dashboard Widgets', async ({ page }) => {
    // Page is already logged in via seed
    const dashboardPage = new DashboardPage(page);
    
    // 1. Verify dashboard is loaded
    await dashboardPage.verifyDashboardLoaded();
    
    // 2. Verify all widgets are visible
    await dashboardPage.verifyTimeAtWorkWidget();
    await dashboardPage.verifyMyActionsWidget();
    await dashboardPage.verifyQuickLaunchButtons();
    await dashboardPage.verifyBuzzLatestPosts();
  });

  test('1.3 - Navigate Between Main Modules', async ({ page }) => {
    const basePage = new BasePage(page);
    
    // 1. Navigate to Admin module
    await basePage.clickSidebarLink('Admin');
    let currentURL = await basePage.getCurrentURL();
    expect(currentURL).toContain('/admin/');
    
    // 2. Navigate to PIM module
    await basePage.clickSidebarLink('PIM');
    currentURL = await basePage.getCurrentURL();
    expect(currentURL).toContain('/pim/');
    
    // 3. Navigate to Leave module
    await basePage.clickSidebarLink('Leave');
    currentURL = await basePage.getCurrentURL();
    expect(currentURL).toContain('/leave/');
    
    // 4. Navigate back to Dashboard
    await basePage.clickSidebarLink('Dashboard');
    currentURL = await basePage.getCurrentURL();
    expect(currentURL).toContain('/dashboard/');
  });
});
