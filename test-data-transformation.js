// Test the Power Automate expressions locally
const samplePayload = {
  "ref": "refs/heads/main",
  "total_commits_count": 3,
  "ref_protected": true,
  "object_kind": "push",
  "commits": [
    {
      "timestamp": "2025-07-10T14:51:43+00:00",
      "message": "This is a very long commit message that should be truncated when it exceeds the maximum length we want to display in our adaptive card to maintain good visual layout"
    }
  ]
};

// Simulate Power Automate functions
const branchName = samplePayload.ref.replace('refs/heads/', '');
const commitCountText = samplePayload.total_commits_count === 1 ? '1 commit' : `${samplePayload.total_commits_count} commits`;
const protectionStatus = samplePayload.ref_protected ? '🔒 Protected' : '🔓 Unprotected';

console.log('Branch Name:', branchName);
console.log('Commit Count:', commitCountText);
console.log('Protection:', protectionStatus);