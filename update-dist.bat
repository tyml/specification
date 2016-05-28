cd spec-viewer
copy style.css ..\Dist\style.css
jspm run src/console.tsx ../SPEC.tyml --out=../Dist
