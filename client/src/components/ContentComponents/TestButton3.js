import React, { useState, useEffect } from "react";

// Zestaw przedmiotów w sklepie


function Shop({data}) {
  // Stan przechowujący przedmioty w inventarzu
  const [activeTab, setActiveTab] = useState("shop"); // Stan kontrolujący aktywną zakładkę ("shop" lub "inventory")
  const [shopItems, setShopItems] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({x:0, y: 0});
  const [tooltipContent, setTooltipContent] = useState(null);
  const [userItems, setUserItems] = useState([]);
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
    setUserItems(data.userItems);
    console.log(shopItems);
    }catch(error){
        console.error('Błąd pobierania sklepu:');
        return;
    }
  }
  const BuyItem = async (itemId) =>{
    const token = localStorage.getItem('token');
    if(!token){
      console.warn('Brak tokenu w localStorage');
      return;
    }
    try{
      const response = await fetch(`http://localhost:8080/api/BuyItem?itemId=${itemId}`,{
        method: 'GET',
        headers:{
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
      console.error('Błąd kupna:', response.statusText);
      return;
  }
    const data = await response.json();
    console.log(data, "dddddddd");
    setShopItems(data.ShopItems);
    setUserItems(data.userItems);
    console.log(shopItems);
    }catch(error){
        console.error('Błąd pobierania sklepu:');
        return;
    }
  }

  const SellItem = async (itemId) =>{
    const token = localStorage.getItem('token');
    if(!token){
      console.warn('Brak tokenu w localStorage');
      return;
    }
    try{
      const response = await fetch(`http://localhost:8080/api/SellItem?itemId=${itemId}`,{
        method: 'GET',
        headers:{
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
      console.error('Błąd kupna:', response.statusText);
      return;
  }
    const data = await response.json();
    console.log(data, "dddddddd");
    setShopItems(data.ShopItems);
    setUserItems(data.userItems);
    console.log(shopItems);
    }catch(error){
        console.error('Błąd pobierania sklepu:');
        return;
    }
  }
  // Funkcja dodająca przedmioty do inventarza
  

useEffect(()=>{
     const fetchShopData = async () => {
      await ShopData();
      
    } 
    fetchShopData();
  },[]);

  const NewShopRoll = async () =>{
    
    await ShopData(true);
     
  }
  const BuyItemClick = async (itemId) =>{
    await BuyItem(itemId);
  }
  const SellItemClick = async (itemId)=>{
    await SellItem(itemId);
  }

  const handleMouseEnter = (actualEvent, item) =>{
    const rect = actualEvent.currentTarget.getBoundingClientRect();
    setTooltipPosition({ x: actualEvent.pageX, y: actualEvent.pageY });
    setTooltipContent(item);
    setTooltipVisible(true);
  };

  const handleMouseMove = (event) => {
    setTooltipPosition({ x: event.pageX, y: event.pageY }); // Aktualizuj pozycję tooltipa podczas ruchu myszy
  };
  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };
  return (
    
    <div className="w-full h-full bg-black1 flex justify-center p-5 flex-col space-y-4">
      
      {shopItems ?(<>
      {/* Panel nawigacyjny */}
      
      <div className="flex justify-around w-full p-4 bg-maincolor1 rounded-xl mb-4 shadow-lg sticky top-0 z-10">
        {/* Przycisk przełączający na widok sklepu */}
        <button onClick={() => setActiveTab("shop")} className="text-maincolor4 text-lg hover:text-blue-600 transition-all">
          Shop
        </button>
        {/* Przycisk przełączający na widok inventarza */}
        <button onClick={() => setActiveTab("inventory")} className="text-maincolor4 text-lg hover:text-blue-600 transition-all">
          Inventory
        </button>

        <button onClick={NewShopRoll} className="text-maincolor4 text-lg hover:text-blue-600 transition-all">
          New Shop
        </button>
      </div>

      {/* Widok sklepu */}
      {activeTab === "shop" && (
        <div className="flex-grow overflow-y-auto">
          {/* Lista przedmiotów do kupienia */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh]">
            {shopItems.map((item, index) => (
              <div key={item._id} className="bg-gradient-to-r from-maincolor1 to-black border-2 border-maincolor1 rounded-xl p-4 shadow-xl transform hover:scale-105 transition-all" 
              onMouseEnter={(event) => handleMouseEnter(event, item)} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
                {/* Obraz przedmiotu */}
                <img src={`images/${item.photo}.png`} alt={item.name} className="w-full h-32 object-cover rounded-xl mb-2 border-4 border-maincolor4 shadow-md" />
                {/* Nazwa przedmiotu */}
                <h3 className="text-xl text-maincolor4 mb-2 font-bold">{item.name}</h3>
                {/* Opis przedmiotu */}
                <p className="text-maincolor4 text-sm mb-2">{item.description}</p>
                {/* Cena przedmiotu */}
                <p className="text-maincolor4 font-bold mt-2">Price: {item.price} coins</p>
                {/* Przycisk dodania do inventarza */}
                
                <button
                  onClick={()=>BuyItemClick(item._id)}
                  className="mt-3  bg-gradient-to-r from-maincolor2 to-maincolor5 text-black py-2 px-4 rounded-lg hover:bg-green-700 transition-all"
                >
                  Buy item
                </button>
              </div>
              
            ))}
          </div>
          {tooltipVisible && (
      <div
        style={{
          position: "fixed",
          top: tooltipPosition.y+10,
          left: tooltipPosition.x+10,
          zIndex: 10,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "8px",
          borderRadius: "20px",
          
        }}
        className={`border-4  ${tooltipContent?.element === "fire"
        ? "border-red-500"
        : tooltipContent?.element === "water"
        ? "border-cyan-500"
        : tooltipContent?.element === "nature"
        ? "border-green-400"
        : tooltipContent?.element === "light"
        ? "border-yellow-500"
        : tooltipContent?.element === "dark"
        ? "border-purple-900"
        : "border-white"} `}
      >
        <h4 className="text-2xl font-bold">{tooltipContent?.name}</h4>
        <img className="w-20 h-20" src={`images/${tooltipContent?.photo}.png`}></img>
        <p className="text-lg font-bold">TYPE: {tooltipContent?.type} </p>
        {tooltipContent?.power !== 0  &&(
        <p>POWER: +{tooltipContent?.power}</p>)}
        {tooltipContent?.vitality !== 0  &&(
        <p>VITALITY: +{tooltipContent?.vitality}</p>)}
        {tooltipContent?.strength !== 0  &&(
        <p>STRENGTH: +{tooltipContent?.strength}</p>)}
        {tooltipContent?.dexterity !== 0  &&(
        <p>DEXTERITY: +{tooltipContent?.dexterity}</p>)}
        {tooltipContent?.intelligence !== 0  &&(
        <p>INTELLIGENCE: +{tooltipContent?.intelligence}</p>)}
        {tooltipContent?.armor !== 0  &&(
        <p>ARMOR: +{tooltipContent?.armor}</p>)}
        <p><span>ELEMENT: </span>{" "}<span className={` ${
    tooltipContent?.element === "fire"
      ? "text-red-500"
      : tooltipContent?.element === "water"
      ? "text-cyan-500"
      : tooltipContent?.element === "nature"
      ? "text-green-400"
      : tooltipContent?.element === "light"
      ? "text-yellow-500"
      : tooltipContent?.element === "dark"
      ? "text-purple-900"
      : "text-white"} font-bold`}>{tooltipContent?.element}</span></p>
        
      </div>
    )}
        </div>
      )}

      {/* Widok inventarza */}
      {activeTab === "inventory" && (
        <div className="flex-grow overflow-y-auto ">
          {/* Lista przedmiotów w inventarzu */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userItems.length === 0 ? (
              // Wyświetla komunikat, gdy inventarz jest pusty
              <p className="text-maincolor4 text-center">Twój inventarz jest pusty!</p>
            ) : (
              // Wyświetla przedmioty w inventarzu
              userItems.map((item, index) => (
                <div key={item._id} className="bg-maincolor1 rounded-xl p-4 shadow-xl transform hover:scale-105 transition-all"
                onMouseEnter={(event) => handleMouseEnter(event, item)} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
                  {/* Obraz przedmiotu */}
                  <img src={`images/${item.photo}.png`} alt={item.name} className="w-full h-32 object-cover rounded-xl mb-2 border-4 border-maincolor4 shadow-md" />
                  {/* Nazwa przedmiotu */}
                  <h3 className="text-xl text-maincolor4 mb-2 font-bold">{item.name}</h3>
                  {/* Opis przedmiotu */}
                  <p className="text-maincolor4 text-sm mb-2">{item.description}</p>
                  <p className="text-maincolor4 font-bold mt-2">Sell value: {Math.round(item.price / 3)} coins</p>
                {/* Przycisk dodania do inventarza */}
                
                <button
                  onClick={()=>SellItemClick(item._id)}
                  className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all"
                >
                  Sell item
                </button>
                </div>
              ))
            )}
          </div>
          {tooltipVisible && (
      <div
        style={{
          position: "fixed",
          top: tooltipPosition.y+10,
          left: tooltipPosition.x+10,
          zIndex: 10,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "8px",
          borderRadius: "20px",
          
        }}
        className={`border-4  ${tooltipContent?.element === "fire"
        ? "border-red-500"
        : tooltipContent?.element === "water"
        ? "border-cyan-500"
        : tooltipContent?.element === "nature"
        ? "border-green-400"
        : tooltipContent?.element === "light"
        ? "border-yellow-500"
        : tooltipContent?.element === "dark"
        ? "border-purple-900"
        : "border-white"} `}
      >
        <h4 className="text-2xl font-bold">{tooltipContent?.name}</h4>
        <img className="w-20 h-20" src={`images/${tooltipContent?.photo}.png`}></img>
        <p className="text-lg font-bold">TYPE: {tooltipContent?.type} </p>
        {tooltipContent?.power !== 0  &&(
        <p>POWER: +{tooltipContent?.power}</p>)}
        {tooltipContent?.vitality !== 0  &&(
        <p>VITALITY: +{tooltipContent?.vitality}</p>)}
        {tooltipContent?.strength !== 0  &&(
        <p>STRENGTH: +{tooltipContent?.strength}</p>)}
        {tooltipContent?.dexterity !== 0  &&(
        <p>DEXTERITY: +{tooltipContent?.dexterity}</p>)}
        {tooltipContent?.intelligence !== 0  &&(
        <p>INTELLIGENCE: +{tooltipContent?.intelligence}</p>)}
        {tooltipContent?.armor !== 0  &&(
        <p>ARMOR: +{tooltipContent?.armor}</p>)}
        <p><span>ELEMENT: </span>{" "}<span className={` ${
    tooltipContent?.element === "fire"
      ? "text-red-500"
      : tooltipContent?.element === "water"
      ? "text-cyan-500"
      : tooltipContent?.element === "nature"
      ? "text-green-400"
      : tooltipContent?.element === "light"
      ? "text-yellow-500"
      : tooltipContent?.element === "dark"
      ? "text-purple-900"
      : "text-white"} font-bold`}>{tooltipContent?.element}</span></p>
        
      </div>
    )}
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