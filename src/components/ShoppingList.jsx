import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, ShoppingBasket, Plus } from "lucide-react";
import toast from "react-hot-toast";

export const ShoppingList = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load items from localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      setItems([]);
      setLoaded(false);
      return;
    }

    const savedItems = JSON.parse(
      localStorage.getItem("recipeBoxShoppingList") || "[]",
    );

    setItems(savedItems);
    setLoaded(true);
  }, [isLoggedIn]);

  // Save items to localStorage
  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem("recipeBoxShoppingList", JSON.stringify(items));
  }, [items, loaded]);

  function handleAddItem() {
    if (item.trim() === "") {
      toast.error("Please enter an item");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: item.trim(),
      completed: false,
    };

    setItems((prev) => [...prev, newItem]);
    setItem("");

    toast.success("Item added");
  }

  function handleCheck(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
            }
          : item,
      ),
    );
  }

  function handleDelete(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));

    toast.success("Item removed");
  }

  // Login required
  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <ShoppingBasket className="h-8 w-8 text-green-900" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-green-950">
            Login Required
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            You need to login to use your shopping list.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-950 px-6 py-3 font-semibold text-white transition hover:bg-green-900 active:scale-95"
          >
            Login
          </button>

          <button
            onClick={() => navigate(-1)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-95"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 lg:pb-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 rounded-xl px-3 py-2 text-green-900 transition hover:bg-green-100 active:scale-95"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>

        {/* Heading */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
              <ShoppingBasket className="h-6 w-6 text-green-900" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-green-950 sm:text-3xl">
                Shopping List
              </h1>

              <p className="text-sm text-gray-500">
                Add ingredients or items you need to buy.
              </p>
            </div>
          </div>
        </div>

        {/* Add Item */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddItem();
                }
              }}
              placeholder="Enter an item..."
              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-100 sm:text-base"
            />

            <button
              onClick={handleAddItem}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-950 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-900 hover:shadow-md active:scale-95"
            >
              <Plus className="size-5" />
              Add Item
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Your Items</h2>

            {items.length > 0 && (
              <span className="text-sm text-gray-500">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <ShoppingBasket className="mx-auto h-10 w-10 text-gray-300" />

              <h3 className="mt-3 font-semibold text-gray-700">
                Your shopping list is empty
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Add your first item above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition ${
                    item.completed ? "opacity-70" : "hover:shadow-md"
                  }`}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleCheck(item.id)}
                    className="h-5 w-5 shrink-0 cursor-pointer accent-green-800"
                  />

                  {/* Item Name */}
                  <span
                    className={`min-w-0 flex-1 break-words text-sm sm:text-base ${
                      item.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {item.name}
                  </span>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="shrink-0 rounded-xl p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700 active:scale-95"
                    title="Delete item"
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
