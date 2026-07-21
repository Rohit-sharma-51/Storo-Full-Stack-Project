# Clear Existing Pending Bookings

## Quick Instructions

To clear all existing pending bookings from your database, follow these steps:

### Option 1: Using the HTTP Endpoint (Recommended)

1. Make sure your backend server is running
2. Open a new terminal or use a tool like Postman/Thunder Client
3. Send a DELETE request to:
   ```
   DELETE http://localhost:5000/api/admin/cleanup-pending
   ```

**Using curl:**
```bash
curl -X DELETE http://localhost:5000/api/admin/cleanup-pending
```

**Using PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/admin/cleanup-pending" -Method DELETE
```

### Option 2: Direct MongoDB Query

If you have MongoDB Compass or mongosh installed:

```javascript
db.bookings.deleteMany({ status: 'pending' })
```

### What Happens

The cleanup will:
- ✅ Delete all bookings with status "pending"
- ✅ Keep all bookings with status "booked" or "collected"
- ✅ Return the count of deleted bookings

### After Cleanup

Once you've cleared the existing pending bookings, the system will automatically:
- Create new bookings with "pending" status
- Update to "booked" when payment succeeds
- Delete "pending" bookings when payment fails or is cancelled
- Show only "booked" and "collected" bookings in the dashboard

### Security Note

> [!WARNING]
> The cleanup endpoint at `/api/admin/cleanup-pending` is currently unprotected. After running the cleanup once, you may want to:
> - Remove the route from `server.js`
> - Add authentication/authorization
> - Comment out the route import
