# GitLab Adaptive Cards - Solution Guide

## Problem Solved ✅

You had issues previewing your Adaptive Card because:

1. **`gitlab-sample.json`** - This is raw GitLab webhook data, not an Adaptive Card
2. **`gitlab-static-data.json`** - This is a proper Adaptive Card but with hardcoded data
3. You needed a way to transform GitLab data into a proper Adaptive Card

## Files Created

### 1. `gitlab-transformed-card.json` ⭐
- **WORKING ADAPTIVE CARD** generated from your GitLab data
- Ready to preview at: https://adaptivecards.io/designer/
- Copy and paste this JSON into the designer to see your card

### 2. `gitlab-transformer.js`
- Node.js script that transforms GitLab webhook data into Adaptive Cards
- Run with: `node gitlab-transformer.js`
- Automatically reads `gitlab-sample.json` and creates `gitlab-transformed-card.json`

### 3. `gitlab-adaptive-card-template.json`
- Template with Power Automate expressions (for production use)
- Use this in Power Automate flows or similar platforms

### 4. `gitlab-preview-card.json`
- Static version for testing/preview purposes
- Contains the same structure as your original but properly formatted

## How to Preview Your Card

### Option 1: Use the Generated Card
1. Open https://adaptivecards.io/designer/
2. Copy the content from `gitlab-transformed-card.json`
3. Paste it into the designer
4. Preview your card! 🎉

### Option 2: Use the Static Preview Card
1. Open `gitlab-preview-card.json` in VS Code
2. Copy its content to the Adaptive Cards Designer
3. This has the same visual result but with static data

## How to Use in Production

### For Power Automate:
1. Use `gitlab-adaptive-card-template.json`
2. It contains expressions like `${user_name}` that Power Automate will replace with actual data
3. Set up a GitLab webhook to trigger your Power Automate flow

### For Custom Applications:
1. Use `gitlab-transformer.js` as a reference
2. Adapt the `transformGitLabToAdaptiveCard()` function to your needs
3. Process GitLab webhooks and generate Adaptive Cards dynamically

## Testing Your Changes

```bash
# Transform GitLab data to Adaptive Card
node gitlab-transformer.js

# This will:
# - Read gitlab-sample.json
# - Transform it to an Adaptive Card
# - Save as gitlab-transformed-card.json
# - Show a summary of the transformation
```

## Card Features

Your Adaptive Card includes:
- ✅ GitLab branding and user avatar
- ✅ Project information
- ✅ Commit details with author and timestamp
- ✅ File change statistics (added/modified/removed)
- ✅ Protection status (protected/unprotected branch)
- ✅ Action buttons for repository, commit, and branch history
- ✅ Responsive design that works on different screen sizes

## Troubleshooting

### Card Won't Preview?
- Make sure you're using `gitlab-transformed-card.json` or `gitlab-preview-card.json`
- Don't try to preview `gitlab-sample.json` (it's raw data, not a card)
- Check that the JSON is valid

### Want to Modify the Card?
- Edit `gitlab-transformer.js` and run it again
- Or manually edit the generated JSON files
- Test changes in the Adaptive Cards Designer

### Need Different Data?
- Update `gitlab-sample.json` with your GitLab webhook data
- Run `node gitlab-transformer.js` to regenerate the card

## Next Steps

1. **Preview**: Copy `gitlab-transformed-card.json` to the Adaptive Cards Designer
2. **Customize**: Modify colors, layout, or content in the transformer script
3. **Deploy**: Use the template version in your automation platform
4. **Test**: Set up GitLab webhooks to send real data to your system

Your Adaptive Card is now ready to preview! 🚀
