# upload-media.ps1 — 大文件直传 GitHub Repo（绕过 PagesCMS 上传限制）
# 用法: .\upload-media.ps1 <文件路径>
# 示例: .\upload-media.ps1 D:\Downloads\my-tool.exe

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$FilePath
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $FilePath)) {
    Write-Host "❌ 文件不存在: $FilePath" -ForegroundColor Red
    exit 1
}

# 配置 —— 改成你的信息
$REPO = "MEMZ-SYSTEM-CORE/PageCMS"
$BRANCH = "master"
$MEDIA_DIR = "public/media"

$FileItem = Get-Item $FilePath
$FILENAME = $FileItem.Name
$FILESIZE = $FileItem.Length
$FILESIZE_MB = [math]::Round($FILESIZE / 1MB, 2)
$TARGET_PATH = "$MEDIA_DIR/$FILENAME"

Write-Host "📦 文件名: $FILENAME"
Write-Host "📏 大小: ${FILESIZE_MB}MB"
Write-Host "📂 目标: $TARGET_PATH"
Write-Host "🌐 仓库: $REPO ($BRANCH)"
Write-Host ""

# 检查 gh 是否安装
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 需要 GitHub CLI (gh)，请先安装:" -ForegroundColor Red
    Write-Host "   https://cli.github.com/"
    Write-Host "   安装后运行: gh auth login"
    exit 1
}

# 检查 gh 认证
$AuthStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 未登录 GitHub CLI，请运行: gh auth login" -ForegroundColor Red
    exit 1
}

# GitHub 文件大小限制检测
if ($FILESIZE -gt 104857600) {
    Write-Host "⚠️  文件超过 100MB，GitHub 不支持超过 100MB 的文件！" -ForegroundColor Yellow
    Write-Host "   建议使用 Cloudflare R2 或其他对象存储。"
    exit 1
}

Write-Host "🚀 正在上传到 $REPO ..." -ForegroundColor Green

# 读取文件内容为 base64
Write-Host "⏳ 编码文件中..." -ForegroundColor Yellow
$BASE64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($FilePath))

# 获取当前文件 SHA（如果已存在则更新）
$EXISTING_SHA = gh api "repos/$REPO/contents/$TARGET_PATH`?ref=$BRANCH" --jq '.sha' 2>$null

$COMMIT_MSG = "📎 上传媒体: $FILENAME"

if ($EXISTING_SHA) {
    Write-Host "♻️  文件已存在，覆盖更新..." -ForegroundColor Yellow
    gh api "repos/$REPO/contents/$TARGET_PATH" `
        --method PUT `
        --field message="$COMMIT_MSG" `
        --field content="$BASE64" `
        --field sha="$EXISTING_SHA" `
        --field branch="$BRANCH" > $null
} else {
    Write-Host "✨ 上传新文件..." -ForegroundColor Green
    gh api "repos/$REPO/contents/$TARGET_PATH" `
        --method PUT `
        --field message="$COMMIT_MSG" `
        --field content="$BASE64" `
        --field branch="$BRANCH" > $null
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 上传失败！" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ 上传完成！" -ForegroundColor Green
Write-Host "🔗 引用链接: /media/$FILENAME"
Write-Host ""
Write-Host "📝 在文章正文粘贴以下内容即可自动渲染：" -ForegroundColor Cyan
Write-Host "   /media/$FILENAME"
