import { Locator, Page } from "@playwright/test";

export class Header {
    readonly page: Page;
    
    readonly dashboardHeader: Locator;
    readonly upgradeButton: Locator;
    readonly profilePicture: Locator;
    readonly aboutButton: Locator;
    readonly supportButton: Locator;
    readonly changePasswordButton: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardHeader = page.getByRole('heading', { name: 'Dashboard' });
        this.upgradeButton = page.getByRole('link', { name: 'Upgrade' });
        this.profilePicture = page.locator('.oxd-userdropdown-img')
        this.aboutButton = page.getByRole('menuitem', { name: 'About' })
        this.supportButton = page.getByRole('menuitem', { name: 'Support' })
        this.changePasswordButton = page.getByRole('menuitem', { name: 'Change Password' })
        this.logoutButton = page.getByRole('menuitem', { name: 'Logout' })
    }

    async clickOnProfilePicture() {
        await this.profilePicture.click();
    }
    async clickOnAboutButton() {
        await this.aboutButton.click();
    }
    async clickOnSupportButton() {
        await this.supportButton.click();
    }
    async clickOnChangePasswordButton() {
        await this.changePasswordButton.click();
    }
    async clickOnLogoutButton() {
        await this.logoutButton.click();
    }
    async clickOnUpgradeButton() {
        await this.upgradeButton.click();
    }
}