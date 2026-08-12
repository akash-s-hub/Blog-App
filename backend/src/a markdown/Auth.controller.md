# Auth Functions — Quick Reference

## `registerUser`
1. Extract `username`, `email`, `password`, `bio`, `role` from the request body.
2. Reject if `username`, `email`, or `password` is missing.
3. Check the DB for an existing user with the same `username` or `email`.
4. If found, tell the client exactly which field (username or email) is already taken.
5. If an avatar file was uploaded, upload it to Cloudinary.
6. Create the new user in the database, attaching the avatar URL if there is one.
7. Generate a fresh access token and refresh token for the new user.
8. Save the refresh token onto the user document.
9. Set both tokens as cookies on the response.
10. Respond `201` with the new user's safe (non-sensitive) data.

## `loginUser`
1. Extract `identifier` (username or email) and `password` from the request body.
2. Reject if either is missing.
3. Find the user matching `identifier` on either `username` or `email`, including their password hash.
4. Reject with a generic "Invalid credentials" if no user is found or the password doesn't match.
5. Generate a new access token and refresh token.
6. Save the new refresh token onto the user document.
7. Set both tokens as cookies.
8. Respond `200` with the user's safe data.

## `getMe`
1. Return `req.user` (already attached by earlier auth middleware) as the response.

## `updateMe`
*(Not implemented yet — placeholder.)*

## `updatePassword`
1. Extract `identifier`, current `password`, and `newPassword` from the request body.
2. Reject if any field is missing.
3. Find the user and verify the current password is correct.
4. Generate a new access token and refresh token.
5. Update the user's password and refresh token, then save.
6. Set the new tokens as cookies.
7. Respond `200` confirming the password change.

## `logoutUser`
1. Read the refresh token from cookies.
2. If present, find the matching user in the DB and null out their stored refresh token.
3. Clear both cookies from the client.
4. Respond `200` confirming logout.

## `refreshAccessToken`
1. Read the refresh token from cookies.
2. Reject if it's missing.
3. Verify and decode the token to get the user ID.
4. Look up the user and confirm the stored refresh token matches the incoming one.
5. Generate a new access token and refresh token.
6. Save the new refresh token onto the user document.
7. Set the new tokens as cookies.
8. Respond `200` confirming the refresh succeeded.