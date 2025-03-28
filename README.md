Best UI/UX at DevSoc HackaByte 2025!

### Inspiration

We've all been there – lost in a sea of endless threads on clunky, outdated educational forums.  Trying to find a simple answer to a homework question felt like navigating a labyrinth.  We saw how much time students (including ourselves!) were wasting, and how often these platforms *hindered* collaboration instead of helping it.  We were inspired by the *potential* of online forums for learning, but frustrated by the reality.  We wanted to build something better, something that leveraged modern technology to create a truly intuitive and *enjoyable* learning environment. We were particularly inspired by the advancements in AI, and how it could be used to organize and contextualize information. We'd also all experienced that feeling of needing to *vent* about a tough course or assignment, but not having a safe, appropriate outlet.

### What it does

EdButBetter is a reimagined educational forum designed for the modern student. It's built to be:

*   **Organized:** Clear sections for each course, lab, and assignment keep discussions focused.
*   **AI-Powered:** Our "What's Happening?" feature provides instant summaries of important announcements and popular threads, saving you time scrolling.  Our AI Assistant answers questions *based on the forum content itself*, providing contextually relevant help and preventing plagiarism.
*   **Engaging:** A clean, modern interface and the unique "Rant" feature (which turns your frustrations into harmless gibberish) make participation more enjoyable.
*   **Secure and Anonymous:** Students can ask questions and contribute without fear of judgment, thanks to anonymous posting options.
*   **Accessible:** Designed with a mobile-first approach, so you can access the forum on any device.

### How we built it

EdButBetter is built using a modern, robust tech stack:

*   **Frontend:** **React** forms the foundation of our interactive user interface. We used functional components with hooks (`useState`, `useEffect`, `useRef`) for efficient state management and side effects.  **React Router** handles navigation between different sections of the forum. **React Markdown** is used to beautifully render user-submitted content, supporting formatted text, code snippets, and more.

*   **UI Components:** We leveraged **Material-UI (MUI)** for a consistent and visually appealing design.  MUI's pre-built components (like `Box`, `Paper`, `Typography`, `Button`) allowed us to build quickly and maintain a professional look. We customized the MUI theme to create a unique visual identity.

*   **Backend:** **Firebase** provides the essential backend services.  **Firestore**, a NoSQL database, stores all forum data (threads, posts, user information).  **Firebase Authentication** manages user accounts securely and supports email/password and Google sign-in. We use Firestore's real-time listeners (`onSnapshot`) to keep the forum data updated instantly.

*   **State Management:**  We used a combination of React's built-in state management tools.  **React Context API** (specifically a `CacheContext`) is used for caching data fetched from the backend, reducing unnecessary API calls and improving performance. Local state is managed within components using `useState` hooks.

*   **Styling:**  We used **CSS-in-JS** through MUI's `sx` prop for styling. This allows us to write CSS directly within our React components, making styling more organized and maintainable.  A custom theme, with responsive typography, ensures a consistent look and feel across different screen sizes.  The design is **mobile-first**, ensuring a great experience on phones and tablets.

* **AI:** The "What's Happening?" and "AI Q/A" features utilize the Gemini API. We make API calls to the model passing system instructions to the model to answer based on the threads data only.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini AI API key
- Firebase project credentials

## Environment Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key
   ```

## Running the Application

### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:3001

### Production Build

1. Build the frontend:
   ```bash
   npm run build
   ```
2. Start the server:
   ```bash
   npm run server
   ```

## API Endpoints

- `/api/gemini-summary`: Generate AI-powered summaries of discussion threads
- `/api/ai-qa`: Get AI-assisted answers to questions based on forum content
- `/api/convert-to-emoji`: Convert text to emoji representation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
