import {test} from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { expect } from "@playwright/test";

test.describe('Login Page', () =>{
  test.beforeEach(async({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.verifyLoginPageDisplayed();
  })
  test('1.1 - Valid Login', async({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('Admin', 'admin123');
    await expect(page).toHaveURL(/dashboard/);
  })
})