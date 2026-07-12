#!/usr/bin/env bash
# upload-media.sh — 大文件直传 GitHub Repo（绕过 PagesCMS 的上传限制）
# 用法: bash upload-media.sh <文件路径>
# 示例: bash upload-media.sh D:/Downloads/my-tool.exe

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "❌ 用法: bash upload-media.sh <文件路径>"
  echo "   示例: bash upload-media.sh ./my-tool.exe"
  exit 1
fi

FILE="$1"
if [ ! -f "$FILE" ]; then
  echo "❌ 文件不存在: $FILE"
  exit 1
fi

# 配置 —— 改成你的信息
REPO="MEMZ-SYSTEM-CORE/PageCMS"
BRANCH="master"
MEDIA_DIR="public/media"

# 文件名
FILENAME=$(basename "$FILE")
TARGET_PATH="${MEDIA_DIR}/${FILENAME}"
FILESIZE=$(stat -c%s "$FILE" 2>/dev/null || stat -f%z "$FILE" 2>/dev/null)
FILESIZE_MB=$(( FILESIZE / 1048576 ))

echo "📦 文件名: $FILENAME"
echo "📏 大小: ${FILESIZE_MB}MB"
echo "📂 目标: $TARGET_PATH"
echo "🌐 仓库: $REPO ($BRANCH)"
echo ""

# 检查 gh 是否安装
if ! command -v gh &>/dev/null; then
  echo "❌ 需要 GitHub CLI (gh)，请先安装:"
  echo "   https://cli.github.com/"
  echo "   安装后运行: gh auth login"
  exit 1
fi

# 检查 gh 认证
if ! gh auth status &>/dev/null; then
  echo "❌ 未登录 GitHub CLI，请运行: gh auth login"
  exit 1
fi

# GitHub 文件大小限制检测
if [ "$FILESIZE" -gt 104857600 ]; then
  echo "⚠️  文件超过 100MB，GitHub 不支持超过 100MB 的文件！"
  echo "   建议使用 Cloudflare R2 或其他对象存储。"
  exit 1
fi

echo "🚀 正在上传到 $REPO ..."

# 读取文件内容为 base64
echo "⏳ 编码文件中..."
BASE64=$(base64 -w0 "$FILE" 2>/dev/null || base64 "$FILE")

# 获取当前文件 SHA（如果已存在则更新）
EXISTING_SHA=$(gh api "repos/$REPO/contents/$TARGET_PATH?ref=$BRANCH" --jq '.sha' 2>/dev/null || echo "")

COMMIT_MSG="📎 上传媒体: $FILENAME"

if [ -n "$EXISTING_SHA" ]; then
  echo "♻️  文件已存在，覆盖更新..."
  gh api "repos/$REPO/contents/$TARGET_PATH" \
    --method PUT \
    --field message="$COMMIT_MSG" \
    --field content="$BASE64" \
    --field sha="$EXISTING_SHA" \
    --field branch="$BRANCH" > /dev/null
else
  echo "✨ 上传新文件..."
  gh api "repos/$REPO/contents/$TARGET_PATH" \
    --method PUT \
    --field message="$COMMIT_MSG" \
    --field content="$BASE64" \
    --field branch="$BRANCH" > /dev/null
fi

echo ""
echo "✅ 上传完成！"
echo "🔗 引用链接: /media/$FILENAME"
echo ""
echo "📝 在文章正文粘贴以下内容即可自动渲染："
echo "   /media/$FILENAME"
