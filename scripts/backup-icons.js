#!/usr/bin/env node

/**
 * SVlentes Icon Backup Script
 * Creates a backup of current icons before updating them
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '../public/icones');
const BACKUP_DIR = path.join(__dirname, '../public/icones-backup-' + new Date().toISOString().split('T')[0]);

function backupIcons() {
    console.log('💾 Creating backup of current icons...\n');

    if (!fs.existsSync(ICONS_DIR)) {
        console.error('❌ Icons directory not found:', ICONS_DIR);
        return;
    }

    // Create backup directory
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        console.log('📁 Created backup directory:', BACKUP_DIR);
    }

    // Copy all icon files
    const files = fs.readdirSync(ICONS_DIR);
    let copiedCount = 0;

    files.forEach(file => {
        const sourcePath = path.join(ICONS_DIR, file);
        const backupPath = path.join(BACKUP_DIR, file);

        if (fs.statSync(sourcePath).isFile()) {
            fs.copyFileSync(sourcePath, backupPath);
            copiedCount++;
            console.log(`✅ Backed up: ${file}`);
        }
    });

    console.log(`\n🎉 Successfully backed up ${copiedCount} files to:`);
    console.log(`   ${BACKUP_DIR}`);
    console.log('\n💡 You can now safely update your icons knowing you have a backup!');
}

// Run the backup
backupIcons();