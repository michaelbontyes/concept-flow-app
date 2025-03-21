#!/bin/bash

# Remove .next directory from git tracking without deleting the files
git rm -r --cached .next
echo ".next directory removed from git tracking"
echo "Make sure to commit this change with: git commit -m 'Stop tracking .next directory'"