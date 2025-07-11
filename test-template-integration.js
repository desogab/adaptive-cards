// Test to verify that the updated template works correctly with camelCase variables
const fs = require('fs');
const path = require('path');

function testTemplateWithVariables() {
    console.log('🧪 Testing Template with Sample Variables...');
    
    try {
        // Read the template
        const templateContent = fs.readFileSync('gitlab-adaptive-card-template.json', 'utf8');
        const template = JSON.parse(templateContent);
        
        // Sample variables (matching the format from variables.json)
        const sampleVariables = {
            branchName: 'main',
            commitCountText: '3 commits',
            protectionStatus: '🔒 Protected',
            eventIcon: '🚀',
            userDisplayName: 'John Doe (@johndoe)',
            formattedTimestamp: '10/07/2025 14:51',
            shortCommitMessage: 'Add new features and fix bugs',
            branchCommitsUrl: 'https://gitlab.com/project/-/commits/main',
            projectFullPath: 'company/awesome-project',
            commitAuthor: 'John Doe',
            commitTitle: 'Add new features',
            projectName: 'Awesome Project',
            projectUrl: 'https://gitlab.com/project',
            userEmail: 'john.doe@example.com',
            userAvatar: 'https://gitlab.com/avatar.png',
            projectId: '12345',
            filesAdded: '3',
            filesModified: '5',
            filesRemoved: '1',
            commitUrl: 'https://gitlab.com/project/-/commit/abc123'
        };
        
        // Replace variables in template
        let processedTemplate = JSON.stringify(template, null, 2);
        
        Object.entries(sampleVariables).forEach(([key, value]) => {
            const placeholder = `\${${key}}`;
            processedTemplate = processedTemplate.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
        });
        
        // Check if all variables were replaced
        const remainingVariables = processedTemplate.match(/\${[^}]+}/g) || [];
        
        console.log('📊 Variable Replacement Results:');
        console.log(`   ✅ Replaced ${Object.keys(sampleVariables).length} variables`);
        
        if (remainingVariables.length > 0) {
            console.log(`   ⚠️  ${remainingVariables.length} variables not replaced:`);
            remainingVariables.forEach(variable => {
                console.log(`      - ${variable}`);
            });
        } else {
            console.log('   ✅ All variables successfully replaced');
        }
        
        // Verify the result is still valid JSON
        const processedJson = JSON.parse(processedTemplate);
        console.log('   ✅ Processed template is valid JSON');
        
        // Save the processed template for manual inspection
        fs.writeFileSync('gitlab-template-processed-test.json', processedTemplate);
        console.log('   📄 Processed template saved to: gitlab-template-processed-test.json');
        
        return {
            success: true,
            replacedVariables: Object.keys(sampleVariables).length,
            remainingVariables: remainingVariables,
            processedTemplate: processedJson
        };
        
    } catch (error) {
        console.error('❌ Error testing template:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Run the test
if (require.main === module) {
    testTemplateWithVariables();
}

module.exports = { testTemplateWithVariables };