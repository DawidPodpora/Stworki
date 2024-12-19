import React, { useState } from "react";

// Zestaw przedmiotów w sklepie
const itemsForSale = [
  { id: 1, name: "Miecz ognisty", price: 100, image: "/images/sword.png", description: "Potężny miecz, który zadaje obrażenia ogniste." },
  { id: 2, name: "Zbroja wulkaniczna", price: 200, image: "/images/armor.png", description: "Wysokiej jakości zbroja, odporna na ogień." },
  { id: 3, name: "Amulet smoka", price: 150, image: "/images/amulet.png", description: "Amulet, który zwiększa siłę ataku." },
  { id: 4, name: "Eliksir zdrowia", price: 50, image: "/images/potion.png", description: "Eliksir przywracający 50 punktów zdrowia." },
  { id: 5, name: "Tarcza Ognia", price: 120, image: "/images/shield.png", description: "Tarcza chroniąca przed ogniem i magią." },
  { id: 6, name: "Topór Wojenny", price: 180, image: "/images/axe.png", description: "Topór, który zadaje duże obrażenia w walce wręcz." },
  { id: 7, name: "Pierścień Mocy", price: 300, image: "/images/ring.png", description: "Pierścień, który zwiększa twoją moc bojową." },
  { id: 8, name: "Zbroja Lwa", price: 250, image: "/images/lionshield.png", description: "Zbroja, która zwiększa wytrzymałość i odporność." },
  { id: 9, name: "Magiczna Księga", price: 400, image: "/images/book.png", description: "Księga zawierająca potężne zaklęcia." },
  { id: 10, name: "Łuk Królewski", price: 220, image: "/images/bow.png", description: "Łuk używany przez królewskich łuczników, zadaje precyzyjne obrażenia." },
  { id: 11, name: "Tarcza Królewska", price: 300, image: "/images/royalshield.png", description: "Tarcza wykorzystywana przez królewskich strażników." },
  { id: 12, name: "Kleopatra's Jewel", price: 500, image: "/images/jewel.png", description: "Cenny klejnot, który dodaje bonusy do każdej statystyki." },
  { id: 13, name: "Miecz Błyskawic", price: 350, image: "/images/lightningsword.png", description: "Miecz, który zadaje obrażenia elektryczne." },
  { id: 14, name: "Zbroja Cienia", price: 400, image: "/images/shadowarmor.png", description: "Zbroja zwiększająca szybkość i wytrzymałość." },
  { id: 15, name: "Płaszcz Wiatru", price: 120, image: "/images/windcloak.png", description: "Płaszcz, który zwiększa szybkość ruchu i obronność." }
];

function Shop({data}) {
  const [inventory, setInventory] = useState([]); // Stan przechowujący przedmioty w inventarzu
  const [activeTab, setActiveTab] = useState("shop"); // Stan kontrolujący aktywną zakładkę ("shop" lub "inventory")

  // Funkcja dodająca przedmioty do inventarza
  const addToInventory = (item) => {
    setInventory([...inventory, item]); // Dodaje nowy przedmiot do obecnej listy w inventarzu
  };

  return (
    <div className="w-full h-full bg-black1 flex justify-center p-5 flex-col space-y-4">
      {/* Panel nawigacyjny */}
      <div className="flex justify-around w-full p-4 bg-maincolor1 rounded-xl mb-4 shadow-lg sticky top-0 z-10">
        {/* Przycisk przełączający na widok sklepu */}
        <button onClick={() => setActiveTab("shop")} className="text-maincolor4 text-lg hover:text-blue-600 transition-all">
          Sklep
        </button>
        {/* Przycisk przełączający na widok inventarza */}
        <button onClick={() => setActiveTab("inventory")} className="text-maincolor4 text-lg hover:text-blue-600 transition-all">
          Inventarz
        </button>
      </div>

      {/* Widok sklepu */}
      {activeTab === "shop" && (
        <div className="flex-grow overflow-y-auto">
          {/* Lista przedmiotów do kupienia */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh]">
            {itemsForSale.map((item) => (
              <div key={item.id} className="bg-maincolor1 rounded-xl p-4 shadow-xl transform hover:scale-105 transition-all">
                {/* Obraz przedmiotu */}
                <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-xl mb-2 border-4 border-maincolor4 shadow-md" />
                {/* Nazwa przedmiotu */}
                <h3 className="text-xl text-maincolor4 mb-2 font-bold">{item.name}</h3>
                {/* Opis przedmiotu */}
                <p className="text-maincolor4 text-sm mb-2">{item.description}</p>
                {/* Cena przedmiotu */}
                <p className="text-maincolor4 font-bold mt-2">Cena: {item.price} diamentykow</p>
                {/* Przycisk dodania do inventarza */}
                <button
                  onClick={() => addToInventory(item)}
                  className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all"
                >
                  Dodaj do inventarza
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Widok inventarza */}
      {activeTab === "inventory" && (
        <div className="flex-grow overflow-y-auto max-h-[60vh]">
          {/* Lista przedmiotów w inventarzu */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {inventory.length === 0 ? (
              // Wyświetla komunikat, gdy inventarz jest pusty
              <p className="text-maincolor4 text-center">Twój inventarz jest pusty!</p>
            ) : (
              // Wyświetla przedmioty w inventarzu
              inventory.map((item, index) => (
                <div key={index} className="bg-maincolor1 rounded-xl p-4 shadow-xl transform hover:scale-105 transition-all">
                  {/* Obraz przedmiotu */}
                  <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-xl mb-2 border-4 border-maincolor4 shadow-md" />
                  {/* Nazwa przedmiotu */}
                  <h3 className="text-xl text-maincolor4 mb-2 font-bold">{item.name}</h3>
                  {/* Opis przedmiotu */}
                  <p className="text-maincolor4 text-sm mb-2">{item.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Shop; 