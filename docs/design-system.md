# Круг — UI system and handoff

## UX context

The feed helps a person catch up with friends, publish a moment, and return to something saved. The main decision on the screen is whether to read, react, or write. Keep the composer and feed as the visual center; secondary social context stays in the side rails and moves behind the mobile navigation on narrow screens.

The current app is a local browser demo. It has no network loading state or server-side persistence. If API-backed data is added, use skeleton cards while loading, an inline retry state for feed failures, and retain the empty state for a successful zero-result search. Long copy wraps naturally; post copy is capped at 500 characters and comments at 240.

## Layout and spacing

- Desktop canvas: centered, max-width 1,450 px; 230 px profile/navigation rail, 470–650 px feed, 280 px context rail. Use a 42 px column gap and 28–36 px outer padding.
- At 1,200 px, hide the context rail and center the two remaining columns. At 760 px, use one column, 16 px horizontal padding, and a fixed 66 px bottom tab bar that respects the safe area.
- Base spacing follows a 4 px grid: 4, 8, 12, 16, 24, 32 px. Use 16 px card padding, 24 px between major sections, and 8–12 px inside controls.
- Content order: greeting and date → stories → composer → feed heading and filters → posts. This gives the central feed a clear F-pattern on desktop and a single reading path on mobile.

## Type and visual tokens

The stylesheet groups tokens as global primitives, semantic aliases, and component values in `web/css/design-system.css`.

| Role | Size / line height | Use |
|---|---:|---|
| H1 | 26 / 34 px, 800 | Greeting |
| H2 | 16 / 24 px, 700 | Section and card headings |
| Body | 14 / 22 px, 400 | Post and setting descriptions |
| Label | 12 / 18 px, 600 | Buttons, filters, navigation |
| Caption | 11 / 16 px, 500 | Metadata and helper text |

Use neutral page `#f6f7f9`, white cards, ink `#272933`, secondary text `#626572`, and violet `#6652bd`. Primary buttons use the violet with white text. Dark mode switches the semantic tokens while preserving the same component hierarchy. Text colors are chosen for at least 4.5:1 contrast on their intended surfaces; focus rings use a visible 3 px outline with 3 px offset. Decorative illustration colors are not semantic status indicators.

Cards use a 19 px radius and a soft 3/18 px shadow. Controls use a 12 px radius and a 44 px minimum target. State styling must remain visible without relying on color alone: selected controls change fill/weight, switches move their thumb, and followed/liked buttons update their text or icon.

## Figma component plan

Create a `Krug / Foundations` page for color, typography, spacing, radius, and elevation variables. Use semantic variables (`Text / Primary`, `Text / Secondary`, `Surface / Page`, `Action / Primary`, `Focus / Ring`) with light/dark modes; map component values to those aliases instead of hard-coding color values.

Build components with Auto Layout and Hug content by default. Use variants for `Button` (Primary, Soft, Text; Default, Hover, Pressed, Disabled, Focus), `Navigation item` (Default, Active), `Post action` (Default, Liked, Saved), and `Switch` (Off, On, Focus). Use boolean properties for optional avatar, metadata, post media, and unread indicator. Keep feed cards Fill container width with fixed 16 px internal padding; let copy and action labels Hug height and wrap rather than clip.

## Responsive and accessible handoff

Use CSS Grid for the desktop rails and the single feed column, then collapse at 1,200 px and 760 px. Use Flexbox for card headers, tool rows, and action bars. Preserve semantic `header`, `nav`, `main`, `aside`, `article`, and `button` elements. All icon-only buttons need an accessible name; toggles need a label and `aria-checked`; modals need a labelled heading, focus entry, Escape handling, and a contained keyboard tab loop. Maintain visible focus and support reduced motion. On touch layouts, controls should offer at least 44 × 44 px targets.

Edge states to preserve in handoff: empty search/filter results with a return-to-feed action; disabled publish button until text or an image is present; unsupported/oversized image feedback; local-storage failure toast; long usernames ellipsized in compact rails and full post text wrapped. For a future remote feed, add skeletons and retry UI before connecting API data.
