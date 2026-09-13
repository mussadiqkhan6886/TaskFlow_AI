import test, { expect } from "@playwright/test";
import { login } from "../helpers/login";

test("admin has full users permission", async ({page}) => {

    await login(page, "changed username", "1234")

    await page.goto("/admin/dashboard")

    await page.getByText(/Add New User/i).click()
    const username = `e2eUser${Date.now()}`;
    const email = `e2e${Date.now()}@gmail.com`;
    await page.fill("#username", username)
    await page.fill("#email", email)
    await page.fill("#password", "4321")
    await page.selectOption("#role", "Manager")
    await page.selectOption("#status", "Active")

    await page.getByRole("button", {name: /Create User/i}).click()

    await page.waitForURL("/admin/dashboard/users")

    await expect(page.getByText(username)).toBeVisible()

    await page
        .getByText(username)
        .locator("..")
        .getByRole("link", {name:/Edit/i})
        .click();
    
    await page.waitForURL(/\/admin\/dashboard\/users\/.+/);
    
    await page.fill("#username", "ali khan")
    
    await page.getByRole("button", {name: /Save Changes/i}).click()
    
    await page.waitForURL("/admin/dashboard/users")
    
    await expect(page.getByText("ali khan")).toBeVisible()
    
    await page
        .getByText("ali khan")
        .locator("..")
        .getByRole("button", {name:/Delete/i})
        .click();
    
    await expect(page.getByText("ali khan")).not.toBeVisible()

})
test("manager can edit and create user", async ({page}) => {
    await login(page, "manager", "1234")
    
    await page.goto("/admin/dashboard")

    await page.getByText(/Add New User/i).click()
    const username = `e2eUser${Date.now()}`;
    const email = `e2e${Date.now()}@gmail.com`;
    await page.fill("#username", username)
    await page.fill("#email", email)
    await page.fill("#password", "4321")
    await page.selectOption("#role", "Manager")
    await page.selectOption("#status", "Active")

    await page.getByRole("button", {name: /Create User/i}).click()

    await page.waitForURL("/admin/dashboard/users")

    await expect(page.getByText(username)).toBeVisible()

    await page
        .getByText(username)
        .locator("..")
        .getByRole("link", {name:/Edit/i})
        .click();
    
    await page.waitForURL(/\/admin\/dashboard\/users\/.+/);
    
    await page.fill("#username", "mkimmk")
    
    await page.getByRole("button", {name: /Save Changes/i}).click()
    
    await page.waitForURL("/admin/dashboard/users")
    
    await expect(page.getByText("mkimmk")).toBeVisible()
    
    
})
test("manager cannot delete user", async ({page}) => {
    await login(page, "manager", "1234")

    await page.goto("/admin/dashboard/users")

    await expect(page.getByText(/delete/i)).not.toBeVisible()
    
})

test("employee cannot access user management", async ({page}) => {
    await login(page, "employee", "1234")

    await page.goto("/admin/dashboard/users")

    await expect(page).toHaveURL("/admin/dashboard")
})
