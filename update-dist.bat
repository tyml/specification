cd spec-viewer
copy style.css ..\dist\style.css
node dist-cli/console.js ../SPEC.tyml --out=../dist
