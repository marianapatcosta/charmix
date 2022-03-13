# build
npm run prebuild

# navigate into the build output directory
cd dist


git init
git checkout -b main
git add -A
git commit -m 'deploy'

git push -f git@github.com:marianapatcosta/charmix.git main:gh-pages

cd -