#!/usr/bin/env node

/**
 * SVlentes Icon Analysis Script
 * Analyzes icons in /public/icones/ directory to help identify which ones need updating
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '../public/icones');

// Icons currently used in the application (high priority)
const ACTIVE_ICONS = [
    'calc.png',
    'atendido.png',
    '40percent.png',
    '12h.png',
    'piggy_bank_with_dollar_coin.png',
    'drphilipe_perfil.jpeg'
];

// Icons defined in icon library (medium priority)
const LIBRARY_ICONS = [
    'customer_service_icon.png',
    'icon_atend24:7.png',
    'icon_amoresaude.png',
    'blue_shield_checkmark_icon.png',
    'diamond_and_star_icon.png',
    'colorful_calculator_icon.png',
    'hand_holding_package_icon.png',
    'cartoon-character-location-icon.png',
    'eye-calendar-icon.png',
    'eye_check_award_icon.png',
    'flaming_crown_popular_badge.png',
    'ten_year_anniversary_badge.png',
    'Pin_icon_menino.png'
];

// Icons that might contain LAAS branding
const POTENTIALLY_BRANDED = [
    'best-plan.png',
    'resultado-personalizado.png',
    'expertise.png',
    'transp.png'
];

function analyzeIcons() {
    console.log('🔍 SVlentes Icon Analysis\n');

    if (!fs.existsSync(ICONS_DIR)) {
        console.error('❌ Icons directory not found:', ICONS_DIR);
        return;
    }

    const files = fs.readdirSync(ICONS_DIR);
    const iconFiles = files.filter(file =>
        file.toLowerCase().match(/\.(png|jpg|jpeg|svg|webp)$/i)
    );

    console.log(`📁 Found ${iconFiles.length} icon files in ${ICONS_DIR}\n`);

    // Analyze active icons (highest priority)
    console.log('🔥 HIGH PRIORITY - Active Icons (Currently Used):');
    console.log('='.repeat(60));

    ACTIVE_ICONS.forEach(iconName => {
        const iconPath = path.join(ICONS_DIR, iconName);
        if (fs.existsSync(iconPath)) {
            const stats = fs.statSync(iconPath);
            const sizeKB = (stats.size / 1024).toFixed(1);
            const modified = stats.mtime.toLocaleDateString();

            console.log(`✅ ${iconName}`);
            console.log(`   Size: ${sizeKB} KB | Modified: ${modified}`);
            console.log(`   Status: NEEDS REVIEW for SVlentes branding\n`);
        } else {
            console.log(`❌ ${iconName} - FILE NOT FOUND\n`);
        }
    });

    // Analyze library icons (medium priority)
    console.log('📚 MEDIUM PRIORITY - Icon Library:');
    console.log('='.repeat(60));

    LIBRARY_ICONS.forEach(iconName => {
        const iconPath = path.join(ICONS_DIR, iconName);
        if (fs.existsSync(iconPath)) {
            const stats = fs.statSync(iconPath);
            const sizeKB = (stats.size / 1024).toFixed(1);
            const modified = stats.mtime.toLocaleDateString();

            console.log(`📋 ${iconName}`);
            console.log(`   Size: ${sizeKB} KB | Modified: ${modified}`);
            console.log(`   Status: Review for consistency\n`);
        } else {
            console.log(`❌ ${iconName} - FILE NOT FOUND\n`);
        }
    });

    // Analyze potentially branded icons
    console.log('⚠️  POTENTIALLY BRANDED - May Contain LAAS References:');
    console.log('='.repeat(60));

    POTENTIALLY_BRANDED.forEach(iconName => {
        const iconPath = path.join(ICONS_DIR, iconName);
        if (fs.existsSync(iconPath)) {
            const stats = fs.statSync(iconPath);
            const sizeKB = (stats.size / 1024).toFixed(1);
            const modified = stats.mtime.toLocaleDateString();

            console.log(`⚠️  ${iconName}`);
            console.log(`   Size: ${sizeKB} KB | Modified: ${modified}`);
            console.log(`   Status: CHECK FOR LAAS BRANDING - UPDATE TO SVLENTES\n`);
        } else {
            console.log(`❌ ${iconName} - FILE NOT FOUND\n`);
        }
    });

    // List all other icons
    const categorizedIcons = [...ACTIVE_ICONS, ...LIBRARY_ICONS, ...POTENTIALLY_BRANDED];
    const otherIcons = iconFiles.filter(file => !categorizedIcons.includes(file));

    if (otherIcons.length > 0) {
        console.log('📦 OTHER ICONS - May be unused or legacy:');
        console.log('='.repeat(60));

        otherIcons.forEach(iconName => {
            const iconPath = path.join(ICONS_DIR, iconName);
            const stats = fs.statSync(iconPath);
            const sizeKB = (stats.size / 1024).toFixed(1);
            const modified = stats.mtime.toLocaleDateString();

            console.log(`📦 ${iconName}`);
            console.log(`   Size: ${sizeKB} KB | Modified: ${modified}`);
            console.log(`   Status: Review if still needed\n`);
        });
    }

    // Summary
    console.log('📊 SUMMARY:');
    console.log('='.repeat(60));
    console.log(`Total icons: ${iconFiles.length}`);
    console.log(`Active (high priority): ${ACTIVE_ICONS.filter(icon => fs.existsSync(path.join(ICONS_DIR, icon))).length}`);
    console.log(`Library (medium priority): ${LIBRARY_ICONS.filter(icon => fs.existsSync(path.join(ICONS_DIR, icon))).length}`);
    console.log(`Potentially branded: ${POTENTIALLY_BRANDED.filter(icon => fs.existsSync(path.join(ICONS_DIR, icon))).length}`);
    console.log(`Other/Legacy: ${otherIcons.length}`);

    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Review HIGH PRIORITY icons first - these are actively used');
    console.log('2. Check POTENTIALLY BRANDED icons for LAAS references');
    console.log('3. Update colors and styling to match SVlentes brand');
    console.log('4. Consider removing unused legacy icons');
    console.log('\n📖 See scripts/update-icons-guide.md for detailed instructions');
}

// Run the analysis
analyzeIcons();