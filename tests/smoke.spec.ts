import { expect, test } from "@playwright/test"

test.describe("Interview Handbooks smoke flow", () => {
  test("persists card progress and bookmarks across reload and supports revisit, backup, and reset", async ({
    page,
  }) => {
    test.setTimeout(60_000)
    await page.goto("/#/python")

    await expect(
      page.getByRole("heading", { name: "Python Interview Handbook" })
    ).toBeVisible()

    // Open the Most Asked question card ("Is Python compiled or interpreted?")
    await page
      .getByRole("link", {
        name: /Is Python compiled or interpreted\?/i,
      })
      .first()
      .click()

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Is Python compiled or interpreted?",
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
        name: "Is Python compiled or interpreted?",
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
        name: /Remove bookmark for Is Python compiled or interpreted/i,
      })
      .click()
    await expect(page.getByText(/No bookmarks yet\./i)).toBeVisible()

    // Mark a second card as Revisit and check Revisit list on Progress view
    await page.goto("/#/python/t/python.operators-and-decisions.equals-vs-is")
    await page
      .locator('[data-slot="status-toggle"]')
      .getByRole("button", { name: /^Revisit/i })
      .click()

    await page.goto("/#/python/progress")
    await expect(page.getByText(/1 known · 1 revisit/i)).toBeVisible()
    await expect(
      page.getByRole("button", {
        name: /Mark What is the difference between == and is\? as known/i,
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
    await searchInput.fill("identical copies of a book")
    const targetResult = page
      .getByRole("dialog")
      .getByText(/What is the difference between == and is\?/i)
      .first()
    await expect(targetResult).toBeVisible()
    await targetResult.click()

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /What is the difference between == and is\?/i,
      })
    ).toBeVisible()

    // Open chapter with active filters and reset filters via Command Palette action
    await page.goto("/#/python/c/getting-started?mostAsked=1")
    await expect(
      page.locator("main").getByText("4/18", { exact: true })
    ).toBeVisible()
    await expect(
      page.locator("main").getByRole("button", { name: /^Reset$/i })
    ).toBeVisible()

    await page.keyboard.press("Control+k")
    await expect(searchInput).toBeVisible()
    await searchInput.fill("Reset filters")
    const resetAction = page
      .getByRole("dialog")
      .getByText(/Reset filters/i)
      .first()
    await expect(resetAction).toBeVisible()
    await resetAction.click()

    await expect(
      page.locator("main").getByText("18/18", { exact: true })
    ).toBeVisible()
    await expect(
      page.locator("main").getByRole("button", { name: /^Reset$/i })
    ).toBeHidden()
  })

  test("omits UI Kit and Flashcards and runs printable revision view", async ({
    page,
  }) => {
    await page.goto("/#/python")
    const sidebar = page.locator("#handbook-sidebar")
    await expect(sidebar.getByText("UI Kit")).toHaveCount(0)
    await expect(sidebar.getByText("Flashcards")).toHaveCount(0)

    // Removed flashcards route falls back cleanly to NotFound
    await page.goto("/#/python/flashcards")
    await expect(
      page.getByRole("heading", { name: /Page not found/i })
    ).toBeVisible()

    // Verify Quick Revision view filter toggle and @media print chrome hiding
    await page.goto("/#/python/revision")
    await expect(
      page.getByRole("heading", { name: /Python Cheatsheet/i })
    ).toBeVisible()
    const summaryText = page.getByText(/key takeaways across \d+ cards?/i)
    await expect(summaryText).toBeVisible()
    const beforeSummary = await summaryText.innerText()

    const mostAskedBtn = page.getByRole("button", { name: /Most asked only/i })
    await mostAskedBtn.click()
    await expect(mostAskedBtn).toHaveAttribute("aria-pressed", "true")
    await expect(summaryText).not.toHaveText(beforeSummary)

    await page.emulateMedia({ media: "print" })
    await expect(page.locator('[data-slot="topbar"]')).toBeHidden()
    await expect(page.locator('[data-print-hide="true"]')).toBeHidden()
    await page.emulateMedia({ media: "screen" })
  })

  test("supports keyboard shortcuts for Next (ArrowRight/N), Prev (ArrowLeft/P), and Back to chapter (B) with legible kbd badges", async ({
    page,
  }) => {
    await page.goto(
      "/#/python/t/python.getting-started.is-python-compiled-or-interpreted"
    )

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Is Python compiled or interpreted?",
      })
    ).toBeVisible()

    // Ensure Reveal button displays legible Space Kbd badge (not blank)
    await expect(
      page.getByRole("button", { name: /Reveal answer Space/i })
    ).toBeVisible()

    // ArrowLeft moves to Previous card
    await page.keyboard.press("ArrowLeft")
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Chapter challenge: interactive two-question reply",
      })
    ).toBeVisible()

    // ArrowRight returns to Next card
    await page.keyboard.press("ArrowRight")
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Is Python compiled or interpreted?",
      })
    ).toBeVisible()

    // P moves to Previous card and N returns to Next card
    await page.keyboard.press("p")
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Chapter challenge: interactive two-question reply",
      })
    ).toBeVisible()

    await page.keyboard.press("n")
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Is Python compiled or interpreted?",
      })
    ).toBeVisible()

    // B goes Back to the parent chapter
    await page.keyboard.press("b")
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Getting Started",
      })
    ).toBeVisible()
  })

  test("opens Keyboard shortcuts dialog from navbar button and ? shortcut", async ({
    page,
  }) => {
    await page.goto("/#/python")

    const shortcutsBtn = page.getByRole("button", {
      name: /Keyboard shortcuts \(\?\)/i,
    })
    await expect(shortcutsBtn).toBeVisible()
    await shortcutsBtn.click()

    const dialog = page.getByRole("dialog", { name: /Keyboard shortcuts/i })
    await expect(dialog).toBeVisible()
    await expect(
      dialog.getByText("Global & navigation", { exact: true })
    ).toBeVisible()
    await expect(dialog.getByText("Card reader", { exact: true })).toBeVisible()
    await expect(
      dialog.getByText("Back to chapter", { exact: true })
    ).toBeVisible()
    await expect(
      dialog.getByText("Previous card", { exact: true })
    ).toBeVisible()
    await expect(dialog.getByText("Next card", { exact: true })).toBeVisible()

    // Escape closes dialog, ? reopens it
    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()

    await page.keyboard.press("?")
    await expect(dialog).toBeVisible()
  })
})
