import test from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { expect } from "@playwright/test";
import { Header } from "../../pages/Header";

test.describe('Header', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('Admin', 'admin123');
        await expect(page).toHaveURL(/dashboard/);
    })

    test('1. Verify Upgrade Button when clicking on it', async ({ page }) => {
        const header = new Header(page);
        
        const [newPage] = await Promise.all([
            page.context().waitForEvent('page'),
            header.clickOnUpgradeButton()
        ]);
        
        await expect(newPage).toHaveURL("https://orangehrm.com/open-source/upgrade-to-advanced");
    })

    test("2. Verify profile picture dropdown when clicking it", async({page}) => {
        const header = new Header(page);
        await header.clickOnProfilePicture();
        await expect(header.aboutButton).toBeVisible();
        await expect(header.supportButton).toBeVisible();
        await expect(header.changePasswordButton).toBeVisible();
        await expect(header.logoutButton).toBeVisible();
    })

    test("3. Verify about button when clicking on it", async({page}) => {
        const header = new Header(page);
        await header.clickOnProfilePicture();
        await header.clickOnAboutButton();
        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
    })

    test("4. Verify support button when clicking on it", async({page}) => {
        const header = new Header(page);
        await header.clickOnProfilePicture();
        await header.clickOnSupportButton();
        await expect(page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/help/support");
    })

    test("5. Verify change password button when clicking on it", async({page}) => {
        const header = new Header(page);
        await header.clickOnProfilePicture();
        await header.clickOnChangePasswordButton();
        await expect(page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/pim/updatePassword");
    })

    test("6. Verify logout button when clicking on it", async({page}) => {
        const header = new Header(page);
        await header.clickOnProfilePicture();
        await header.clickOnLogoutButton();
        await expect(page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    })

    test.afterEach(async ({ page }) => {
        await page.waitForTimeout(2000);
        page.close();
    })
})