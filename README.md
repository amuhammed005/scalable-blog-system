/*
git checkout feature/auth-login
<!-- That will restore the branch state with your login refactor. -->
<!-- Verify it -->
git status
git log --oneline -1
<!-- To push it -->
git push origin feature/auth-login
<!-- If you want to switch back to main later -->
git checkout main
<!-- Then when ready to integrate: -->
git merge feature/auth-login
git push origin main

<!-- If you want to keep that file and switch safely: -->
git stash push --include-untracked -m "wip: save token.js before branch switch"
git checkout feature/auth-login
<!-- Then later recover it on the branch if needed:-->
git stash pop
<!-- If you don’t need the untracked file -->
rm src/utils/token.js
git checkout feature/auth-login
*/