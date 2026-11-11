import { test, expect } from "@playwright/test";

const slugs = ["thesis", "rag", "insurance", "seq2seq", "pegasus"];
const minimumTabs = { thesis: 4, rag: 3, insurance: 3, seq2seq: 3, pegasus: 3 };

test("Homepage has accessible paths to all five flagship projects", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  for (const slug of slugs) {
    expect(await page.locator('a[href="cases/' + slug + '.html"]').count()).toBeGreaterThanOrEqual(1);
  }
  const scroll = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(scroll).toBeLessThanOrEqual(0);
});

test("Homepage offers direct evidence paths", async ({ page }) => {
  await page.goto("/");
  const index = page.getByRole("navigation", { name: "Start with a project" });
  await expect(index.getByRole("link")).toHaveCount(3);
  for (const slug of ["thesis", "rag", "insurance"]) {
    await expect(index.locator('a[href="cases/' + slug + '.html"]')).toHaveCount(1);
  }
  await expect(index.getByText("6,126 tender documents")).toBeVisible();
});

test("Light and dark themes persist between pages", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-theme-toggle]").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#101010");
  await page.goto("/cases/thesis.html");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator("[data-theme-toggle]").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("Responsive navigation works", async ({ page, isMobile }) => {
  await page.goto("/");
  const trigger = page.locator("[data-mobile-trigger]");
  if (await trigger.isVisible()) {
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("[data-mobile-panel]")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  } else {
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  }
});

for (const slug of slugs) {
  test(slug + ": architecture tabs, nodes, keyboard support and source links", async ({ page }) => {
    await page.goto("/cases/" + slug + ".html");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    const project = page.locator('[data-architecture-project="' + slug + '"]');
    await expect(project).toBeVisible();
    const tabs = project.locator("[data-architecture-tab]");
    await expect(tabs).toHaveCount(minimumTabs[slug]);

    const first = tabs.first();
    await first.focus();
    await first.press("ArrowRight");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");

    await tabs.last().click();
    await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
    const nodes = project.locator(".arch-node");
    expect(await nodes.count()).toBeGreaterThan(3);
    await nodes.last().click();
    await expect(nodes.last()).toHaveAttribute("aria-pressed", "true");
    const detail = project.locator("[data-architecture-detail]");
    await expect(detail.locator("h3")).not.toBeEmpty();
    await expect(detail.locator("a")).toHaveAttribute("href", /github.com\/ShalinVachheta017\//);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });
}

test("Thesis accuracy explorer retains the documented evaluation distinctions", async ({ page }) => {
  await page.goto("/cases/thesis.html");
  const explorer = page.locator("[data-evaluation]");
  await explorer.locator('[data-eval-mode="cv"]').click();
  await expect(explorer.locator("[data-eval-f1]")).toHaveText("Macro F1 0.952");
  await explorer.locator('[data-eval-mode="louo"]').click();
  await expect(explorer.locator("[data-eval-f1]")).toHaveText("Macro F1 0.397");
  await expect(explorer.locator("[data-eval-value]")).toHaveText("44.42%");
  await explorer.locator('[data-eval-mode="user7"]').click();
  await expect(explorer.locator("[data-eval-value]")).toHaveText("36.96%");
  await expect(page.getByText("Inspect the recorded results.")).toBeVisible();
});

test("English and German portfolio routes are complete and hide the roadmap", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a.language-route[href="de/index.html"]')).toBeVisible();
  await expect(page.locator("#learning")).toHaveCount(0);
  await page.locator('a.language-route[href="de/index.html"]').click();
  await expect(page).toHaveURL(/\/de\/index\.html$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await page.locator('a[href="cases/thesis.html"]').first().click();
  await expect(page).toHaveURL(/\/de\/cases\/thesis\.html$/);
  await expect(page.locator("#architektur details")).toHaveCount(5);
  await page.locator("#architektur details").first().locator("summary").click();
  await expect(page.locator("#architektur details").first()).toHaveAttribute("open", "");
  await page.locator('a.language-route[lang="en"]').click();
  await expect(page).toHaveURL(/\/cases\/thesis\.html$/);
});

test("PEGASUS page is reachable from the featured homepage card", async ({ page }) => {
  await page.goto("/");
  await page.locator('a[href="cases/pegasus.html"]').click();
  await expect(page).toHaveURL(/cases\/pegasus\.html$/);
  await expect(page.locator('[data-architecture-project="pegasus"]')).toBeVisible();
});

test("All case-study source images load when they are in view", async ({ page }) => {
  await page.goto("/cases/kubernetes.html");
  await page.locator("#project-visuals").scrollIntoViewIfNeeded();
  const images = page.locator("#project-visuals img");
  await expect(images).toHaveCount(2);
  for (let i = 0; i < 2; i++) {
    await images.nth(i).scrollIntoViewIfNeeded();
    await expect.poll(async () => images.nth(i).evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});
