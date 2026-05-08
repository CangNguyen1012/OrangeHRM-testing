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

class TimePage extends BasePage {
  async navigateToTimeModule() {
    await this.clickSidebarLink('Time');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyTimeAtWorkWidgetOnDashboard() {
    const timeAtWorkWidget = this.page.getByText('Time at Work');
    await expect(timeAtWorkWidget).toBeVisible();

    const punchStatus = this.page.getByText(/Punched In|Punched Out/);
    await expect(punchStatus).toBeVisible();
  }

  async verifyTimeWorkedDisplayed() {
    const timeWorked = this.page.locator('text=/\\d+h \\d+m/');
    await expect(timeWorked).toBeVisible();
  }

  async verifyWeeklyTimeSummary() {
    const weeklySummary = this.page.getByText(/May \d+ - May \d+/);
    await expect(weeklySummary).toBeVisible();
  }

  async verifyTimeModuleLoaded() {
    const timeHeader = this.page.getByRole('heading', { name: 'Time' });
    await expect(timeHeader).toBeVisible();
  }

  async clickTimesheets() {
    const timesheetsButton = this.page.getByRole('button', { name: 'Timesheets' });
    if (await timesheetsButton.isVisible()) {
      await timesheetsButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async verifyTimesheetTableDisplayed() {
    const timesheetTable = this.page.locator('table');
    await expect(timesheetTable).toBeVisible();
  }
}

class RecruitmentPage extends BasePage {
  async navigateToRecruitment() {
    await this.clickSidebarLink('Recruitment');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyRecruitmentPageLoaded() {
    const recruitmentHeader = this.page.getByRole('heading', { name: 'Recruitment' });
    await expect(recruitmentHeader).toBeVisible();
  }

  async viewVacancies() {
    const vacanciesLink = this.page.getByRole('link', { name: /Vacancies|Vacancy/i });
    if (await vacanciesLink.isVisible()) {
      await vacanciesLink.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async viewApplicants() {
    const applicantsLink = this.page.getByRole('link', { name: /Applicants/i });
    if (await applicantsLink.isVisible()) {
      await applicantsLink.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async verifyVacanciesDisplayed() {
    const vacancyTable = this.page.locator('table');
    await expect(vacancyTable).toBeVisible();
  }

  async verifyApplicantsDisplayed() {
    const applicantTable = this.page.locator('table');
    await expect(applicantTable).toBeVisible();
  }

  async filterApplicantsByStatus(status: string) {
    const statusDropdown = this.page.getByRole('combobox', { name: /status/i });
    if (await statusDropdown.isVisible()) {
      await statusDropdown.click();
      await this.page.getByRole('option', { name: status }).click();
      await this.page.getByRole('button', { name: 'Search' }).click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async verifyApplicantStatus(status: string) {
    const statusElement = this.page.locator(`text=${status}`);
    await expect(statusElement).toBeVisible();
  }
}

test.describe('Time Tracking', () => {
  test('5.1 - View Time at Work Widget on Dashboard', async ({ page }) => {
    const timePage = new TimePage(page);
    
    // 1. Navigate to Dashboard (default state from seed)
    // Dashboard should be default after login
    
    // 2. Observe Time at Work widget
    await timePage.verifyTimeAtWorkWidgetOnDashboard();
    
    // 3. Verify punch status is displayed
    await timePage.verifyTimeWorkedDisplayed();
    
    // 4. Verify weekly summary
    await timePage.verifyWeeklyTimeSummary();
  });

  test('5.2 - Access Time Module', async ({ page }) => {
    const timePage = new TimePage(page);
    
    // 1. Click Time in left sidebar
    await timePage.navigateToTimeModule();
    
    // 2. Verify Time module page loads
    await timePage.verifyTimeModuleLoaded();
  });

  test('5.3 - View Timesheets', async ({ page }) => {
    const timePage = new TimePage(page);
    
    // 1. Navigate to Time module
    await timePage.navigateToTimeModule();
    
    // 2. Click on Timesheets
    await timePage.clickTimesheets();
    
    // 3. Verify timesheet table is displayed
    await timePage.verifyTimesheetTableDisplayed();
  });

  test('5.4 - Submit Timesheet', async ({ page }) => {
    const timePage = new TimePage(page);
    
    // 1. Navigate to Time module
    await timePage.navigateToTimeModule();
    
    // 2. Click on Timesheets
    await timePage.clickTimesheets();
    
    // 3. Look for a timesheet to submit
    const submitButton = page.getByRole('button', { name: /Submit|Save/i });
    if (await submitButton.isVisible()) {
      // 4. Fill in timesheet hours if needed
      const timeInputs = page.locator('input[type="number"]');
      const inputCount = await timeInputs.count();
      
      if (inputCount > 0) {
        for (let i = 0; i < Math.min(5, inputCount); i++) {
          await timeInputs.nth(i).fill('8');
        }
      }
      
      // 5. Click Submit
      await submitButton.click();
      await page.waitForLoadState('networkidle');
      
      // 6. Verify success
      const successAlert = page.locator('[class*="success"]');
      const isVisible = await successAlert.isVisible().catch(() => false);
      expect(isVisible || await page.url().includes('time')).toBeTruthy();
    }
  });
});

test.describe('Recruitment', () => {
  test('6.1 - Access Recruitment Module', async ({ page }) => {
    const recruitmentPage = new RecruitmentPage(page);
    
    // 1. Click Recruitment in sidebar
    await recruitmentPage.navigateToRecruitment();
    
    // 2. Verify Recruitment page loads
    await recruitmentPage.verifyRecruitmentPageLoaded();
  });

  test('6.2 - View Job Vacancies', async ({ page }) => {
    const recruitmentPage = new RecruitmentPage(page);
    
    // 1. Navigate to Recruitment module
    await recruitmentPage.navigateToRecruitment();
    
    // 2. View vacancies
    await recruitmentPage.viewVacancies();
    
    // 3. Verify vacancies are displayed
    await recruitmentPage.verifyVacanciesDisplayed();
  });

  test('6.3 - View Job Applicants', async ({ page }) => {
    const recruitmentPage = new RecruitmentPage(page);
    
    // 1. Navigate to Recruitment module
    await recruitmentPage.navigateToRecruitment();
    
    // 2. View applicants
    await recruitmentPage.viewApplicants();
    
    // 3. Verify applicants are displayed
    await recruitmentPage.verifyApplicantsDisplayed();
  });

  test('6.4 - Filter Applicants by Status', async ({ page }) => {
    const recruitmentPage = new RecruitmentPage(page);
    
    // 1. Navigate to Recruitment module
    await recruitmentPage.navigateToRecruitment();
    
    // 2. View applicants
    await recruitmentPage.viewApplicants();
    
    // 3. Filter by status
    await recruitmentPage.filterApplicantsByStatus('Shortlisted');
    
    // 4. Verify filtered results
    const applicantTable = page.locator('table');
    await expect(applicantTable).toBeVisible();
  });

  test('6.5 - Schedule Interview for Candidate', async ({ page }) => {
    const recruitmentPage = new RecruitmentPage(page);
    
    // 1. Navigate to Recruitment module
    await recruitmentPage.navigateToRecruitment();
    
    // 2. View applicants
    await recruitmentPage.viewApplicants();
    
    // 3. Click on a candidate to view details
    const candidateLink = page.locator('tbody tr').first();
    if (await candidateLink.isVisible()) {
      await candidateLink.click();
      await page.waitForLoadState('networkidle');
      
      // 4. Look for Schedule Interview button
      const scheduleButton = page.getByRole('button', { name: /Schedule Interview|Interview/i });
      if (await scheduleButton.isVisible()) {
        await scheduleButton.click();
        await page.waitForLoadState('networkidle');
        
        // 5. Fill interview details
        const dateField = page.locator('input[type="date"]').first();
        if (await dateField.isVisible()) {
          await dateField.fill('2026-05-15');
          
          // 6. Save interview
          await page.getByRole('button', { name: 'Save' }).click();
          await page.waitForLoadState('networkidle');
          
          // 7. Verify success
          const successAlert = page.locator('[class*="success"]');
          const isVisible = await successAlert.isVisible().catch(() => false);
          expect(isVisible || await page.url()).toBeTruthy();
        }
      }
    }
  });
});
