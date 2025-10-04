#!/usr/bin/env node

/**
 * Favicon Generation Script
 * 
 * This script helps generate proper favicon files from your logo.
 * You'll need to install sharp: npm install sharp
 * 
 * Usage:
 * 1. Place your logo (PNG/SVG) in public/logo.png
 * 2. Run: node scripts/generate-favicons.js
 */

const fs = require('fs')
const path = require('path')

console.log('🎨 Favicon Generation Helper')
console.log('============================')
console.log('')
console.log('To generate proper favicons from your logo:')
console.log('')
console.log('1. Install sharp: npm install sharp')
console.log('2. Place your logo as public/logo.png (square, at least 512x512)')
console.log('3. Run this script: node scripts/generate-favicons.js')
console.log('')
console.log('Or use an online favicon generator like:')
console.log('- https://realfavicongenerator.net/')
console.log('- https://favicon.io/')
console.log('')
console.log('Required files for your app:')
console.log('- favicon.ico (16x16, 32x32)')
console.log('- favicon.svg (vector)')
console.log('- apple-touch-icon.png (180x180)')
console.log('- android-chrome-192x192.png (192x192)')
console.log('- android-chrome-512x512.png (512x512)')
console.log('- favicon-16x16.png (16x16)')
console.log('- favicon-32x32.png (32x32)')

// Check if sharp is available
try {
    const sharp = require('sharp')

    const logoPath = path.join(__dirname, '../public/logo.png')
    if (!fs.existsSync(logoPath)) {
        console.log('')
        console.log('❌ Logo not found at public/logo.png')
        console.log('Please add your logo file and run again.')
        return
    }

    console.log('')
    console.log('✅ Sharp found! Generating favicons...')

    const generateFavicons = async () => {
        const publicDir = path.join(__dirname, '../public')

        // Generate different sizes
        const sizes = [
            { name: 'favicon-16x16.png', size: 16 },
            { name: 'favicon-32x32.png', size: 32 },
            { name: 'apple-touch-icon.png', size: 180 },
            { name: 'android-chrome-192x192.png', size: 192 },
            { name: 'android-chrome-512x512.png', size: 512 }
        ]

        for (const { name, size } of sizes) {
            await sharp(logoPath)
                .resize(size, size)
                .png()
                .toFile(path.join(publicDir, name))
            console.log(`✅ Generated ${name}`)
        }

        // Generate ICO file (requires additional setup)
        console.log('')
        console.log('📝 Note: For favicon.ico, use an online converter or ico-endec package')
        console.log('✨ Favicon generation complete!')
    }

    generateFavicons().catch(console.error)

} catch (error) {
    console.log('')
    console.log('📦 Sharp not installed. Install it with: npm install sharp')
}