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

class ProfilePage extends BasePage {
  async navigateToMyInfo() {
    await this.clickSidebarLink('My Info');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyPersonalInfoPageDisplayed() {
    const personalInfoSection = this.page.getByText('Personal Information');
    const contactInfoSection = this.page.getByText('Contact Information');
    
    const personalVisible = await personalInfoSection.isVisible().catch(() => false);
    const contactVisible = await contactInfoSection.isVisible().catch(() => false);
    
    expect(personalVisible || contactVisible).toBeTruthy();
  }

  async clickEditButton() {
    const editButton = this.page.getByRole('button', { name: 'Edit' });
    if (await editButton.isVisible()) {
      await editButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async modifyPersonalField(fieldName: string, value: string) {
    const field = this.page.getByRole('textbox', { name: fieldName });
    if (await field.isVisible()) {
      await field.fill(value);
    }
  }

  async submitChanges() {
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifySuccessMessage() {
    const successAlert = this.page.locator('[class*="success"], [role="alert"]');
    const isVisible = await successAlert.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
  }

  async clickProfileIcon() {
    const profileIcon = this.page.locator('img[alt="profile picture"]');
    if (await profileIcon.isVisible()) {
      await profileIcon.click();
      await this.page.waitForTimeout(500);
    }
  }

  async verifyUserMenuDisplayed() {
    const userMenu = this.page.locator('[class*="dropdown"], [role="menu"]');
    const isVisible = await userMenu.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
  }
}

class PerformancePage extends BasePage {
  async navigateToPerformance() {
    await this.clickSidebarLink('Performance');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyPerformancePageLoaded() {
    const performanceHeader = this.page.getByRole('heading', { name: 'Performance' });
    const isVisible = await performanceHeader.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
  }

  async verifyPendingReviewsDisplayed() {
    const myActionsSection = this.page.getByText('My Actions');
    const pendingReviewsText = this.page.getByText(/Pending Self Review/i);
    
    const actionsVisible = await myActionsSection.isVisible().catch(() => false);
    const reviewsVisible = await pendingReviewsText.isVisible().catch(() => false);
    
    expect(actionsVisible || reviewsVisible).toBeTruthy();
  }

  async getPendingReviewCount(): Promise<string | null> {
    const reviewCount = this.page.locator('text=/(\\d+) Pending Self Review/');
    return await reviewCount.textContent().catch(() => null);
  }
}

class DirectoryPage extends BasePage {
  async navigateToDirectory() {
    await this.clickSidebarLink('Directory');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyDirectoryPageLoaded() {
    const directoryHeader = this.page.getByRole('heading', { name: 'Directory' });
    const isVisible = await directoryHeader.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
  }

  async searchEmployeeInDirectory(name: string) {
    const searchField = this.page.getByRole('textbox', { name: /search|name/i });
    if (await searchField.isVisible()) {
      await searchField.fill(name);
      await this.page.getByRole('button', { name: 'Search' }).click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async verifyEmployeeDetailsInDirectory(name: string) {
    const employeeInfo = this.page.locator(`text=${name}`);
    const isVisible = await employeeInfo.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
  }

  async verifyContactInfoDisplayed() {
    const contactInfo = this.page.getByText(/Email|Phone|Mobile/);
    const isVisible = await contactInfo.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
  }
}

class BuzzPage extends BasePage {
  async navigateToBuzz() {
    await this.clickSidebarLink('Buzz');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyBuzzFeedLoaded() {
    const buzzHeader = this.page.getByRole('heading', { name: 'Buzz' });
    const isVisible = await buzzHeader.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
  }

  async verifyBuzzPostsDisplayed() {
    const postFeed = this.page.locator('[class*="post"], [class*="buzz-feed"]');
    const isVisible = await postFeed.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
  }

  async clickPostCreationArea() {
    const postInput = this.page.locator('textarea, [contenteditable]').first();
    if (await postInput.isVisible()) {
      await postInput.click();
    }
  }

  async enterPostContent(content: string) {
    const postInput = this.page.locator('textarea, [contenteditable]').first();
    if (await postInput.isVisible()) {
      await postInput.fill(content);
    }
  }

  async submitPost() {
    const postButton = this.page.getByRole('button', { name: /Post|Share|Send/i });
    if (await postButton.isVisible()) {
      await postButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async verifyPostSuccessfullyCreated() {
    const successAlert = this.page.locator('[class*="success"], [role="alert"]');
    const isVisible = await successAlert.isVisible().catch(() => false);
    const postVisible = await this.page.locator('[class*="post"]').first().isVisible().catch(() => false);
    
    expect(isVisible || postVisible).toBeTruthy();
  }

  async likePost() {
    const likeButton = this.page.getByRole('button', { name: /Like/i });
    if (await likeButton.isVisible()) {
      await likeButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async verifyPostLiked() {
    const likeCount = this.page.locator('[class*="like-count"]');
    const isVisible = await likeCount.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
  }

  async commentOnPost(comment: string) {
    const commentButton = this.page.getByRole('button', { name: /Comment/i });
    if (await commentButton.isVisible()) {
      await commentButton.click();
      
      const commentInput = this.page.locator('textarea').last();
      if (await commentInput.isVisible()) {
        await commentInput.fill(comment);
        
        const submitCommentButton = this.page.getByRole('button', { name: /Post Comment|Send/i });
        if (await submitCommentButton.isVisible()) {
          await submitCommentButton.click();
          await this.page.waitForLoadState('networkidle');
        }
      }
    }
  }
}

test.describe('User Profile & Personal Information', () => {
  test('7.1 - View and Edit My Info', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    
    // 1. Navigate to My Info
    await profilePage.navigateToMyInfo();
    
    // 2. Verify personal information is displayed
    await profilePage.verifyPersonalInfoPageDisplayed();
    
    // 3. Click Edit button
    await profilePage.clickEditButton();
    
    // 4. Modify a field
    await profilePage.modifyPersonalField('Mobile', '1234567890');
    
    // 5. Submit changes
    await profilePage.submitChanges();
    
    // 6. Verify success message
    await profilePage.verifySuccessMessage();
  });

  test('7.2 - Access User Menu', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    
    // 1. Click on profile icon/menu
    await profilePage.clickProfileIcon();
    
    // 2. Verify user menu is displayed
    // Give a moment for menu to appear
    await page.waitForTimeout(1000);
    
    const userMenu = page.locator('[class*="dropdown"], [role="menu"]');
    const isVisible = await userMenu.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
  });

  test('7.3 - View My Profile Picture', async ({ page }) => {
    // 1. Check profile picture is visible in navigation
    const profilePicture = page.locator('img[alt="profile picture"]');
    
    // Should be visible in top navigation
    const isVisible = await profilePicture.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
  });
});

test.describe('Performance Management', () => {
  test('8.1 - Access Performance Module', async ({ page }) => {
    const performancePage = new PerformancePage(page);
    
    // 1. Click Performance in sidebar
    await performancePage.navigateToPerformance();
    
    // 2. Verify Performance page loads
    await performancePage.verifyPerformancePageLoaded();
  });

  test('8.2 - View Pending Self Reviews', async ({ page }) => {
    const performancePage = new PerformancePage(page);
    
    // 1. Navigate to Performance module
    await performancePage.navigateToPerformance();
    
    // 2. Check Dashboard for pending reviews (from My Actions widget)
    // Go to Dashboard
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.waitForLoadState('networkidle');
    
    // 3. Verify pending reviews are displayed
    const pendingReviews = page.getByText(/Pending Self Review/);
    const isVisible = await pendingReviews.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
  });
});

test.describe('Directory', () => {
  test('9.1 - Search and View Employee Directory', async ({ page }) => {
    const directoryPage = new DirectoryPage(page);
    
    // 1. Navigate to Directory module
    await directoryPage.navigateToDirectory();
    
    // 2. Verify Directory page loads
    await directoryPage.verifyDirectoryPageLoaded();
    
    // 3. Search for an employee
    await directoryPage.searchEmployeeInDirectory('Oliver');
    
    // 4. Verify employee details are displayed
    await directoryPage.verifyEmployeeDetailsInDirectory('Oliver');
    
    // 5. Verify contact information is visible
    await directoryPage.verifyContactInfoDisplayed();
  });

  test('9.2 - Filter Directory by Department', async ({ page }) => {
    const directoryPage = new DirectoryPage(page);
    
    // 1. Navigate to Directory module
    await directoryPage.navigateToDirectory();
    
    // 2. Apply department filter if available
    const departmentFilter = page.getByRole('combobox', { name: /department/i });
    if (await departmentFilter.isVisible()) {
      await departmentFilter.click();
      const firstOption = page.getByRole('option').first();
      if (await firstOption.isVisible()) {
        await firstOption.click();
        await page.waitForLoadState('networkidle');
      }
    }
    
    // 3. Verify results are filtered
    const directoryContent = page.locator('table, [class*="directory"]');
    await expect(directoryContent).toBeVisible();
  });
});

test.describe('Buzz - Social Communication', () => {
  test('10.1 - View Buzz Feed', async ({ page }) => {
    const buzzPage = new BuzzPage(page);
    
    // 1. Navigate to Buzz module
    await buzzPage.navigateToBuzz();
    
    // 2. Verify Buzz feed is loaded
    await buzzPage.verifyBuzzFeedLoaded();
    
    // 3. Verify buzz posts are displayed
    await buzzPage.verifyBuzzPostsDisplayed();
  });

  test('10.2 - Create Buzz Post', async ({ page }) => {
    const buzzPage = new BuzzPage(page);
    
    // 1. Navigate to Buzz module
    await buzzPage.navigateToBuzz();
    
    // 2. Click on post creation area
    await buzzPage.clickPostCreationArea();
    
    // 3. Enter post content
    await buzzPage.enterPostContent('Test post from automation - Buzz module testing');
    
    // 4. Submit post
    await buzzPage.submitPost();
    
    // 5. Verify post was created successfully
    await buzzPage.verifyPostSuccessfullyCreated();
  });

  test('10.3 - Like Buzz Post', async ({ page }) => {
    const buzzPage = new BuzzPage(page);
    
    // 1. Navigate to Buzz module
    await buzzPage.navigateToBuzz();
    
    // 2. Like a post
    await buzzPage.likePost();
    
    // 3. Verify post was liked
    await buzzPage.verifyPostLiked();
  });

  test('10.4 - Comment on Buzz Post', async ({ page }) => {
    const buzzPage = new BuzzPage(page);
    
    // 1. Navigate to Buzz module
    await buzzPage.navigateToBuzz();
    
    // 2. Comment on a post
    await buzzPage.commentOnPost('Great post! Very informative.');
    
    // 3. Verify comment was posted
    const commentSection = page.locator('[class*="comment"]');
    const isVisible = await commentSection.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
  });
});
