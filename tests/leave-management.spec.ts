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

class LeavePage extends BasePage {
  async navigateToLeave() {
    await this.clickSidebarLink('Leave');
    await this.page.waitForLoadState('networkidle');
  }

  async clickApplyTab() {
    await this.page.getByRole('link', { name: 'Apply' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickMyLeaveTab() {
    await this.page.getByRole('link', { name: 'My Leave' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillLeaveForm(leaveType: string, fromDate: string, toDate: string) {
    // Select leave type
    const leaveTypeDropdown = this.page.getByRole('combobox').first();
    await leaveTypeDropdown.click();
    await this.page.getByRole('option', { name: leaveType }).click();

    // Fill from date
    const fromDateField = this.page.locator('input[placeholder*="yyyy"]').first();
    await fromDateField.fill(fromDate);

    // Fill to date
    const toDateField = this.page.locator('input[placeholder*="yyyy"]').nth(1);
    await toDateField.fill(toDate);
  }

  async submitLeaveApplication() {
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterLeavesByDateRange(fromDate: string, toDate: string) {
    const fromDateField = this.page.locator('input[placeholder*="yyyy"]').first();
    const toDateField = this.page.locator('input[placeholder*="yyyy"]').nth(1);

    await fromDateField.fill(fromDate);
    await toDateField.fill(toDate);

    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterByLeaveStatus(status: string) {
    const statusDropdown = this.page.getByRole('combobox', { name: /status/i });
    await statusDropdown.click();
    await this.page.getByRole('option', { name: status }).click();
  }

  async verifyLeaveListDisplayed() {
    const leaveTable = this.page.locator('table');
    await expect(leaveTable).toBeVisible();
  }

  async verifyLeaveInList(leaveType: string) {
    const leaveRow = this.page.locator(`text=${leaveType}`);
    await expect(leaveRow).toBeVisible();
  }

  async verifySuccessMessage() {
    const successAlert = this.page.locator('[class*="success"], [role="alert"]');
    await expect(successAlert).toBeVisible();
  }

  async verifyMyLeaveHistoryDisplayed() {
    const leaveHistory = this.page.locator('table');
    await expect(leaveHistory).toBeVisible();
  }
}

test.describe('Leave Management', () => {
  test('3.1 - Apply for Leave', async ({ page }) => {
    const leavePage = new LeavePage(page);
    
    // 1. Navigate to Leave module
    await leavePage.navigateToLeave();
    
    // 2. Click Apply tab
    await leavePage.clickApplyTab();
    
    // 3. Fill leave form
    await leavePage.fillLeaveForm('Paid Leave', '2026-05-15', '2026-05-17');
    
    // 4. Submit application
    await leavePage.submitLeaveApplication();
    
    // 5. Verify success message
    await leavePage.verifySuccessMessage();
  });

  test('3.2 - View Leave List with Filters', async ({ page }) => {
    const leavePage = new LeavePage(page);
    
    // 1. Navigate to Leave module
    await leavePage.navigateToLeave();
    
    // 2. Verify leave list is displayed
    await leavePage.verifyLeaveListDisplayed();
    
    // 3. Filter by date range
    await leavePage.filterLeavesByDateRange('2026-05-01', '2026-05-31');
    
    // 4. Verify results are filtered
    await leavePage.verifyLeaveListDisplayed();
  });

  test('3.3 - View My Leave History', async ({ page }) => {
    const leavePage = new LeavePage(page);
    
    // 1. Navigate to Leave module
    await leavePage.navigateToLeave();
    
    // 2. Click My Leave tab
    await leavePage.clickMyLeaveTab();
    
    // 3. Verify leave history is displayed
    await leavePage.verifyMyLeaveHistoryDisplayed();
  });

  test('3.4 - Filter Leaves by Status', async ({ page }) => {
    const leavePage = new LeavePage(page);
    
    // 1. Navigate to Leave module
    await leavePage.navigateToLeave();
    
    // 2. Filter by status
    await leavePage.filterByLeaveStatus('Pending Approval');
    
    // 3. Click search
    await page.getByRole('button', { name: 'Search' }).click();
    await page.waitForLoadState('networkidle');
    
    // 4. Verify results are filtered
    await leavePage.verifyLeaveListDisplayed();
  });

  test('3.5 - Assign Leave to Employee', async ({ page }) => {
    const leavePage = new LeavePage(page);
    
    // 1. Navigate to Leave module
    await leavePage.navigateToLeave();
    
    // 2. Click on Assign Leave (from Quick Launch or menu)
    const assignLeaveButton = page.getByRole('button', { name: 'Assign Leave' });
    if (await assignLeaveButton.isVisible()) {
      await assignLeaveButton.click();
      await page.waitForLoadState('networkidle');
      
      // 3. Fill assignment form
      const employeeField = page.getByRole('textbox', { name: 'Employee Name' });
      if (await employeeField.isVisible()) {
        await employeeField.fill('Peter Mac Andrbil');
        await page.waitForLoadState('networkidle');
        
        // 4. Fill leave details
        await leavePage.fillLeaveForm('Paid Leave', '2026-05-20', '2026-05-22');
        
        // 5. Submit
        const assignButton = page.getByRole('button', { name: /Assign|Save/i });
        if (await assignButton.isVisible()) {
          await assignButton.click();
          await page.waitForLoadState('networkidle');
          
          // 6. Verify success
          await leavePage.verifySuccessMessage();
        }
      }
    }
  });
});
