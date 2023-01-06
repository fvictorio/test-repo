module.exports.run = async function ({ github, context }) {
  const pullNumber = context.issue.number;

  const { data: files } = await github.rest.pulls.listFiles({
    ...context.issue,
    pull_number: pullNumber
  });

  const changeset = files.find(
    file => file.status === "added" && file.filename.startsWith(".changeset/")
  );

  if (changeset !== undefined) {
    console.log("Changeset found:", changeset.filename);
    return;
  }

  const { data: comments } = await github.rest.issues.listComments({
    ...context.issue,
    issue_number: pullNumber
  });

  const noChangesetNeededComment = comments.find(x =>
    x.body?.toLowerCase().includes("no changeset needed")
  );

  if (noChangesetNeededComment !== undefined) {
    console.log(
      "Comment saying that no changeset needed:",
      noChangesetNeededComment.html_url
    );
    return;
  }

  console.error("No changeset found");
  process.exit(1);
};
