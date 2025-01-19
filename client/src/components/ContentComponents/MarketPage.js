import React, { useState, useEffect } from "react";

const Market = () => {
    const [activeTab, setActiveTab] = useState("market"); // Domyślnie otwieramy Market
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipContent, setTooltipContent] = useState(null);
    const [userItems, setUserItems] = useState([]); // Przedmioty użytkownika
    const [marketItems, setMarketItems] = useState([]); // Przedmioty na markecie
    const [selectedItem, setSelectedItem] = useState(null);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [sellData, setSellData] = useState({ type: "fixed", price: "", duration: "2" });

    useEffect(() => {
        fetchMarketItems();
        fetchUserItems();
    }, []);

    /** 🔥 Pobieranie przedmiotów z marketu */
    const fetchMarketItems = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('Brak tokenu w localStorage');
            return;
        }

        try {
            console.log("🔄 Pobieram przedmioty z marketu...");
            const response = await fetch("http://localhost:8080/api/market", { 
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                console.error('❌ Błąd pobierania przedmiotów na markecie:', response.statusText);
                return;
            }

            const data = await response.json();
            console.log("✅ Market items API response:", data);
            
            // Naprawione mapowanie itemów, jeśli są zagnieżdżone
            setMarketItems(data.map(item => ({
                ...item,
                item: item.item?.item || item.item || {} // Upewniamy się, że `item` istnieje
            })));
        } catch (error) {
            console.error('❌ Błąd pobierania przedmiotów na markecie:', error);
        }
    };

    /** 🔥 Pobieranie ekwipunku użytkownika */
    const fetchUserItems = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('Brak tokenu w localStorage');
            return;
        }

        try {
            console.log("🔄 Pobieram ekwipunek użytkownika...");
            const response = await fetch("http://localhost:8080/api/usersCreaturesAndItemsData", { 
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                console.error('❌ Błąd pobierania ekwipunku:', response.statusText);
                return;
            }

            const data = await response.json();
            console.log("✅ User items API response:", data);
            setUserItems(data.items || []);
        } catch (error) {
            console.error('❌ Błąd pobierania ekwipunku:', error);
        }
    };

    /** 🔥 Tooltipy */
    const handleMouseEnter = (event, item) => {
        setTooltipPosition({ x: event.pageX, y: event.pageY });
        setTooltipContent(item);
        setTooltipVisible(true);
    };

    const handleMouseMove = (event) => {
        setTooltipPosition({ x: event.pageX, y: event.pageY });
    };

    const handleMouseLeave = () => {
        setTooltipVisible(false);
    };

    /** Wystawianie przedmiotu na sprzedaż */
    const handleSell = async (type) => {
        const token = localStorage.getItem('token');
        if (!token || !selectedItem) {
            console.warn('Brak tokenu lub nie wybrano przedmiotu');
            return;
        }
        try {
            const response = await fetch("http://localhost:8080/api/market/sell", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...sellData,
                    itemId: selectedItem._id,
                    type
                })
            });
            if (!response.ok) {
                console.error('Błąd wystawiania przedmiotu:', response.statusText);
                return;
            }
            alert('Przedmiot został wystawiony!');
            fetchMarketItems();
            setIsSellModalOpen(false);
        } catch (error) {
            console.error('Błąd wystawiania przedmiotu:', error);
        }
    };

    const handleBuy = async (marketItem) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('Brak tokenu w localStorage');
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8080/api/market/buy", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ marketItemId: marketItem._id }) // 🔥 Poprawiony klucz!
            });
    
            if (!response.ok) {
                console.error('Błąd zakupu przedmiotu:', response.statusText);
                return;
            }
    
            alert('Przedmiot został kupiony!');
            fetchMarketItems();
            fetchUserItems();
        } catch (error) {
            console.error('Błąd zakupu przedmiotu:', error);
        }
    };
    
    const handleBid = async (marketItem, bidAmount) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('Brak tokenu w localStorage');
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8080/api/market/bid", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    marketItemId: marketItem._id,
                    bidAmount: parseInt(bidAmount) // Konwertujemy wartość do liczby
                })
            });
    
            if (!response.ok) {
                console.error('Błąd licytacji:', response.statusText);
                return;
            }
    
            alert('Oferta została złożona!');
            fetchMarketItems();
        } catch (error) {
            console.error('Błąd licytacji:', error);
        }
    };
    

    return (
        <div className="w-full h-full bg-black1 flex justify-center p-5 flex-col space-y-4">
            {/* Panel nawigacyjny */}
            <div className="flex justify-around w-full p-4 bg-maincolor1 rounded-xl mb-4 shadow-lg sticky top-0 z-10">
                <button onClick={() => setActiveTab("market")} className="text-maincolor4 text-lg hover:text-blue-600 transition-all">
                    Market
                </button>
                <button onClick={() => setActiveTab("inventory")} className="text-maincolor4 text-lg hover:text-blue-600 transition-all">
                    Inventory
                </button>
            </div>

            {/* Widok Marketu */}
            {activeTab === "market" && (
                <div className="flex-grow overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-h-[80vh] overflow-y-auto p-4">
                        {marketItems.length === 0 ? (
                            <p className="text-maincolor4 text-center">Brak przedmiotów na markecie.</p>
                        ) : (
                            marketItems.map((item) => {
                                const marketItem = item.item || {}; // Upewniamy się, że `item` istnieje

                                return (
                                    <div key={item._id} className="bg-maincolor1 rounded-xl p-4 shadow-xl transform hover:scale-105 transition-all"
                                        onMouseEnter={(event) => handleMouseEnter(event, marketItem)}
                                        onMouseLeave={handleMouseLeave}
                                        onMouseMove={handleMouseMove}>
                                        <img src={`images/${marketItem.photo || "default"}.png`} 
                                            alt={marketItem.name || "Brak zdjęcia"} 
                                            className="w-full h-32 object-cover rounded-xl mb-2 border-4 border-maincolor4 shadow-md" />
                                            <h3 className="text-xl text-maincolor4 mb-2 font-bold">{marketItem.name || "Brak nazwy"}</h3>
                                        
                                        {/* Poprawne wyświetlanie ceny */}
                                        <p className="text-maincolor4 font-bold mt-2">
                                            {item.type === "fixed" ? (
                                                <>Cena: {item.buyoutPrice}</>
                                            ) : (
                                                <>
                                                    {item.currentBid ? (
                                                        <>Aktualna oferta: {item.currentBid}</>
                                                    ) : (
                                                        <>Cena startowa: {item.startingPrice}</>
                                                    )}
                                                </>
                                            )}
                                        </p>
                                        
                                        {/* Przycisk kupna lub licytacji */}
                                        {item.type === "fixed" ? (
                                            <button
                                                onClick={() => handleBuy(item)}
                                                className="mt-3 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all"
                                            >
                                                Kup
                                            </button>
                                        ) : (
                                            <>
                                                <input 
                                                    type="number" 
                                                    placeholder="Twoja oferta" 
                                                    className="w-full p-2 border rounded mb-2 text-black"
                                                    onChange={(e) => setSellData({ ...sellData, price: e.target.value })}
                                                />
                                                <button
                                                    onClick={() => handleBid(item, sellData.price)}
                                                    className="mt-3 bg-yellow-500 text-black py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all"
                                                >
                                                    Licytuj
                                                </button>
                                            </>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
            {/* Widok Inventory */}
            {activeTab === "inventory" && (
                <div className="flex-grow overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh]">
                        {userItems.length === 0 ? (
                            <p className="text-maincolor4 text-center">Twój ekwipunek jest pusty.</p>
                        ) : (
                            userItems.map((item) => (
                                <div key={item._id} className="bg-maincolor1 rounded-xl p-4 shadow-xl transform hover:scale-105 transition-all"
                                    onMouseEnter={(event) => handleMouseEnter(event, item)}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseMove={handleMouseMove}>
                                    <h3 className="text-xl text-maincolor4 mb-2 font-bold">{item.name}</h3>
                                    <img src={`images/${item.photo || "default"}.png`} 
                                        alt={item.name} 
                                        className="w-full h-32 object-cover rounded-xl mb-2 border-4 border-maincolor4 shadow-md" />
                                    <p className="text-maincolor4 font-bold mt-2">Cena sprzedaży: {Math.round(item.price / 3)} coins</p>
                                    <button onClick={() => {setSelectedItem(item); setIsSellModalOpen(true);}}
                                        className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all">
                                        Sprzedaj
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Tooltip */}
            {tooltipVisible && tooltipContent && (
                <div style={{
                    position: "fixed",
                    top: tooltipPosition.y + 10,
                    left: tooltipPosition.x + 10,
                    zIndex: 10,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    padding: "8px",
                    borderRadius: "10px",
                }} className={`border-4 ${tooltipContent?.element === "fire"
                    ? "border-red-500"
                    : tooltipContent?.element === "water"
                    ? "border-cyan-500"
                    : tooltipContent?.element === "nature"
                    ? "border-green-400"
                    : tooltipContent?.element === "light"
                    ? "border-yellow-500"
                    : tooltipContent?.element === "dark"
                    ? "border-purple-900"
                    : "border-white"} `}>
                    <h4 className="text-2xl font-bold">{tooltipContent?.name || "Brak nazwy"}</h4>
                    <img className="w-20 h-20" src={`images/${tooltipContent?.photo || "default"}.png`} alt="item tooltip" />
                    <p className="text-lg font-bold">TYPE: {tooltipContent?.type || "Brak danych"}</p>
                    <p>ELEMENT: {tooltipContent?.element || "Brak elementu"}</p>
                </div>
            )}

        {/*Modal do wystawiania przedmiotów */}
        {isSellModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
            <div className="bg-maincolor1 p-6 rounded-lg shadow-md w-1/4">
                <h2 className="text-lg font-bold mb-4 text-maincolor4">Sprzedaj lub Licytuj</h2>
                <h3 className="font-bold mb-4 text-maincolor4">{selectedItem.name}</h3>
                <label className="block mb-2 text-maincolor4">Cena</label>
                <input
                    type="number"
                    value={sellData.price}
                    onChange={(e) => setSellData({ ...sellData, price: e.target.value})}
                    className="w-full p-2 border rounded mb-4 text-black"
                />
                <label className="block mb-2 text-maincolor4">Czas trwania</label>
                <select
                    value={sellData.duration}
                    onChange={(e) => setSellData({ ...sellData, duration: e.target.value })}
                    className="w-full p-2 border rounded mb-4 text-black"
                >
                    <option value="2">2 godziny</option>
                    <option value="8">8 godzin</option>
                    <option value="24">24 godziny</option>
                </select>
                <div className="flex flex-col md:flex-row justify-end mt-4 p-4 space-y-2 md:space-y-0 md:space-x-2">
                    <button
                        onClick={() => handleSell('fixed')}
                        className="border-maincolor2 rounded-xl text-maincolor4 border py-2 px-4 w-full md:w-1/3 hover:border-maincolor5 hover:shadow-maincolor5 hover:bg-maincolor4 shadow-buttonshadow transition duration-300 hover:text-black1 hover:bg-opacity-75"
                    >
                        Sprzedaj
                    </button>
                    <button
                        onClick={() => handleSell('auction')}
                        className="border-maincolor2 rounded-xl text-maincolor4 border py-2 px-4 w-full md:w-1/3 hover:border-maincolor5 hover:shadow-maincolor5 hover:bg-maincolor4 shadow-buttonshadow transition duration-300 hover:text-black1 hover:bg-opacity-75"
                    >
                        Licytuj
                    </button>
                    <button
                        onClick={() =>{
                            setIsSellModalOpen(false);
                            setSelectedItem(null);
                        }}
                        className="border-maincolor2 rounded-xl text-maincolor4 border py-2 px-4 w-full md:w-1/3 hover:border-maincolor5 hover:shadow-maincolor5 hover:bg-maincolor4 shadow-buttonshadow transition duration-300 hover:text-black1 hover:bg-opacity-75"
                    >
                        Anuluj
                    </button>
                </div>
            </div>
        </div>
        )}
        </div>
    );
};

export default Market;
