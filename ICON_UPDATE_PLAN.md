# 🎨 SVlentes Icon Update Plan

## 📊 Current Status
- **Total Icons**: 25 files backed up to `public/icones-backup-2025-10-05/`
- **All icons created/modified**: October 4, 2025 (recent)
- **Backup completed**: ✅ Safe to proceed with updates

## 🔥 Priority 1: Active Icons (Currently Used)

These icons are actively displayed in the application and should be updated first:

### EconomySection Icons (`src/components/sections/EconomySection.tsx`)

1. **`calc.png`** (1,329.6 KB)
   - **Usage**: Main calculator icon in economy section
   - **Action**: Check for LAAS branding, update to SVlentes colors
   - **Location**: Line 85-87 in EconomySection.tsx

2. **`atendido.png`** (1,218.8 KB)
   - **Usage**: "5.000+ Clientes satisfeitos" stat
   - **Action**: Ensure consistent with SVlentes brand
   - **Location**: economyStats array

3. **`40percent.png`** (1,260.2 KB)
   - **Usage**: "40% Economia média" stat
   - **Action**: Update percentage display style
   - **Location**: economyStats array

4. **`12h.png`** (1,219.2 KB)
   - **Usage**: "12h Tempo economizado" stat
   - **Action**: Update time display style
   - **Location**: economyStats array

5. **`piggy_bank_with_dollar_coin.png`** (1,149.8 KB)
   - **Usage**: "R$ 800 Economia média anual" stat
   - **Action**: Update colors to match SVlentes brand
   - **Location**: economyStats array

6. **`drphilipe_perfil.jpeg`** (105.4 KB)
   - **Usage**: Dr. Philipe's profile photo (Footer, HowItWorksSection)
   - **Action**: Verify image quality and consistency
   - **Location**: Footer.tsx line 98, HowItWorksSection.tsx line 348

## ⚠️ Priority 2: Potentially Branded Icons

These icons may contain LAAS branding and need immediate review:

1. **`best-plan.png`** (1,225.1 KB)
   - **Risk**: HIGH - Likely contains "LAAS" text
   - **Action**: Replace LAAS with SVlentes branding

2. **`resultado-personalizado.png`** (1,244.3 KB)
   - **Risk**: MEDIUM - May have branded elements
   - **Action**: Check for LAAS references, update to SVlentes

3. **`expertise.png`** (1,224.2 KB)
   - **Risk**: MEDIUM - May contain branded text
   - **Action**: Review and update branding

4. **`transp.png`** (1,213.3 KB)
   - **Risk**: MEDIUM - May have branded elements
   - **Action**: Check for LAAS references

## 📚 Priority 3: Icon Library (Medium Priority)

These icons are defined in `src/lib/icons.ts` but may not be actively used:

- `customer_service_icon.png` (1,085.1 KB)
- `icon_atend24:7.png` (1,203.2 KB)
- `blue_shield_checkmark_icon.png` (1,038.6 KB)
- `colorful_calculator_icon.png` (926.6 KB)
- `flaming_crown_popular_badge.png` (934.5 KB)
- And 8 others...

**Action**: Review for brand consistency after Priority 1 & 2 are complete.

## 🎯 Recommended Update Process

### Step 1: Update Active Icons (Priority 1)
```bash
# Focus on these 6 icons first as they're visible to users
public/icones/calc.png
public/icones/atendido.png
public/icones/40percent.png
public/icones/12h.png
public/icones/piggy_bank_with_dollar_coin.png
public/icones/drphilipe_perfil.jpeg
```

### Step 2: Check Branded Icons (Priority 2)
```bash
# Review these for LAAS branding
public/icones/best-plan.png
public/icones/resultado-personalizado.png
public/icones/expertise.png
public/icones/transp.png
```

### Step 3: Test After Updates
```bash
# Run these commands to test the changes
npm run dev
# Check: http://localhost:3000 - Economy section
# Verify: All icons load correctly
# Confirm: No LAAS branding visible
```

## 🎨 Brand Guidelines for Icon Updates

### Colors to Use (SVlentes Brand)
- **Primary Blue**: #0f4c75 (primary-600)
- **Light Blue**: #38bdf8 (primary-400)
- **Success Green**: #16a34a (success-600)
- **Gray Tones**: #374151 (gray-700), #6b7280 (gray-500)

### Colors to Avoid
- Any colors associated with LAAS branding
- Inconsistent color schemes
- Low contrast combinations

### Style Guidelines
- **Consistent**: All icons should have similar visual weight
- **Clean**: Simple, professional medical/tech aesthetic
- **Accessible**: High contrast for readability
- **Scalable**: Work well at different sizes (48px to 80px)

## 🔧 Tools and Scripts Created

1. **`scripts/analyze-icons.js`** - Analyzes current icon status
2. **`scripts/backup-icons.js`** - Creates backup before updates
3. **`scripts/update-icons-guide.md`** - Detailed update instructions
4. **`ICON_UPDATE_PLAN.md`** - This comprehensive plan

## ✅ Completion Checklist

- [x] Backup created (`public/icones-backup-2025-10-05/`)
- [x] Analysis completed (25 icons identified)
- [x] Priorities established (6 active, 4 branded, 13 library)
- [ ] Update Priority 1 icons (active usage)
- [ ] Update Priority 2 icons (potentially branded)
- [ ] Test application with new icons
- [ ] Update Priority 3 icons (library consistency)
- [ ] Final review and cleanup

## 🚀 Next Steps

1. **Start with calc.png** - Most visible icon in economy section
2. **Update the 4 stat icons** - atendido.png, 40percent.png, 12h.png, piggy_bank_with_dollar_coin.png
3. **Check branded icons** - Look for any LAAS text or branding
4. **Test thoroughly** - Ensure all icons display correctly
5. **Commit changes** - Once satisfied with updates

---

**Note**: All original icons are safely backed up in `public/icones-backup-2025-10-05/` and can be restored if needed.