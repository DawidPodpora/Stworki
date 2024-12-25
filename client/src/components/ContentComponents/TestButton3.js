import React, { useState, useEffect } from "react";

// Zestaw przedmiotów w sklepie


function Shop({data}) {
  const [inventory, setInventory] = useState([]); // Stan przechowujący przedmioty w inventarzu
  const [activeTab, setActiveTab] = useState("shop"); // Stan kontrolujący aktywną zakładkę ("shop" lub "inventory")
  const [shopItems, setShopItems] = useState([]);
  const [newShopForMoney, setNewShopForMoney] = useState(false);
  const ShopData = async (newShopForMoney = false) =>{
    const token = localStorage.getItem('token');
    if(!token){
      console.warn('Brak tokenu w localStorage');
      return;
    }
    try{
      const response = await fetch(`http://localhost:8080/api/ItemShop?newShopForMoney=${newShopForMoney}`,{
        method: 'GET',
        headers:{
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
      console.error('Błąd pobierania sklepu:', response.statusText);
      return;
  }
    const data = await response.json();
    console.log(data);
    setShopItems(data.ShopItems);
    console.log(shopItems);
    }catch(error){
        console.error('Błąd pobierania sklepu:');
        return;
    }
  }
  // Funkcja dodająca przedmioty do inventarza
  const addToInventory = (item) => {
    setInventory([...inventory, item]); // Dodaje nowy przedmiot do obecnej listy w inventarzu
  };

useEffect(()=>{
     const fetchShopData = async () => {
      await ShopData();
      
    } 
    fetchShopData();
  },[]);

  const NewShopRoll = async () =>{
    
    await ShopData(true);
    
    
  }
  return (
    
    <div className="w-full h-full bg-black1 flex justify-center p-5 flex-col space-y-4">
      
      {shopItems ?(<>
      {/* Panel nawigacyjny */}
      {console.log( shopItems,'itemek')}
      <div className="flex justify-around w-full p-4 bg-maincolor1 rounded-xl mb-4 shadow-lg sticky top-0 z-10">
        {/* Przycisk przełączający na widok sklepu */}
        <button onClick={() => setActiveTab("shop")} className="text-maincolor4 text-lg hover:text-blue-600 transition-all">
          Sklep
        </button>
        {/* Przycisk przełączający na widok inventarza */}
        <button onClick={() => setActiveTab("inventory")} className="text-maincolor4 text-lg hover:text-blue-600 transition-all">
          Inventarz
        </button>

        <button onClick={NewShopRoll} className="text-maincolor4 text-lg hover:text-blue-600 transition-all">
          Nowy Sklep
        </button>
      </div>

      {/* Widok sklepu */}
      {activeTab === "shop" && (
        <div className="flex-grow overflow-y-auto">
          {/* Lista przedmiotów do kupienia */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh]">
            {shopItems.map((item, index) => (
              <div key={item._id} className="bg-maincolor1 rounded-xl p-4 shadow-xl transform hover:scale-105 transition-all">
                {/* Obraz przedmiotu */}
                <img src={`images/${item.photo}.png`} alt={item.name} className="w-full h-32 object-cover rounded-xl mb-2 border-4 border-maincolor4 shadow-md" />
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
      </>
    ): (
  <div>Loading...</div> // Wyświetlanie komunikatu ładowania
)}
    </div>
  );
}

export default Shop; 