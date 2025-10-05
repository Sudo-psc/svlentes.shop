#!/usr/bin/env node

/**
 * SVlentes Icon System Test
 * Tests the icon system functionality
 */

const fs = require('fs');
const path = require('path');

function testIconSystem() {
    console.log('🧪 Testing SVlentes Icon System\n');

    // Test 1: Check if icon files exist
    console.log('📁 Test 1: Checking icon files...');
    const iconsDir = path.join(__dirname, '../public/icones');
    const requiredIcons = [
        'calc.png',
        'atendido.png',
        '40percent.png',
        '12h.png',
        'piggy_bank_with_dollar_coin.png'
    ];

    let missingIcons = [];
    requiredIcons.forEach(icon => {
        const iconPath = path.join(iconsDir, icon);
        if (fs.existsSync(iconPath)) {
            console.log(`   ✅ ${icon} - Found`);
        } else {
            console.log(`   ❌ ${icon} - Missing`);
            missingIcons.push(icon);
        }
    });

    // Test 2: Check if icon library is properly structured
    console.log('\n📚 Test 2: Checking icon library...');
    const iconLibPath = path.join(__dirname, '../src/lib/icons.tsx');

    if (fs.existsSync(iconLibPath)) {
        const content = fs.readFileSync(iconLibPath, 'utf8');

        const checks = [
            { name: 'CalcIcon export', pattern: /export function CalcIcon/ },
            { name: 'AtendidoIcon export', pattern: /export function AtendidoIcon/ },
            { name: 'Icon component', pattern: /export function Icon/ },
            { name: 'ICONS registry', pattern: /export const ICONS/ },
            { name: 'Image import', pattern: /import.*Image.*from.*next\/image/ }
        ];

        checks.forEach(check => {
            if (check.pattern.test(content)) {
                console.log(`   ✅ ${check.name} - Found`);
            } else {
                console.log(`   ❌ ${check.name} - Missing`);
            }
        });
    } else {
        console.log('   ❌ Icon library file not found');
    }

    // Test 3: Check if EconomySection is updated
    console.log('\n🧮 Test 3: Checking EconomySection updates...');
    const economySectionPath = path.join(__dirname, '../src/components/sections/EconomySection.tsx');

    if (fs.existsSync(economySectionPath)) {
        const content = fs.readFileSync(economySectionPath, 'utf8');

        const checks = [
            { name: 'Icon imports', pattern: /import.*CalcIcon.*from.*@\/lib\/icons/ },
            { name: 'IconComponent usage', pattern: /IconComponent/ },
            { name: 'CalcIcon usage', pattern: /<CalcIcon/ },
            { name: 'No more iconPath', pattern: /iconPath.*icones/, shouldNotExist: true }
        ];

        checks.forEach(check => {
            const found = check.pattern.test(content);
            if (check.shouldNotExist) {
                if (!found) {
                    console.log(`   ✅ ${check.name} - Correctly removed`);
                } else {
                    console.log(`   ❌ ${check.name} - Still present (should be removed)`);
                }
            } else {
                if (found) {
                    console.log(`   ✅ ${check.name} - Found`);
                } else {
                    console.log(`   ❌ ${check.name} - Missing`);
                }
            }
        });
    } else {
        console.log('   ❌ EconomySection file not found');
    }

    // Summary
    console.log('\n📊 Test Summary:');
    console.log('='.repeat(40));

    if (missingIcons.length === 0) {
        console.log('✅ All required icons are present');
    } else {
        console.log(`❌ Missing ${missingIcons.length} icons:`, missingIcons.join(', '));
    }

    console.log('\n🚀 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Check: http://localhost:3000 - Economy section');
    console.log('3. Verify: Icons display correctly');
    console.log('4. Test: Icon fallbacks work if images fail to load');
}

testIconSystem();