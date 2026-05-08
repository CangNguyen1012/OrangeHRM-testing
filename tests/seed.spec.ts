import { test, expect } from "@playwright/test"

test.describe("Test group", () => {
    test("seed", async ({ page }) => {
        // generate code here.
        await page.goto(
            "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
        )
        await page.getByRole("textbox", { name: "Username" }).click()
        await page.getByRole("textbox", { name: "Username" }).fill("Admin")
        await page.getByRole("textbox", { name: "Password" }).click()
        await page.getByRole("textbox", { name: "Password" }).fill("admin123")
        await page.getByRole("button", { name: "Login" }).click()
        await page.waitForLoadState("networkidle")
    })
})
