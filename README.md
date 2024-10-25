# iVisionary Clone

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory and add your Stripe publishable key:

   ```
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   ```

4. Run the development server: `npm run dev`

## Important Notes

- Make sure to replace `your_stripe_publishable_key_here` with your actual Stripe publishable key in the `.env` file.
- Never commit your `.env` file to version control. It's already added to `.gitignore`.
- If you're deploying this application, make sure to set the `VITE_STRIPE_PUBLISHABLE_KEY` environment variable in your deployment environment.