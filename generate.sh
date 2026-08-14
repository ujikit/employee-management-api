#!/usr/bin/env bash

set -e

echo "🛠️ Step 1: Updating build script in package.json to include tsc-alias..."
# Update package.json build script to run tsc-alias post-build
npx npm-add-script -k "build" -v "prisma generate && nest build && tsc-alias" --force

echo "🛠️ Step 2: Updating nest-cli.json to copy JSON assets..."
cat << 'EOF' > nest-cli.json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "assets": [
      {
        "include": "commons/**/*.json",
        "outDir": "dist"
      }
    ]
  }
}
EOF

echo "📂 Step 3: Checking translation files in src/commons/i18n..."
I18N_DIR="src/commons/i18n"
if [ ! -d "$I18N_DIR" ]; then
  mkdir -p "$I18N_DIR/en" "$I18N_DIR/zh"

  cat << 'EOF' > "$I18N_DIR/en/translation.json"
{
  "CLASS_VALIDATION": {
    "IS_NOT_EMPTY": "Field must not be empty",
    "IS_INT": "Field must be an integer",
    "YYYY_MM_DD": "Date format must be YYYY-MM-DD",
    "IS_STRING": "Field must be a string",
    "IS_NUMBER": "Field must be a number"
  }
}
EOF

  cat << 'EOF' > "$I18N_DIR/zh/translation.json"
{
  "CLASS_VALIDATION": {
    "IS_NOT_EMPTY": "字段不能为空",
    "IS_INT": "字段必须是整数",
    "YYYY_MM_DD": "日期格式必须为 YYYY-MM-DD",
    "IS_STRING": "字段必须是字符串",
    "IS_NUMBER": "字段必须是数字"
  }
}
EOF
  echo "✅ Created default translation files in $I18N_DIR"
fi

echo "🧹 Step 4: Cleaning up build cache..."
rm -rf dist node_modules/.prisma

echo "🏗️ Step 5: Building project with Prisma, NestJS, and tsc-alias..."
yarn build

echo "📤 Step 6: Committing changes and pushing to Vercel..."
git add package.json nest-cli.json vercel.json src/

git commit -m "fix: integrate tsc-alias into build script and bundle i18n assets" || echo "ℹ️ No changes to commit."

git push

echo "----------------------------------------"
echo "🎉 Fixed! Vercel redeployment triggered."