# Setting Up MongoDB Atlas for F1 World Champion App

This guide will walk you through connecting your F1 World Champion application to MongoDB Atlas.

## Step 1: Create MongoDB Atlas Account & Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create an account or log in
2. Create a new project (or use an existing one)
3. Click "Build a Database" and choose the free tier option
4. Select your preferred cloud provider and region
5. Name your cluster (default is "Cluster0")
6. Click "Create" and wait for the cluster to be created (this may take a few minutes)

## Step 2: Configure Database Access

1. In the left sidebar, click "Database Access" under the Security section
2. Click "Add New Database User"
3. Set up a username and password (in your image, the username is "xlopotoon")
   - Use a strong password
   - Save the password in a secure location as you'll need it later
4. Set the user privileges to "Atlas admin" or "Read and write to any database"
5. Click "Add User"

## Step 3: Configure Network Access

1. In the left sidebar, click "Network Access" under Security
2. Click "Add IP Address"
3. To allow access from your current IP only, click "Add Current IP Address"
4. For development purposes, you can also allow access from anywhere by clicking "Allow Access from Anywhere" (not recommended for production)
5. Click "Confirm"

## Step 4: Get Your Connection String

1. In the left sidebar, click "Database" under Deployments
2. Click "Connect" for your cluster
3. Select "Connect your application"
4. Choose your driver and version (Node.js, version 6.7 or later)
5. Copy the connection string that looks like:
   ```
   mongodb+srv://xlopotoon:<password>@cluster0.fn3feji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
6. Replace `<password>` with the actual password you created in Step 2

## Step 5: Update Your Backend .env File

1. Open or create the `.env` file in your BackEnd directory
2. Update or add the MONGO_URI variable:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://xlopotoon:your_actual_password@cluster0.fn3feji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   NODE_ENV=development
   ```
3. Replace `your_actual_password` with the actual password you created in Step 2

## Step 6: Test the Connection

1. Start your backend server:
   ```
   cd BackEnd
   npm run dev
   ```
2. Check the console output to confirm that MongoDB is connected
   - You should see a message like: "MongoDB Connected: cluster0.fn3feji.mongodb.net"
3. If there are connection errors, verify:
   - Your password is correct
   - Your IP address is whitelisted
   - The connection string format is correct

## Additional Notes

- For production deployment, ensure you use environment variables and never commit your MongoDB password to source control
- Periodically review database access and rotate passwords for security
- MongoDB Atlas provides monitoring and alerting features that you can set up for your cluster
- Consider setting up database backups for production deployments 