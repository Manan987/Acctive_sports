# copy-catalogue-images.ps1
# Copies all images from CATALOUGE/* into public/uploads/
# keeping a flat structure with safe, URL-friendly filenames.

$root    = Split-Path -Parent $PSScriptRoot        # repo root
$src     = Join-Path $root "CATALOUGE"
$dst     = Join-Path $root "public\uploads"

Write-Host "Source : $src"
Write-Host "Dest   : $dst"

# Collect every image file recursively
$images = Get-ChildItem -Path $src -Recurse -Include "*.jpeg","*.jpg","*.png","*.webp"

$copied = 0
foreach ($img in $images) {
    # Build a safe filename: replace spaces / special chars with underscores
    $safe = $img.Name -replace '[^a-zA-Z0-9._-]', '_'

    # Prefix with parent folder name so names stay unique across categories
    $parentSafe = $img.DirectoryName.Split('\')[-1] -replace '[^a-zA-Z0-9._-]', '_'
    $destName   = "${parentSafe}__${safe}"
    $destFile   = Join-Path $dst $destName

    if (-not (Test-Path $destFile)) {
        Copy-Item $img.FullName $destFile
        $copied++
    }
}

Write-Host "✅  Copied $copied new images to public/uploads/"
