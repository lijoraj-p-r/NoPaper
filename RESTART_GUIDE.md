# 🔄 How to Restart the Application

## Proper Way to Restart

### Option 1: Use Stop Scripts (Recommended)

1. **Stop servers first:**
   ```powershell
   .\stop-servers.ps1
   ```
   or
   ```cmd
   stop-servers.bat
   ```

2. **Then start again:**
   ```powershell
   .\start-all.ps1
   ```
   or
   ```cmd
   start-all.bat
   ```

### Option 2: Use Start-All (Auto-Stops Existing)

The `start-all` scripts now automatically stop existing servers before starting new ones:

```powershell
.\start-all.ps1
```

or

```cmd
start-all.bat
```

## About the CancelledError

The `asyncio.exceptions.CancelledError` you see is **normal** when stopping the server. It's not an actual error - it's how Python's asyncio handles cancellation when you press Ctrl+C or stop the server.

### What causes it:
- Pressing Ctrl+C to stop the server
- Closing the terminal window
- Restarting the server while it's running

### Is it a problem?
**No!** This is expected behavior. The server stops correctly, it's just showing the internal cancellation mechanism.

## Manual Stop

If you need to stop servers manually:

### Stop Backend:
- Press `Ctrl+C` in the backend window
- Or close the backend terminal window

### Stop Frontend:
- Press `Ctrl+C` in the frontend window  
- Or close the frontend terminal window

### Stop All:
```powershell
.\stop-servers.ps1
```

## Troubleshooting

### "Port already in use" error:
- Run `stop-servers.ps1` first
- Wait 2-3 seconds
- Then start again

### Servers won't stop:
- Use `stop-servers.ps1` (force stops)
- Or manually kill processes:
  ```powershell
  Get-Process | Where-Object {$_.ProcessName -eq "python"} | Stop-Process -Force
  Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
  ```

---

**Remember:** The CancelledError is normal - your server is stopping correctly! ✅

