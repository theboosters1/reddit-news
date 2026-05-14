/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./components/ThemeProvider";
import { SavedPostsProvider } from "./contexts/SavedPostsContext";
import { HomePage } from "./pages/HomePage";
import { CategoryPage } from "./pages/CategoryPage";
import { SavedPage } from "./pages/SavedPage";

export default function App() {
  return (
    <HelmetProvider>
      <SavedPostsProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/saved" element={<SavedPage />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </SavedPostsProvider>
    </HelmetProvider>
  );
}
