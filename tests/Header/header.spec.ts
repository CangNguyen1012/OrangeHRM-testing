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
        await header.clickOnUpgradeButton();
        await expect(page).toHaveURL(/upgrade-to-advanced/);
    })
})