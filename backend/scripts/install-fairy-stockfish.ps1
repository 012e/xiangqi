param (
    [string]$DownloadUrl = "https://github.com/fairy-stockfish/Fairy-Stockfish/releases/latest/download/fairy-stockfish-largeboard_x86-64.exe",
    [string]$ToolName = "fairy-stockfish.exe",
    [string]$InstallDir = "$env:USERPROFILE\AppData\Local\Microsoft\WindowsApps"
)


# Create the install directory if it doesn't exist
if (-not (Test-Path -Path $InstallDir)) {
    New-Item -ItemType Directory -Path $InstallDir | Out-Null
}

# Set full install path
$ToolPath = Join-Path -Path $InstallDir -ChildPath $ToolName

# Download the tool
Write-Host "Downloading $ToolName..."
Invoke-WebRequest -Uri $DownloadUrl -OutFile $ToolPath

# Make executable (optional: if .exe already executable)
# Unblock-File -Path $ToolPath

# Add install directory to PATH if not already there
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($currentPath -notlike "*$InstallDir*") {
    Write-Host "Adding $InstallDir to PATH..."
    $newPath = "$currentPath;$InstallDir"
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
} else {
    Write-Host "$InstallDir already in PATH."
}

Write-Host "`nInstallation complete. Restart your terminal to use '$ToolName'."
