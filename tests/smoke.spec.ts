import { expect, test } from "@playwright/test"

test.describe("Interview Handbooks smoke flow", () => {
  test("persists card progress and bookmarks across reload and supports revisit, backup, and reset", async ({
    page,
  }) => {
    await page.goto("/#/python")

    await expect(
      page.getByRole("heading", { name: "Python Interview Handbook" })
    ).toBeVisible()

    // Open the first card ("Mutable vs immutable: why does it matter?")
    await page
      .getByRole("link", {
        name: /Mutable vs immutable: why does it matter\?/i,
      })
      .first()
      .click()

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Mutable vs immutable: why does it matter?",
      })
    ).toBeVisible()

    // Reveal answer (session-only)
    await page.getByRole("button", { name: /Reveal answer/i }).click()
    await expect(page.getByRole("button", { name: /^Hide$/i })).toBeVisible()

    // Mark as Known and Bookmark
    const statusGroup = page.locator('[data-slot="status-toggle"]')
    const knownButton = statusGroup.getByRole("button", { name: /^Known/i })
    await knownButton.click()
    await expect(knownButton).toHaveAttribute("aria-pressed", "true")

    const bookmarkButton = page.getByRole("button", {
      name: /Bookmark card/i,
    })
    await bookmarkButton.click()
    await expect(
      page.getByRole("button", { name: /Remove bookmark/i })
    ).toHaveAttribute("aria-pressed", "true")

    // Reload and verify status + bookmark persist while answer reveal resets
    await page.reload()
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Mutable vs immutable: why does it matter?",
      })
    ).toBeVisible()
    await expect(
      page
        .locator('[data-slot="status-toggle"]')
        .getByRole("button", { name: /^Known/i })
    ).toHaveAttribute("aria-pressed", "true")
    await expect(
      page.getByRole("button", { name: /Remove bookmark/i })
    ).toHaveAttribute("aria-pressed", "true")
    await expect(
      page.getByRole("button", { name: /Reveal answer/i })
    ).toBeVisible()

    // Verify Bookmarks view lists card and allows unbookmarking
    await page.goto("/#/python/bookmarks")
    await expect(page.getByText(/1 saved card in Python/i)).toBeVisible()
    await page
      .getByRole("button", {
        name: /Remove bookmark for Mutable vs immutable/i,
      })
      .click()
    await expect(page.getByText(/No bookmarks yet\./i)).toBeVisible()

    // Mark a second card as Revisit and check Revisit list on Progress view
    await page.goto("/#/python/t/python.basics.is-vs-equals")
    await page
      .locator('[data-slot="status-toggle"]')
      .getByRole("button", { name: /^Revisit/i })
      .click()

    await page.goto("/#/python/progress")
    await expect(page.getByText(/1 known · 1 revisit/i)).toBeVisible()
    await expect(
      page.getByRole("button", {
        name: /Mark `is` vs `==` on lists and aliases as known|Mark is vs == on lists and aliases as known/i,
      })
    ).toBeVisible()

    // Export JSON backup before reset
    const downloadPromise = page.waitForEvent("download")
    await page.getByRole("button", { name: /Export JSON/i }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe("python-progress.json")
    const downloadPath = await download.path()
    expect(downloadPath).not.toBeNull()

    // Reset with confirmation dialog
    await page.getByRole("button", { name: /Reset progress/i }).click()
    await expect(
      page.getByRole("heading", { name: /Reset all study progress\?/i })
    ).toBeVisible()
    await page.getByRole("button", { name: /Reset everything/i }).click()
    await expect(page.getByText(/0 known · 0 revisit/i)).toBeVisible()

    // Import the backup file with confirmation dialog
    await page
      .locator('input[type="file"][aria-label="Import progress JSON file"]')
      .setInputFiles(downloadPath!)
    await expect(
      page.getByRole("heading", { name: /Replace progress from backup\?/i })
    ).toBeVisible()
    await page.getByRole("button", { name: /Import & replace/i }).click()
    await expect(page.getByText(/1 known · 1 revisit/i)).toBeVisible()
  })

  test("opens command palette via Mod+K, searches body/title matches, and resets filters", async ({
    page,
  }) => {
    await page.goto("/#/python")
    await expect(
      page.getByRole("heading", { name: "Python Interview Handbook" })
    ).toBeVisible()

    // Open command palette with Control+k
    await page.keyboard.press("Control+k")
    const searchInput = page.getByPlaceholder(
      "Search cards, tags, chapters, or actions..."
    )
    await expect(searchInput).toBeVisible()

    // Body search match highlights and navigates to card
    await searchInput.fill("singletons")
    await expect(
      page.getByText(/is vs == on lists and aliases/i).first()
    ).toBeVisible()
    await searchInput.press("Enter")

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /is vs == on lists and aliases/i,
      })
    ).toBeVisible()

    // Open chapter with active filters and reset filters via Command Palette action
    await page.goto("/#/python/c/basics?mostAsked=1")
    await expect(
      page.locator("main").getByText("1/2", { exact: true })
    ).toBeVisible()
    await expect(
      page.locator("main").getByRole("button", { name: /^Reset$/i })
    ).toBeVisible()

    await page.keyboard.press("Control+k")
    await expect(searchInput).toBeVisible()
    await searchInput.fill("Reset filters")
    await expect(page.getByText(/Reset filters/i).first()).toBeVisible()
    await searchInput.press("Enter")

    await expect(
      page.locator("main").getByText("2/2", { exact: true })
    ).toBeVisible()
    await expect(
      page.locator("main").getByRole("button", { name: /^Reset$/i })
    ).toBeHidden()
  })
})
