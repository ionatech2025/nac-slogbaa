# Frontend Design and Brand Notes

## Color scheme and brand reference

The **reference for visual identity and color scheme** is the current SLOGBAA site:

- **URL:** [https://slogbaa.org/](https://slogbaa.org/)
- **Title:** School of Local Governance Budget Advocacy and Accountability (SLOGBAA)

All platform pages (trainee and admin) should **use the same color schemes and visual language** as the current site. The palette below is taken from the slogbaa.org header (NAC / SLOGBAA logos, nav, and “Live Session” button) and is implemented in **`frontend/src/index.css`** as CSS variables.

### Palette (single source of truth)

| Use | Hex | CSS variable |
|-----|-----|--------------|
| Primary orange (NAC, SLOGBAA text, Live Session button) | `#F18625` | `--slogbaa-orange` |
| Primary blue (NETWORK FOR ACTIVE CITIZENS, active nav) | `#2781BF` | `--slogbaa-blue` |
| Green (divider, tagline “Putting Communities Before Self”) | `#51AF38` | `--slogbaa-green` |
| Dark top bar | `#20232B` | `--slogbaa-dark` |
| Background / surface | `#FFFFFF` | `--slogbaa-surface` |
| Body text | `#404040` | `--slogbaa-text` |
| Muted text | — | `--slogbaa-text-muted` |
| White (e.g. button text) | `#FFFFFF` | — |

**Usage:** Use orange for primary CTAs (Sign in, Register submit, Live Session–style buttons); use blue for links and active nav; use the dark bar colour for header/sidebar strips; use green for success or secondary branding where appropriate.

---

## Related

- Frontend structure: [Project structure explained](project-structure-explained.md) §2c.
- Public site content (banners, impact stories, etc.): [STRUCTURE.md](STRUCTURE.md) website module.
