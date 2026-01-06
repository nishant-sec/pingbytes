

Your task is to **design and describe the exact layout behavior** and **provide implementation guidance** for this UI.

### Context from the screenshots

* The page has a **top header**, **sidebar navigation**, **main content**, and a **sticky Table of Contents (TOC)**.
* There is a **section bar** (page/section navigation) visible under the header.

### Requirements (IMPORTANT)

1. The **section bar must behave as part of the header**, not as part of the page content.
2. The **section bar must be attached to the header**, and the **header must be attached to the TOC**, forming a **single stacked unit**:

   ```
   Header
   Section Bar
   Sticky TOC
   ```
3. This stacked unit:

   * Must stay **between the header and the TOC**
   * Must **not scroll with the page content**
   * Must remain **sticky/fixed**
4. On **mobile view**:

   * The entire stack (header → section bar → TOC) must remain **fixed**
   * The page content should scroll **under** this stack
5. The section bar **must not be part of the document body flow** (i.e., not inside the article container).

### Output Required

* A **clear explanation** of how this layout should behave (desktop vs mobile).
* A **recommended DOM structure** (HTML hierarchy).
* **CSS implementation guidance** (e.g., `position: sticky` vs `fixed`, `top` offsets, `z-index`, responsive breakpoints).
* Optional: Tailwind CSS or modern CSS example showing how to implement this behavior.

Do **not** give high-level theory only. Treat this as a **UI implementation task** and respond with practical, actionable guidance.”

