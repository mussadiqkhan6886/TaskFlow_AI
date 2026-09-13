import test, { expect } from "@playwright/test";
import { login } from "../helpers/login";

test("employee only sees assigned notes", async ({page}) => {

    await login(page, "employee", "1234")

    await page.goto("/admin/dashboard/notes")
    
    await expect(
        page.getByRole("heading", {
            name: "Employee Note"
        })
    ).toBeVisible();

    await expect(
        page.getByRole("heading", {
            name: "Manager Note"
        })
    ).not.toBeVisible();
});


test("employee cannot delete note", async ({page})=>{
    
    await login(page, "employee", "1234")
    await page.goto("/admin/dashboard/notes")
    
    await expect(page.getByRole("button", {name: "Delete"})).not.toBeVisible()
});


test("manager can create and edit notes", async ({page})=>{
    await login(page, "manager", "1234")
    
    await page.goto("/admin/dashboard")

    await page.getByText(/Add New Technote/i).click()

    await page.selectOption("#noteFor", "employee")
    await page.fill("#title", "basit note")
    await page.fill("#description", "this is description")
    await page.selectOption("#priority", "Medium")

    await page.getByRole("button", {name: /Create Note/i}).click()

    await page.waitForURL("/admin/dashboard/notes")

    await expect(
        page.getByRole("heading", { name: "basit note" }).first()
    ).toBeVisible();

    const noteCard = page
        .getByTestId("note-card")
        .filter({
            has: page.getByRole("heading", { name: "basit note" }),
        });

        await noteCard.getByRole("link", { name: "Edit" }).click();

    await page.waitForURL(/\/admin\/dashboard\/notes\/.+/);
    
    
    await page.fill("#title", "mussadiq note")
    
    await page.getByRole("button", {name: /Save Note/i}).click()
    
    await page.waitForURL("/admin/dashboard/notes")
    
    await expect(page.getByText("mussadiq note")).toBeVisible()

});

test("admin has full note permissions", async ({page})=>{

    await login(page, "changed username", "1234")

    await page.goto("/admin/dashboard")

    await page.getByText(/Add New Technote/i).click()

    await page.selectOption("#noteFor", "manager")
    await page.fill("#title", "title note")
    await page.fill("#description", "title note description")
    await page.selectOption("#priority", "Medium")

    await page.getByRole("button", {name: /Create Note/i}).click()

    await page.waitForURL("/admin/dashboard/notes")

    await expect(
        page.getByRole("heading", { name: "title note" }).first()
    ).toBeVisible();

    await page
        .getByText("title note")
        .locator("..")
        .getByRole("link", {name:/Edit/i})
        .click();

    await page.waitForURL(/\/admin\/dashboard\/notes\/.+/);
    
    
    await page.fill("#title", "Employee Testing Note")
    
    await page.getByRole("button", {name: /Save Note/i}).click()
    
    await page.waitForURL("/admin/dashboard/notes")
    
    await expect(page.getByText("Employee Testing Note")).toBeVisible()
    
    const noteCard = page
        .getByTestId("note-card")
        .filter({
            has: page.getByRole("heading", {
                name: "Employee Testing Note"
            })
        });


    await noteCard
        .getByRole("button", {
            name: "Delete"
        })
        .click();


    await expect(noteCard).not.toBeVisible();

});