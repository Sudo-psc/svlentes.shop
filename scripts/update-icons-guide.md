# SVlentes Icon Update Guide

## Icons Currently Used in Application

Based on the codebase analysis, these icons are actively being used and should be prioritized for updates:

### 1. Economy Section Icons (`src/components/sections/EconomySection.tsx`)

**Active Icons:**
- `/icones/piggy_bank_with_dollar_coin.png` - Economia média anual
- `/icones/atendido.png` - Clientes satisfeitos  
- `/icones/40percent.png` - Economia média
- `/icones/12h.png` - Tempo economizado
- `/icones/calc.png` - Calculadora de Economia

### 2. Profile Icons
- `/icones/drphilipe_perfil.jpeg` - Dr. Philipe's profile photo (used in Footer and HowItWorksSection)

### 3. Icons Defined in Icon Library (`src/lib/icons.ts`)

**Customer Service:**
- `/icones/customer_service_icon.png`
- `/icones/icon_atend24:7.png`
- `/icones/icon_amoresaude.png`

**Benefits:**
- `/icones/blue_shield_checkmark_icon.png`
- `/icones/diamond_and_star_icon.png`
- `/icones/piggy_bank_with_dollar_coin.png`
- `/icones/colorful_calculator_icon.png`

**Process:**
- `/icones/hand_holding_package_icon.png`
- `/icones/cartoon-character-location-icon.png`

**Medical:**
- `/icones/eye-calendar-icon.png`
- `/icones/eye_check_award_icon.png`

**Badges:**
- `/icones/flaming_crown_popular_badge.png`
- `/icones/ten_year_anniversary_badge.png`

**Profile:**
- `/icones/Pin_icon_menino.png`

## Icons That May Need Updates for SVlentes Rebrand

### High Priority (Currently Used)
1. **calc.png** - Calculator icon for economy section
2. **atendido.png** - Customer service stats
3. **40percent.png** - Savings percentage
4. **12h.png** - Time saved
5. **piggy_bank_with_dollar_coin.png** - Savings icon

### Medium Priority (In Icon Library)
1. **best-plan.png** - May contain LAAS branding
2. **flaming_crown_popular_badge.png** - Popular plan badge
3. **colorful_calculator_icon.png** - Calculator icon
4. **blue_shield_checkmark_icon.png** - Security/trust icon

### Low Priority (Legacy/Unused)
1. **resultado-personalizado.png** - Not currently referenced
2. **expertise.png** - Not currently referenced  
3. **transp.png** - Not currently referenced

## Recommended Actions

### 1. Update Active Icons First
Focus on the icons used in EconomySection as they are visible to users:
- Ensure no LAAS branding is present
- Update color scheme to match SVlentes brand
- Maintain consistent style across all icons

### 2. Review Icon Library
Check all icons in `src/lib/icons.ts` for:
- LAAS text or branding
- Outdated color schemes
- Consistency with new brand

### 3. Clean Up Unused Icons
Consider removing or archiving icons that are not referenced in the codebase:
- resultado-personalizado.png
- expertise.png  
- transp.png

## Icon Update Checklist

- [ ] calc.png - Remove any LAAS branding, update colors
- [ ] atendido.png - Ensure SVlentes branding consistency
- [ ] 40percent.png - Update percentage display style
- [ ] 12h.png - Update time display style
- [ ] piggy_bank_with_dollar_coin.png - Update colors to match brand
- [ ] best-plan.png - Remove LAAS text, add SVlentes branding
- [ ] flaming_crown_popular_badge.png - Update text if any
- [ ] All other icons in icon library - Review for consistency

## Testing After Updates

After updating icons, test these components:
1. EconomySection - Check all stat icons display correctly
2. Footer - Verify Dr. Philipe's photo loads
3. HowItWorksSection - Check profile image
4. Any components using the icon library

## File Locations

- Icons directory: `/public/icones/`
- Icon library: `/src/lib/icons.ts`
- Main usage: `/src/components/sections/EconomySection.tsx`