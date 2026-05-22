# ===================================================================
# fix-dashboard-layout-v2.ps1
# Removes <DashboardLayout> wrappers from student page files.
# FIXES the UTF-8 encoding bug from v1 (which corrupted emojis).
# Creates .bak2 backups (so it won't overwrite your existing .bak files).
# ===================================================================

$ErrorActionPreference = "Stop"

# UTF-8 WITHOUT BOM — for both reading and writing
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# Find files
$files = Get-ChildItem -Path .\pages -Recurse -Filter *.jsx |
         Select-String "import DashboardLayout" |
         Select-Object -ExpandProperty Path -Unique

if (-not $files) {
    Write-Host "No files found that still import DashboardLayout." -ForegroundColor Yellow
    exit 0
}

Write-Host "Found $($files.Count) file(s) to fix:" -ForegroundColor Cyan
$files | ForEach-Object { Write-Host "  - $_" }
Write-Host ""

$confirm = Read-Host "Proceed? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Aborted." -ForegroundColor Yellow
    exit 0
}

foreach ($file in $files) {
    Write-Host "Fixing: $file" -ForegroundColor Green

    # Backup with new extension
    Copy-Item -Path $file -Destination "$file.bak2" -Force

    # 🟢 KEY FIX: Read as UTF-8 explicitly — not as Windows-1252 default
    $content = [System.IO.File]::ReadAllText($file, $utf8NoBom)

    # 1. Remove the import line for DashboardLayout
    $content = $content -replace "(?m)^[ \t]*import\s+DashboardLayout\s+from\s+['""][^'""]+['""];?\s*\r?\n", ""

    # 2. Replace opening tag <DashboardLayout ...> with <>
    $content = $content -replace "(?s)<DashboardLayout[^<]*?>", "<>"

    # 3. Replace closing tag </DashboardLayout> with </>
    $content = $content -replace "</DashboardLayout>", "</>"

    # 🟢 KEY FIX: Write as UTF-8 (no BOM)
    [System.IO.File]::WriteAllText($file, $content, $utf8NoBom)
}

Write-Host ""
Write-Host "Done. Backups saved as *.bak2 next to each file." -ForegroundColor Cyan
