import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import { Signup } from "./components/Signup";
import { Login } from "./components/Login";
import { ForgotPassword } from "./components/ForgotPassword";
import { SearchResult } from "./components/SearchResult";
import { SavedRecipes } from "./components/SavedRecipes";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { FullRecipe } from "./components/FullRecipe";
import { PageNotFound } from "./components/PageNotFound";
import { ShoppingList } from "./components/ShoppingList";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(localStorage.getItem("recipeBoxCurrentUser")),
  );

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

      <Route path="/forgot" element={<ForgotPassword />} />

      <Route
        path="/search"
        element={
          <SearchResult isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        }
      />

      <Route
        path="/myrecipes"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <SavedRecipes
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/shoppinglist"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <ShoppingList
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          </ProtectedRoute>
        }
      />

      <Route path="/recipe/:id" element={<FullRecipe />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
