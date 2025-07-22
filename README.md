
## MongoDB Integration

This project uses MongoDB via Mongoose for data storage.

### Setup
1. Create a `.env.local` file in the root of the `project` directory.
2. Add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
   ```
3. Install dependencies (already included):
   ```bash
   npm install mongoose
   ```

### Usage
- Use the `dbConnect` utility from `lib/mongodb.ts` to connect to MongoDB in your API routes or server components. 