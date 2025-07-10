// GitLab to Adaptive Card Transformer
// This script transforms GitLab webhook data into an Adaptive Card

const fs = require('fs');
const path = require('path');

/**
 * Transform GitLab webhook data to Adaptive Card
 * @param {Object} gitlabData - The GitLab webhook payload
 * @returns {Object} - The Adaptive Card JSON
 */
function transformGitLabToAdaptiveCard(gitlabData) {
    // Extract branch name from ref
    const branchName = gitlabData.ref ? gitlabData.ref.replace('refs/heads/', '') : 'unknown';
    
    // Format commit count
    const commitCountText = gitlabData.total_commits_count === 1 
        ? '1 commit' 
        : `${gitlabData.total_commits_count} commits`;
    
    // Format protection status
    const protectionStatus = gitlabData.ref_protected ? '🔒 Protected' : '🔓 Unprotected';
    
    // Get latest commit (first in array)
    const latestCommit = gitlabData.commits && gitlabData.commits.length > 0 
        ? gitlabData.commits[0] 
        : null;
    
    // Format commit message (truncate if too long)
    let commitMessage = '';
    if (latestCommit && latestCommit.message) {
        commitMessage = latestCommit.message.length > 150 
            ? latestCommit.message.substring(0, 147) + '...'
            : latestCommit.message;
    }
    
    // Format timestamp
    let formattedTimestamp = '';
    if (latestCommit && latestCommit.timestamp) {
        const date = new Date(latestCommit.timestamp);
        formattedTimestamp = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Count file changes
    const addedFiles = latestCommit && latestCommit.added ? latestCommit.added.length : 0;
    const modifiedFiles = latestCommit && latestCommit.modified ? latestCommit.modified.length : 0;
    const removedFiles = latestCommit && latestCommit.removed ? latestCommit.removed.length : 0;
    
    // Build the Adaptive Card
    const adaptiveCard = {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.4",
        "body": [
            {
                "type": "Container",
                "style": "emphasis",
                "items": [
                    {
                        "type": "ColumnSet",
                        "columns": [
                            {
                                "type": "Column",
                                "width": "auto",
                                "items": [
                                    {
                                        "type": "Image",
                                        "url": "https://about.gitlab.com/images/press/logo/png/gitlab-icon-rgb.png",
                                        "size": "Small",
                                        "width": "32px"
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "width": "stretch",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": "🚀 GitLab Push Event",
                                        "weight": "Bolder",
                                        "size": "Medium",
                                        "color": "Accent"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": `${gitlabData.user_name || 'Unknown'} (@${gitlabData.user_username || 'unknown'}) pushed to repository`,
                                        "size": "Small",
                                        "spacing": "None",
                                        "isSubtle": true
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "width": "auto",
                                "items": [
                                    {
                                        "type": "Image",
                                        "url": gitlabData.user_avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
                                        "size": "Small",
                                        "style": "Person"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "Container",
                "spacing": "Medium",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": `📁 **${gitlabData.project?.name || 'Unknown Project'}**`,
                        "size": "Large",
                        "weight": "Bolder",
                        "wrap": true
                    },
                    {
                        "type": "TextBlock",
                        "text": gitlabData.project?.path_with_namespace || 'unknown/project',
                        "size": "Small",
                        "color": "Accent",
                        "spacing": "None"
                    }
                ]
            },
            {
                "type": "FactSet",
                "spacing": "Medium",
                "facts": [
                    {
                        "title": "👤 User:",
                        "value": `${gitlabData.user_name || 'Unknown'} (@${gitlabData.user_username || 'unknown'})`
                    },
                    {
                        "title": "🌿 Branch:",
                        "value": branchName
                    },
                    {
                        "title": "📊 Commits:",
                        "value": commitCountText
                    },
                    {
                        "title": "🔒 Protection:",
                        "value": protectionStatus
                    },
                    {
                        "title": "🆔 Project:",
                        "value": `#${gitlabData.project_id || 'unknown'}`
                    }
                ]
            }
        ],
        "actions": [
            {
                "type": "Action.OpenUrl",
                "title": "🏠 Open Repository",
                "url": gitlabData.project?.web_url || "#"
            }
        ]
    };
    
    // Add commit details if available
    if (latestCommit) {
        adaptiveCard.body.push({
            "type": "Container",
            "spacing": "Medium",
            "items": [
                {
                    "type": "TextBlock",
                    "text": "📝 **Latest Commit:**",
                    "weight": "Bolder",
                    "size": "Medium"
                },
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": `**${latestCommit.title || 'No title'}**`,
                            "wrap": true,
                            "weight": "Bolder"
                        },
                        {
                            "type": "TextBlock",
                            "text": commitMessage,
                            "wrap": true,
                            "spacing": "None",
                            "maxLines": 3
                        },
                        {
                            "type": "ColumnSet",
                            "spacing": "Small",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": `👤 ${latestCommit.author?.name || 'Unknown'}`,
                                            "size": "Small",
                                            "color": "Accent"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": `🕒 ${formattedTimestamp}`,
                                            "size": "Small",
                                            "isSubtle": true
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        
        // Add file changes section
        adaptiveCard.body.push({
            "type": "Container",
            "spacing": "Medium",
            "items": [
                {
                    "type": "TextBlock",
                    "text": "📊 **File Changes:**",
                    "weight": "Bolder",
                    "size": "Small"
                },
                {
                    "type": "FactSet",
                    "spacing": "Small",
                    "facts": [
                        {
                            "title": "➕ Added:",
                            "value": `${addedFiles} files`
                        },
                        {
                            "title": "📝 Modified:",
                            "value": `${modifiedFiles} files`
                        },
                        {
                            "title": "➖ Removed:",
                            "value": `${removedFiles} files`
                        }
                    ]
                }
            ]
        });
        
        // Add more actions
        adaptiveCard.actions.push(
            {
                "type": "Action.OpenUrl",
                "title": "🔍 View Commit",
                "url": latestCommit.url || "#"
            },
            {
                "type": "Action.OpenUrl",
                "title": "📋 Branch History",
                "url": `${gitlabData.project?.web_url || '#'}/-/commits/${branchName}`
            },
            {
                "type": "Action.OpenUrl",
                "title": "📧 Contact User",
                "url": `mailto:${gitlabData.user_email || ''}`
            }
        );
    }
    
    return adaptiveCard;
}

// Main execution
function main() {
    try {
        console.log('📖 Reading GitLab webhook data...');
        
        // Read the GitLab sample data
        const gitlabData = JSON.parse(fs.readFileSync('gitlab-sample.json', 'utf8'));
        
        console.log(' Transforming to Adaptive Card...');
        
        // Transform the data
        const adaptiveCard = transformGitLabToAdaptiveCard(gitlabData);
        
        // Write the result
        fs.writeFileSync('gitlab-transformed-card.json', JSON.stringify(adaptiveCard, null, 2));
        
        console.log('✅ Transformation complete!');
        console.log('📄 Generated Adaptive Card saved to: gitlab-transformed-card.json');
        console.log('🔍 You can now preview this card at: https://adaptivecards.io/designer/');
        
        // Show summary
        console.log('\n📊 Transformation Summary:');
        console.log('   User: ' + gitlabData.user_name + ' (@' + gitlabData.user_username + ')');
        console.log('   Project: ' + (gitlabData.project ? gitlabData.project.name : 'Unknown'));
        console.log('   Branch: ' + (gitlabData.ref ? gitlabData.ref.replace('refs/heads/', '') : 'unknown'));
        console.log('   Commits: ' + gitlabData.total_commits_count);
        console.log('   Protected: ' + (gitlabData.ref_protected ? 'Yes' : 'No'));
        
        return adaptiveCard;
        
    } catch (error) {
        console.error('❌ Error transforming GitLab data:', error.message);
        console.error('Stack trace:', error.stack);
        return null;
    }
}

// Export for module use
module.exports = { transformGitLabToAdaptiveCard };

// Run if called directly
if (require.main === module) {
    main();
}
