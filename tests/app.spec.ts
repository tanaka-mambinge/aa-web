import { expect, test } from "@playwright/test";

const backendUrl = "http://127.0.0.1:8087/api/v1";

test("user can log in, view approvals, and create a CLI token", async ({ page, request }) => {
  const email = `user-${Date.now()}@example.com`;
  const password = "Password123!";

  const registerResponse = await request.post(`${backendUrl}/auth/register`, {
    data: {
      name: "Playwright User",
      email,
      password,
      device_type: "cli",
    },
  });
  expect(registerResponse.ok()).toBeTruthy();

  const authPayload = await registerResponse.json();
  const bearerToken = authPayload.access_token as string;

  const cliTokenResponse = await request.post(`${backendUrl}/cli-tokens`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
    data: {
      name: "Seeder token",
    },
  });
  expect(cliTokenResponse.ok()).toBeTruthy();
  const cliTokenPayload = await cliTokenResponse.json();

  const approvalResponse = await request.post(`${backendUrl}/approvals`, {
    headers: {
      Authorization: `Bearer ${cliTokenPayload.token as string}`,
    },
    data: {
      action: "domain.root.delete",
      risk: "critical",
      title: "Delete root domain",
      summary: "Delete example.com from registrar",
      extra: {
        domain: "example.com",
        environment: "production",
      },
    },
  });
  expect(approvalResponse.ok()).toBeTruthy();

  await page.goto("/");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText("Approval operations dashboard")).toBeVisible();
  await expect(page.getByText("Delete root domain")).toBeVisible();

  await page.getByRole("button", { name: /Inspect request/i }).click();
  await expect(page.getByRole("dialog").getByText("Delete example.com from registrar")).toBeVisible();
  await page.getByRole("button", { name: /^Approve$/i }).click();
  await expect(page.getByText("approved").first()).toBeVisible();

  await page.getByRole("button", { name: /New token/i }).click();
  await page.getByLabel("Token name").fill("UI token");
  await page.getByRole("button", { name: /Create token/i }).click();
  await expect(page.getByText("Copy this token now. It will not be shown again.")).toBeVisible();
});
