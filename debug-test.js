const fs = require('fs');

console.log('Starting script...');

try {
    // Test if we can read the file
    console.log('Reading gitlab-sample.json...');
    const data = fs.readFileSync('gitlab-sample.json', 'utf8');
    console.log('File read successfully, length:', data.length);
    
    const parsed = JSON.parse(data);
    console.log('JSON parsed successfully');
    console.log('User name:', parsed.user_name);
    console.log('Project name:', parsed.project ? parsed.project.name : 'No project');
    
    // Create a simple adaptive card
    const simpleCard = {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.4",
        "body": [
            {
                "type": "TextBlock",
                "text": "GitLab Push Event",
                "weight": "Bolder",
                "size": "Large"
            },
            {
                "type": "TextBlock",
                "text": `User: ${parsed.user_name} (@${parsed.user_username})`,
                "wrap": true
            },
            {
                "type": "TextBlock", 
                "text": `Project: ${parsed.project.name}`,
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": `Branch: ${parsed.ref.replace('refs/heads/', '')}`,
                "wrap": true
            }
        ]
    };
    
    console.log('Writing gitlab-simple-card.json...');
    fs.writeFileSync('gitlab-simple-card.json', JSON.stringify(simpleCard, null, 2));
    console.log('File written successfully!');
    
} catch (error) {
    console.error('Error:', error.message);
}
