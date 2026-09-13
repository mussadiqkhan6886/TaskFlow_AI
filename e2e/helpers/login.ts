import { Page } from "@playwright/test";


export async function login(
    page: Page,
    username: string,
    password: string
) {

    await page.goto("/login");


    await page.fill(
        "#username",
        username
    );


    await page.fill(
        "#password",
        password
    );


    await page.click(
        'button[type="submit"]'
    );


    await page.waitForURL(
        "/admin/dashboard"
    );
}