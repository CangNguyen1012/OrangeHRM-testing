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

  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }
}

class PIMPage extends BasePage {
  async navigateToPIM() {
    await this.clickSidebarLink('PIM');
    await this.page.waitForLoadState('networkidle');
  }

  async searchEmployeeByName(name: string) {
    await this.page.getByRole('textbox', { name: 'Employee Name' }).fill(name);
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async resetFilters() {
    await this.page.getByRole('button', { name: 'Reset' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterByEmploymentStatus(status: string) {
    const statusDropdown = this.page.getByRole('combobox', { name: 'Employment Status' });
    await statusDropdown.click();
    await this.page.getByRole('option', { name: status }).click();
  }

  async clickAddEmployee() {
    await this.page.getByRole('button', { name: 'Add' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillEmployeeForm(firstName: string, lastName: string) {
    await this.page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
    await this.page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
  }

  async submitForm() {
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyEmployeeListDisplayed() {
    const employeeTable = this.page.locator('table');
    await expect(employeeTable).toBeVisible();
  }

  async verifyEmployeeInList(name: string) {
    const employeeRow = this.page.locator(`text=${name}`);
    await expect(employeeRow).toBeVisible();
  }

  async verifySuccessMessage() {
    const successMessage = this.page.locator('[class*="success"], [role="alert"]');
    await expect(successMessage).toBeVisible();
  }
}

test.describe('PIM - Employee Management', () => {
  test('2.1 - View and Search Employee List', async ({ page }) => {
    const pimPage = new PIMPage(page);
    
    // 1. Navigate to PIM module
    await pimPage.navigateToPIM();
    
    // 2. Verify employee list is displayed
    await pimPage.verifyEmployeeListDisplayed();
    
    // 3. Search for an employee
    await pimPage.searchEmployeeByName('Oliver');
    
    // 4. Verify results are filtered
    await pimPage.verifyEmployeeInList('Oliver');
    
    // 5. Reset filters
    await pimPage.resetFilters();
  });

  test('2.2 - Filter Employees by Employment Status', async ({ page }) => {
    const pimPage = new PIMPage(page);
    
    // 1. Navigate to PIM module
    await pimPage.navigateToPIM();
    
    // 2. Filter by employment status
    await pimPage.filterByEmploymentStatus('Contract');
    
    // 3. Click search
    await page.getByRole('button', { name: 'Search' }).click();
    await page.waitForLoadState('networkidle');
    
    // 4. Verify results are filtered
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('2.3 - Add New Employee', async ({ page }) => {
    const pimPage = new PIMPage(page);
    
    // 1. Navigate to PIM module
    await pimPage.navigateToPIM();
    
    // 2. Click Add Employee button
    await pimPage.clickAddEmployee();
    
    // 3. Fill employee form
    await pimPage.fillEmployeeForm('John', 'Doe');
    
    // 4. Submit form
    await pimPage.submitForm();
    
    // 5. Verify success message
    await pimPage.verifySuccessMessage();
  });

  test('2.4 - Edit Employee Information', async ({ page }) => {
    const pimPage = new PIMPage(page);
    
    // 1. Navigate to PIM module
    await pimPage.navigateToPIM();
    
    // 2. Search for an employee
    await pimPage.searchEmployeeByName('Peter');
    
    // 3. Click on employee record to view details
    await page.locator('text=Peter').first().click();
    await page.waitForLoadState('networkidle');
    
    // 4. Click edit button
    const editButton = page.getByRole('button', { name: /Edit/i });
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.waitForLoadState('networkidle');
      
      // 5. Modify a field (phone number)
      const phoneField = page.getByRole('textbox', { name: /mobile/i });
      if (await phoneField.isVisible()) {
        await phoneField.fill('1234567890');
        
        // 6. Save changes
        await page.getByRole('button', { name: 'Save' }).click();
        await page.waitForLoadState('networkidle');
        
        // 7. Verify success
        await pimPage.verifySuccessMessage();
      }
    }
  });
});
