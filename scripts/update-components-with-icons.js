#!/usr/bin/env node

/**
 * SVlentes Component Icon Updater
 * Automatically updates components to use the new icon system instead of emojis
 */

const fs = require('fs');
const path = require('path');

// Components that need updating
const COMPONENTS_TO_UPDATE = [
    {
        file: 'src/components/sections/EconomySection.tsx',
        updates: [
            {
                description: 'Update economy stats to use icon components',
                search: /iconPath: '\/icones\/([^']+)'/g,
                replace: (match, iconFile) => {
                    const iconMap = {
                        'piggy_bank_with_dollar_coin.png': 'piggyBankStats',
                        'atendido.png': 'atendido',
                        '40percent.png': 'fortyPercent',
                        '12h.png': 'twelveH'
                    };
                    const iconName = iconMap[iconFile];
                    return iconName ? `iconName: '${iconName}'` : match;
                }
            },
            {
                description: 'Update calc.png usage',
                search: 'src="/icones/calc.png"',
                replace: '<CalcIcon size={80} className="w-20 h-20" />'
            }
        ]
    },
    {
        file: 'src/data/problems-solutions.ts',
        updates: [
            {
                description: 'Add icon references to solutions',
                search: /icon: '([^']+)',/g,
                replace: (match, emoji) => {
                    const emojiToIcon = {
                        '📦': 'delivery',
                        '💰': 'piggyBankStats',
                        '👨‍⚕️': 'drPhilipe',
                        '🏠': 'location',
                        '🎯': 'premiumQuality',
                        '🆘': 'customerService'
                    };
                    const iconName = emojiToIcon[emoji];
                    return iconName ? `icon: '${emoji}',\n        iconComponent: '${iconName}',` : match;
                }
            }
        ]
    }
];

// Emoji to icon mapping for automatic replacement
const EMOJI_REPLACEMENTS = {
    '📦': { component: 'DeliveryIcon', import: 'delivery' },
    '💰': { component: 'PiggyBankIcon', import: 'piggyBankStats' },
    '👨‍⚕️': { component: 'DrPhilipeIcon', import: 'drPhilipe' },
    '🏥': { component: 'EyeCalendarIcon', import: 'eyeCalendar' },
    '📱': { component: 'CustomerServiceIcon', import: 'customerService' },
    '⏰': { component: 'TwelveHIcon', import: 'twelveH' },
    '✅': { component: 'ShieldSecurityIcon', import: 'shieldSecurity' },
    '🎯': { component: 'PremiumQualityIcon', import: 'premiumQuality' },
    '🔒': { component: 'ShieldSecurityIcon', import: 'shieldSecurity' },
    '📊': { component: 'FortyPercentIcon', import: 'fortyPercent' },
    '🧮': { component: 'CalcIcon', import: 'calc' },
    '👥': { component: 'AtendidoIcon', import: 'atendido' }
};

class ComponentUpdater {
    constructor() {
        this.updatedFiles = [];
        this.errors = [];
    }

    async updateComponents() {
        console.log('🔄 Starting component updates for icon integration...\n');

        for (const componentConfig of COMPONENTS_TO_UPDATE) {
            await this.updateComponent(componentConfig);
        }

        // Scan for emoji replacements
        await this.scanAndReplaceEmojis();

        this.printSummary();
    }

    async updateComponent(config) {
        const { file, updates } = config;
        const filePath = path.join(process.cwd(), file);

        if (!fs.existsSync(filePath)) {
            this.errors.push(`File not found: ${file}`);
            return;
        }

        try {
            let content = fs.readFileSync(filePath, 'utf8');
            let hasChanges = false;

            console.log(`📝 Updating ${file}...`);

            for (const update of updates) {
                const originalContent = content;

                if (typeof update.replace === 'function') {
                    content = content.replace(update.search, update.replace);
                } else {
                    content = content.replace(update.search, update.replace);
                }

                if (content !== originalContent) {
                    hasChanges = true;
                    console.log(`   ✅ ${update.description}`);
                }
            }

            if (hasChanges) {
                // Add import statement if not present
                if (!content.includes('import { Icon')) {
                    const importLine = "import { Icon, CalcIcon, AtendidoIcon, FortyPercentIcon, TwelveHIcon, PiggyBankIcon } from '@/lib/icons';\n";

                    // Find the last import statement
                    const importRegex = /import.*from.*['"];?\n/g;
                    let lastImportMatch;
                    let match;

                    while ((match = importRegex.exec(content)) !== null) {
                        lastImportMatch = match;
                    }

                    if (lastImportMatch) {
                        const insertIndex = lastImportMatch.index + lastImportMatch[0].length;
                        content = content.slice(0, insertIndex) + importLine + content.slice(insertIndex);
                    } else {
                        content = importLine + content;
                    }
                }

                fs.writeFileSync(filePath, content);
                this.updatedFiles.push(file);
                console.log(`   💾 File updated successfully\n`);
            } else {
                console.log(`   ℹ️  No changes needed\n`);
            }

        } catch (error) {
            this.errors.push(`Error updating ${file}: ${error.message}`);
            console.error(`   ❌ Error: ${error.message}\n`);
        }
    }

    async scanAndReplaceEmojis() {
        console.log('🔍 Scanning for emoji replacements...\n');

        const componentsDir = path.join(process.cwd(), 'src/components');
        const dataDir = path.join(process.cwd(), 'src/data');

        await this.scanDirectory(componentsDir);
        await this.scanDirectory(dataDir);
    }

    async scanDirectory(dir) {
        if (!fs.existsSync(dir)) return;

        const files = fs.readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(dir, file.name);

            if (file.isDirectory()) {
                await this.scanDirectory(fullPath);
            } else if (file.name.match(/\.(tsx?|jsx?)$/)) {
                await this.scanFileForEmojis(fullPath);
            }
        }
    }

    async scanFileForEmojis(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            let updatedContent = content;
            let hasChanges = false;

            // Check for emojis that can be replaced
            for (const [emoji, replacement] of Object.entries(EMOJI_REPLACEMENTS)) {
                if (content.includes(emoji)) {
                    const relativePath = path.relative(process.cwd(), filePath);
                    console.log(`   🎯 Found ${emoji} in ${relativePath}`);

                    // For now, just log the finding - actual replacement would need more context
                    // In a real implementation, you'd want to be more careful about context
                }
            }

        } catch (error) {
            this.errors.push(`Error scanning ${filePath}: ${error.message}`);
        }
    }

    printSummary() {
        console.log('📊 Update Summary:');
        console.log('='.repeat(50));
        console.log(`✅ Files updated: ${this.updatedFiles.length}`);
        console.log(`❌ Errors: ${this.errors.length}`);

        if (this.updatedFiles.length > 0) {
            console.log('\n📝 Updated files:');
            this.updatedFiles.forEach(file => console.log(`   - ${file}`));
        }

        if (this.errors.length > 0) {
            console.log('\n❌ Errors:');
            this.errors.forEach(error => console.log(`   - ${error}`));
        }

        console.log('\n🎉 Component update process completed!');
        console.log('\n📋 Next steps:');
        console.log('1. Test the updated components');
        console.log('2. Run the development server to verify changes');
        console.log('3. Check for any TypeScript errors');
        console.log('4. Commit the changes if everything works correctly');
    }
}

// Create updated EconomySection template
function createUpdatedEconomySection() {
    const template = `// Updated EconomySection with icon integration
import { CalcIcon, AtendidoIcon, FortyPercentIcon, TwelveHIcon, PiggyBankIcon } from '@/lib/icons';

// Updated economyStats array
const economyStats = [
    {
        iconComponent: PiggyBankIcon,
        value: 'R$ 800',
        label: 'Economia média anual',
        description: 'Comparado à compra avulsa'
    },
    {
        iconComponent: AtendidoIcon,
        value: '5.000+',
        label: 'Clientes satisfeitos',
        description: 'Avaliação média do serviço'
    },
    {
        iconComponent: FortyPercentIcon,
        value: '40%',
        label: 'Economia média',
        description: 'Em relação ao preço tradicional'
    },
    {
        iconComponent: TwelveHIcon,
        value: '12h',
        label: 'Tempo economizado',
        description: 'Por ano, sem ir à ótica'
    }
];

// Usage in component:
{economyStats.map((stat, index) => (
    <div key={index} className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <stat.iconComponent size={64} />
        </div>
        <div className="text-3xl font-bold text-primary-600 mb-2">
            {stat.value}
        </div>
        <div className="text-lg font-semibold text-gray-900 mb-1">
            {stat.label}
        </div>
        <div className="text-sm text-gray-600">
            {stat.description}
        </div>
    </div>
))}`;

    fs.writeFileSync(
        path.join(__dirname, 'economy-section-template.tsx'),
        template
    );

    console.log('📄 Created updated EconomySection template: scripts/economy-section-template.tsx');
}

// Run the updater
async function main() {
    const updater = new ComponentUpdater();
    await updater.updateComponents();
    createUpdatedEconomySection();
}

main().catch(console.error);