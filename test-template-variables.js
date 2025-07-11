// Test to validate that the template uses camelCase variables
const fs = require('fs');
const path = require('path');

function testTemplateVariables() {
    console.log('🧪 Testing GitLab Adaptive Card Template Variables...');
    
    try {
        // Read the template
        const templatePath = path.join(__dirname, 'gitlab-adaptive-card-template.json');
        const templateContent = fs.readFileSync(templatePath, 'utf8');
        
        // Read the variables file
        const variablesPath = path.join(__dirname, 'variables.json');
        const variablesContent = fs.readFileSync(variablesPath, 'utf8');
        const variables = JSON.parse(variablesContent);
        
        console.log('📋 Expected camelCase variables:');
        Object.keys(variables).forEach(key => {
            console.log(`   - ${key}`);
        });
        
        console.log('\n🔍 Checking template for old underscore variables...');
        
        // Check for old variables that should be replaced
        const oldVariables = [
            'user_name',
            'user_avatar', 
            'user_email',
            'user_username',
            'project.name',
            'project.path_with_namespace',
            'project_id',
            'project.web_url',
            'commits[0].title',
            'commits[0].author.name',
            'commits[0].url',
            'commits[0].message',
            'commits[0].timestamp',
            'commits[0].added',
            'commits[0].modified',
            'commits[0].removed',
            'ref_protected',
            'total_commits_count',
            'replace(ref, \'refs/heads/\', \'\')',
            'length(commits[0].added)',
            'length(commits[0].modified)',
            'length(commits[0].removed)',
            'if(equals(total_commits_count, 1)',
            'if(ref_protected',
            'formatDateTime(commits[0].timestamp',
            'if(length(commits[0].message) > 150'
        ];
        
        let foundOldVariables = [];
        oldVariables.forEach(oldVar => {
            if (templateContent.includes(oldVar)) {
                foundOldVariables.push(oldVar);
            }
        });
        
        console.log('\n📊 Check Results:');
        if (foundOldVariables.length > 0) {
            console.log(`❌ Found ${foundOldVariables.length} old variables that need to be replaced:`);
            foundOldVariables.forEach(oldVar => {
                console.log(`   - ${oldVar}`);
            });
        } else {
            console.log('✅ No old variables found - template appears to be updated!');
        }
        
        // Check for new camelCase variables
        console.log('\n🔍 Checking for expected camelCase variables...');
        let foundNewVariables = [];
        Object.keys(variables).forEach(newVar => {
            if (templateContent.includes(`\${${newVar}}`)) {
                foundNewVariables.push(newVar);
            }
        });
        
        console.log(`✅ Found ${foundNewVariables.length} camelCase variables:`);
        foundNewVariables.forEach(newVar => {
            console.log(`   - ${newVar}`);
        });
        
        const missingVariables = Object.keys(variables).filter(v => !foundNewVariables.includes(v));
        if (missingVariables.length > 0) {
            console.log(`⚠️  Missing ${missingVariables.length} expected variables:`);
            missingVariables.forEach(missingVar => {
                console.log(`   - ${missingVar}`);
            });
        }
        
        return {
            hasOldVariables: foundOldVariables.length > 0,
            foundOldVariables: foundOldVariables,
            foundNewVariables: foundNewVariables,
            missingVariables: missingVariables
        };
        
    } catch (error) {
        console.error('❌ Error testing template variables:', error.message);
        return null;
    }
}

// Run the test
if (require.main === module) {
    testTemplateVariables();
}

module.exports = { testTemplateVariables };