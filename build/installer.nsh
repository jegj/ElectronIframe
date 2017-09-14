!include "EnvVarUpdate.nsh"
!macro preInit
    SetRegView 64
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Dealerbuilt\DBDash"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Dealerbuilt\DBDash"
    SetRegView 32
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Dealerbuilt\DBDash"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Dealerbuilt\DBDash"
    ${EnvVarUpdate} $0 "PATH" "A" "HKLM" "C:\Dealerbuilt\DBDash"
!macroend