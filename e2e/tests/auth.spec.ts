import test, { expect } from "@playwright/test";

test("users can login successfully", async ({page}) => {

    await page.goto("/login")

    await page.fill(
        "#username",
        "admin"
    )

    await page.fill(
        "#password",
        "1234"
    )

    await page.click(
        "button[type='submit']"
    )

    await expect(page)
        .toHaveURL("/admin/dashboard");

})

test("can not navigate to admin page without valid token", async ({page}) => {

    await page.goto("/admin/dashboard")

    await expect(page)
        .toHaveURL("/login");
})

test("invalid login shows error ", async ({page}) => {

    await page.goto("/login")

    await page.fill("#username", "wrong")
    await page.fill("#password", "wrong")

    await page.click("button[type='submit']")

   await expect(
        page.getByRole("main").getByText(/No username found/i)
    ).toBeVisible();
})

test("user can logout successfully", async ({page}) => {

    await page.goto("/login");

    await page.fill("#username", "admin");
    await page.fill("#password", "1234");

    await page.click("button[type='submit']");


    await expect(page)
        .toHaveURL("/admin/dashboard");


    await page.getByTestId("logout").click()

     await expect(page)
        .toHaveURL("/login");
})

