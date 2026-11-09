import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const path of ["/", "/cases/thesis.html", "/cases/pegasus.html"]) {
  test("WCAG AA checks: " + path, async ({ page }) => {
    await page.goto(path);
    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const violations = report.violations.map(v => ({
      id: v.id, impact: v.impact,
      elements: v.nodes.map(n => n.target)
    }));
    expect(violations).toEqual([]);
  });
}
