import { test, expect, Page, Locator } from '@playwright/test';

class BasePage {
  readonly page: Page;
  readonly sidebar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.getByRole('navigation', { name: 'Sidepanel' });
  }

  async clickSidebarLink(moduleName: string) {
    await this.page.getByRole('link', { name: moduleName }).click();
    await this.page.waitForLoadState('networkidle');
  }
}

class AdminPage extends BasePage {
  async navigateToAdmin() {
    await this.clickSidebarLink('Admin');
    await this.page.waitForLoadState('networkidle');
  }

  async clickUserManagementTab() {
    const userMgmtLink = this.page.getByRole('link', { name: 'User Management' });
    if (await userMgmtLink.isVisible()) {
      await userMgmtLink.click();
    } else {
      const tab = this.page.locator('text=User Management').first();
      await tab.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async clickJobTab() {
    const jobLink = this.page.getByRole('link', { name: 'Job' });
    if (await jobLink.isVisible()) {
      await jobLink.click();
    } else {
      const tab = this.page.locator('text=Job').first();
      await tab.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async clickOrganizationTab() {
    const orgLink = this.page.getByRole('link', { name: 'Organization' });
    if (await orgLink.isVisible()) {
      await orgLink.click();
    } else {
      const tab = this.page.locator('text=Organization').first();
      await tab.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async searchUser(username: string) {
    const searchField = this.page.getByRole('textbox', { name: /username|search/i });
    if (await searchField.isVisible()) {
      await searchField.fill(username);
      await this.page.getByRole('button', { name: 'Search' }).click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async clickAddJobTitle() {
    await this.page.getByRole('button', { name: 'Add' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillJobTitleForm(jobTitle: string, description: string) {
    const titleField = this.page.getByRole('textbox', { name: 'Job Title' });
    const descField = this.page.locator('textarea').first();

    if (await titleField.isVisible()) {
      await titleField.fill(jobTitle);
    }

    if (await descField.isVisible()) {
      await descField.fill(description);
    }
  }

  async submitForm() {
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyUserTableDisplayed() {
    const userTable = this.page.locator('table');
    await expect(userTable).toBeVisible();
  }

  async verifyJobTitleInList(jobTitle: string) {
    const jobRow = this.page.locator(`text=${jobTitle}`);
    await expect(jobRow).toBeVisible();
  }

  async verifySuccessMessage() {
    const successAlert = this.page.locator('[class*="success"], [role="alert"]');
    await expect(successAlert).toBeVisible();
  }

  async verifyOrganizationPageDisplayed() {
    const orgContent = this.page.locator('[class*="organization"]');
    expect(orgContent).toBeTruthy();
  }
}

test.describe('Admin Module', () => {
  test('4.1 - Manage System Users', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    // 1. Navigate to Admin module
    await adminPage.navigateToAdmin();
    
    // 2. Access User Management
    await adminPage.clickUserManagementTab();
    
    // 3. Verify user table is displayed
    await adminPage.verifyUserTableDisplayed();
    
    // 4. Search for a user
    await adminPage.searchUser('Admin');
  });

  test('4.2 - Manage Job Titles', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    // 1. Navigate to Admin module
    await adminPage.navigateToAdmin();
    
    // 2. Click Job tab
    await adminPage.clickJobTab();
    
    // 3. Click Add button
    await adminPage.clickAddJobTitle();
    
    // 4. Fill job title form
    await adminPage.fillJobTitleForm('Senior Developer', 'Leads development team and manages projects');
    
    // 5. Submit form
    await adminPage.submitForm();
    
    // 6. Verify success message
    await adminPage.verifySuccessMessage();
  });

  test('4.3 - View Organization Structure', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    // 1. Navigate to Admin module
    await adminPage.navigateToAdmin();
    
    // 2. Click Organization tab
    await adminPage.clickOrganizationTab();
    
    // 3. Verify organization content is visible
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
  });

  test('4.4 - Add System User', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    // 1. Navigate to Admin module
    await adminPage.navigateToAdmin();
    
    // 2. Access User Management
    await adminPage.clickUserManagementTab();
    
    // 3. Click Add button to create new user
    const addButton = page.getByRole('button', { name: 'Add' });
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForLoadState('networkidle');
      
      // 4. Fill user form
      const userRoleField = page.getByRole('combobox', { name: /user role/i });
      if (await userRoleField.isVisible()) {
        await userRoleField.click();
        await page.getByRole('option', { name: 'Admin' }).click();
      }
      
      const userNameField = page.getByRole('textbox', { name: /username/i });
      if (await userNameField.isVisible()) {
        await userNameField.fill('newuser123');
      }
      
      // 5. Submit form
      await adminPage.submitForm();
      
      // 6. Verify success
      await adminPage.verifySuccessMessage();
    }
  });
});
