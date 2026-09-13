import test, { expect } from "@playwright/test";
import { login } from "../helpers/login";

test("employee dashboard only shows TechNotes", async ({page}) => {
    await login(page, "employee", "1234");

    await page.goto("/admin/dashboard");

    await expect(
        page.getByText(/View TechNotes/i)
    ).toBeVisible();

    await expect(
        page.getByText(/Add New Technote/i)
    ).not.toBeVisible();

    await expect(
        page.getByText(/Add New User/i)
    ).not.toBeVisible();
});


test("manager dashboard shows manager options", async ({page}) => {
    await login(page, "manager", "1234");

    await page.goto("/admin/dashboard");

    await expect(
        page.getByText(/View TechNotes/i)
    ).toBeVisible();

    await expect(
        page.getByText(/Add New Technote/i)
    ).toBeVisible();

    await expect(
        page.getByText(/Add New User/i)
    ).toBeVisible();

    await expect(
        page.getByText(/View User Settings/i)
    ).toBeVisible();
});


test("admin dashboard shows admin options", async ({page}) => {
    await login(page, "changed username", "1234");

    await page.goto("/admin/dashboard");
    
    await expect(
        page.getByText(/View TechNotes/i)
    ).toBeVisible();

    await expect(
        page.getByText(/Add New Technote/i)
    ).toBeVisible();

    await expect(
        page.getByText(/Add New User/i)
    ).toBeVisible();

    await expect(
        page.getByText(/View User Settings/i)
    ).toBeVisible();
});