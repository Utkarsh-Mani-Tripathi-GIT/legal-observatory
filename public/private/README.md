This folder is intended for private assets that should not be committed to Git.
Place sensitive handbooks, unpublished drafts, or restricted images here.

NOTES:
- This path is excluded locally via `.git/info/exclude` so files here will not be pushed to the remote repository.
- To serve these assets in production, upload them to a private storage bucket (Supabase / S3) and update references in the code to use secure URLs or signed links.

Do NOT commit secrets or credentials to the repository.
