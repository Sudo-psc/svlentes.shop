#!/usr/bin/env node

/**
 * SVlentes Auto Icon Updater
 * Automatically detects new icons and updates components to use them instead of emojis
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const ICONS_DIR = path.join(__dirname, '../public/icones');
const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const DATA_DIR = path.join(__dirname, '../src/data');

// Emoji to icon mapping patterns
const EMOJI_TO_ICON_MAP = {
    '📦': ['delivery', 'package', 'entrega', 'box'],
    '💰': ['money', 'savings', 'economia', 'piggy', 'dollar'],
    '👨‍⚕️': ['doctor', 'medical', 'medico', 'health'],
    '🏥': ['hospital', 'clinic', 'medical', 'health'],
    '📱': ['phone', 'mobile', 'contact', 'whatsapp'],
    '⏰': ['time', 'clock', 'schedule', 'tempo', '12h', '24h'],
    '✅': ['check', 'success', 'approved', 'verified'],
    '🎯': ['target', 'goal', 'precision', 'personalized'],
    '🔒': ['security', 'safe', 'protected', 'shield'],
    '📊': ['chart', 'stats', 'analytics', 'percent'],
    '🚀': ['rocket', 'fast', 'delivery', 'quick'],
    '💡': ['idea', 'smart', 'intelligent', 'expertise'],
    '🏆': ['award', 'best', 'premium', 'quality'],
    '👁️': ['eye', 'vision', 'sight', 'exam'],
    '📋': ['clipboard', 'form', 'checklist', 'plan'],
    '🎉': ['celebration', 'success', 'happy', 'party'],
    '💎': ['diamond', 'premium', 'quality', 'luxury'],
    '🛡️': ['shield', 'protection', 'security', 'safe'],
    '📞': ['phone', 'call', 'contact', 'support'],
    '🏠': ['home', 'house', 'delivery', 'location'],
    '⭐': ['star', 'rating', 'quality', 'premium'],
    '🔍': ['search', 'find', 'look', 'magnify'],
    '📈': ['growth', 'increase', 'improvement', 'stats'],
    '💳': ['card', 'payment', 'credit', 'money'],
    '🎨': ['design', 'creative', 'art', 'custom'],
    '🔧': ['tool', 'fix', 'repair', 'maintenance'],
    '📅': ['calendar', 'schedule', 'appointment', 'date'],
    '🌟': ['star', 'special', 'featured', 'highlight'],
    '💪': ['strong', 'power', 'strength', 'reliable'],
    '🎪': ['fun', 'entertainment', 'special', 'event']
};

class AutoIconUpdater {
    constructor() {
        this.iconCache = new Map();
        this.componentUpdates = [];
        this.loadExistingIcons();
    }

    loadExistingIcons() {
        if (!fs.existsSync(ICONS_DIR)) {
            console.log('📁 Icons directory not found, creating...');
            fs.mkdirSync(ICONS_DIR, { recursive: true });
            return;
        }

        const files = fs.readdirSync(ICONS_DIR);
        const iconFiles = files.filter(file =>
            file.toLowerCase().match(/\.(png|jpg|jpeg|svg|webp)$/i)
        );

        iconFiles.forEach(file => {
            const iconName = path.parse(file).name;
            this.iconCache.set(iconName, `/icones/${file}`);
        });

        console.log(`📦 Loaded ${iconFiles.length} existing icons`);
    }

    findMatchingIcon(emoji) {
        const keywords = EMOJI_TO_ICON_MAP[emoji] || [];

        for (const [iconName, iconPath] of this.iconCache.entries()) {
            const lowerIconName = iconName.toLowerCase();

            // Direct keyword match
            for (const keyword of keywords) {
                if (lowerIconName.includes(keyword.toLowerCase())) {
                    return { name: iconName, path: iconPath };
                }
            }
        }

        return null;
    }

    async scanComponentsForEmojis() {
        const componentsToUpdate = [];

        // Scan data files
        await this.scanDirectory(DATA_DIR, componentsToUpdate);

        // Scan component files
        await this.scanDirectory(COMPONENTS_DIR, componentsToUpdate);

        return componentsToUpdate;
    }

    async scanDirectory(dir, results) {
        if (!fs.existsSync(dir)) return;

        const files = fs.readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(dir, file.name);

            if (file.isDirectory()) {
                await this.scanDirectory(fullPath, results);
            } else if (file.name.match(/\.(tsx?|jsx?)$/)) {
                await this.scanFileForEmojis(fullPath, results);
            }
        }
    }

    async scanFileForEmojis(filePath, results) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');

            lines.forEach((line, lineIndex) => {
                // Find emojis in the line
                const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
                let match;

                while ((match = emojiRegex.exec(line)) !== null) {
                    const emoji = match[0];
                    const matchingIcon = this.findMatchingIcon(emoji);

                    if (matchingIcon) {
                        results.push({
                            file: filePath,
                            line: lineIndex + 1,
                            emoji: emoji,
                            suggestedIcon: matchingIcon,
                            context: line.trim()
                        });
                    }
                }
            });
        } catch (error) {
            console.error(`Error scanning ${filePath}:`, error.message);
        }
    }

    generateIconComponent(iconName, iconPath) {
        return `
import Image from 'next/image';

interface ${iconName}IconProps {
    size?: number;
    className?: string;
    alt?: string;
}

export function ${iconName}Icon({ 
    size = 24, 
    className = '', 
    alt = '${iconName} icon' 
}: ${iconName}IconProps) {
    return (
        <div className={\`relative inline-block \${className}\`} style={{ width: size, height: size }}>
            <Image
                src="${iconPath}"
                alt={alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 24px, 32px"
            />
        </div>
    );
}`;
    }

    async updateIconLibrary() {
        const iconLibraryPath = path.join(__dirname, '../src/lib/icons.ts');

        // Generate updated icon library
        let iconLibraryContent = `// Auto-generated icon library for SVlentes
// This file is automatically updated when new icons are added

import Image from 'next/image';

export interface IconProps {
    size?: number;
    className?: string;
    alt?: string;
}

export const iconPaths = {
`;

        // Add all cached icons
        for (const [iconName, iconPath] of this.iconCache.entries()) {
            const camelCaseName = iconName.replace(/[-_]/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase())
                .replace(/\s/g, '');

            iconLibraryContent += `    ${camelCaseName}: '${iconPath}',\n`;
        }

        iconLibraryContent += `};

// Generic icon component
export function Icon({ name, size = 24, className = '', alt }: IconProps & { name: keyof typeof iconPaths }) {
    const iconPath = iconPaths[name];
    
    if (!iconPath) {
        console.warn(\`Icon "\${name}" not found\`);
        return null;
    }

    return (
        <div className={\`relative inline-block \${className}\`} style={{ width: size, height: size }}>
            <Image
                src={iconPath}
                alt={alt || \`\${name} icon\`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 24px, 32px"
            />
        </div>
    );
}

// Individual icon components
`;

        // Generate individual icon components
        for (const [iconName, iconPath] of this.iconCache.entries()) {
            const componentName = iconName.replace(/[-_]/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase())
                .replace(/\s/g, '') + 'Icon';

            iconLibraryContent += `
export function ${componentName}({ size = 24, className = '', alt }: IconProps) {
    return <Icon name="${iconName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(/\s/g, '')}" size={size} className={className} alt={alt || "${iconName} icon"} />;
}`;
        }

        // Write the updated library
        fs.writeFileSync(iconLibraryPath, iconLibraryContent);
        console.log('📚 Updated icon library with', this.iconCache.size, 'icons');
    }

    async generateUpdateSuggestions() {
        console.log('🔍 Scanning components for emoji replacements...\n');

        const suggestions = await this.scanComponentsForEmojis();

        if (suggestions.length === 0) {
            console.log('✅ No emoji replacements found or all emojis already have matching icons');
            return;
        }

        console.log(`📝 Found ${suggestions.length} emoji replacement suggestions:\n`);

        // Group by file
        const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
            const relativePath = path.relative(process.cwd(), suggestion.file);
            if (!acc[relativePath]) acc[relativePath] = [];
            acc[relativePath].push(suggestion);
            return acc;
        }, {});

        // Generate update script
        let updateScript = `#!/usr/bin/env node
// Auto-generated emoji replacement script
// Run this script to replace emojis with icon components

const fs = require('fs');
const path = require('path');

const replacements = [
`;

        Object.entries(groupedSuggestions).forEach(([file, fileSuggestions]) => {
            console.log(`📄 ${file}:`);

            fileSuggestions.forEach(suggestion => {
                console.log(`   Line ${suggestion.line}: ${suggestion.emoji} → ${suggestion.suggestedIcon.name}`);
                console.log(`   Context: ${suggestion.context}`);
                console.log(`   Suggested: <Icon name="${suggestion.suggestedIcon.name}" size={24} />\n`);

                updateScript += `    {
        file: '${suggestion.file}',
        emoji: '${suggestion.emoji}',
        replacement: '<Icon name="${suggestion.suggestedIcon.name}" size={24} />',
        context: '${suggestion.context.replace(/'/g, "\\'")}',
    },
`;
            });
        });

        updateScript += `];

console.log('🔄 Applying emoji replacements...');

replacements.forEach(({ file, emoji, replacement, context }) => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const updatedContent = content.replace(new RegExp(emoji, 'g'), replacement);
        
        if (content !== updatedContent) {
            fs.writeFileSync(file, updatedContent);
            console.log(\`✅ Updated \${file}\`);
        }
    } catch (error) {
        console.error(\`❌ Error updating \${file}:\`, error.message);
    }
});

console.log('🎉 Emoji replacement complete!');
`;

        fs.writeFileSync(path.join(__dirname, 'apply-icon-replacements.js'), updateScript);
        console.log('📜 Generated replacement script: scripts/apply-icon-replacements.js');
    }

    startWatcher() {
        console.log('👀 Starting icon watcher...');

        const watcher = chokidar.watch(ICONS_DIR, {
            ignored: /^\./,
            persistent: true,
            ignoreInitial: true
        });

        watcher
            .on('add', (filePath) => this.handleNewIcon(filePath))
            .on('change', (filePath) => this.handleIconChange(filePath))
            .on('unlink', (filePath) => this.handleIconRemoval(filePath));

        console.log(`🎯 Watching ${ICONS_DIR} for changes...`);
        console.log('Press Ctrl+C to stop watching\n');
    }

    handleNewIcon(filePath) {
        const fileName = path.basename(filePath);
        const iconName = path.parse(fileName).name;
        const iconPath = `/icones/${fileName}`;

        if (fileName.match(/\.(png|jpg|jpeg|svg|webp)$/i)) {
            console.log(`🆕 New icon detected: ${fileName}`);

            this.iconCache.set(iconName, iconPath);
            this.updateIconLibrary();
            this.generateUpdateSuggestions();

            console.log(`✅ Icon library updated with ${iconName}\n`);
        }
    }

    handleIconChange(filePath) {
        const fileName = path.basename(filePath);
        console.log(`🔄 Icon updated: ${fileName}`);
        this.handleNewIcon(filePath); // Treat as new icon
    }

    handleIconRemoval(filePath) {
        const fileName = path.basename(filePath);
        const iconName = path.parse(fileName).name;

        console.log(`🗑️ Icon removed: ${fileName}`);
        this.iconCache.delete(iconName);
        this.updateIconLibrary();
        console.log(`✅ Icon library updated (removed ${iconName})\n`);
    }

    async run() {
        console.log('🚀 SVlentes Auto Icon Updater\n');

        // Initial setup
        await this.updateIconLibrary();
        await this.generateUpdateSuggestions();

        // Start watching for changes
        this.startWatcher();
    }
}

// Check if chokidar is installed
try {
    require('chokidar');
} catch (error) {
    console.error('❌ chokidar is required for file watching');
    console.log('📦 Install it with: npm install --save-dev chokidar');
    process.exit(1);
}

// Run the updater
const updater = new AutoIconUpdater();
updater.run().catch(console.error);