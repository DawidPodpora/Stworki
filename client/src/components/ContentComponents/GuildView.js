import React, { useState, useEffect } from 'react';
import GuildDetails from './GuildDetails';
import GuildInvitations from './GuildInvitations';

function GuildView() {
    const [guilds, setGuilds] = useState([]);
    const [selectedGuild, setSelectedGuild] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [newGuildName, setNewGuildName] = useState('');
    const [newGuildGoal, setNewGuildGoal] = useState('');
    const [newGuildMaxMembers, setNewGuildMaxMembers] = useState(10);
    const [newGuildExpBonus, setNewGuildExpBonus] = useState(1);
    const [newGuildGoldBonus, setNewGuildGoldBonus] = useState(1);
    const [userExp, setUserExp] = useState(0);
    const [userGold, setUserGold] = useState(0);
    const userId = localStorage.getItem('userId');
    const [userTezaInput, setUserTezaInput] = useState("");
    useEffect(() => {
        if (!userId) {
            console.error('userId jest null! Użytkownik musi być zalogowany.');
            console.log('Dostępne wartości localStorage:', localStorage);
            console.log('Token:', localStorage.getItem('token'));
            console.log('UserId:', localStorage.getItem('userId'));
            return;
        }
        console.log('userId w localStorage:', userId); 
        fetchUserData();
        fetchGuilds();
        fetchOnlineUsers();

        // Ustawienie interwału do odświeżania listy użytkowników online co 5 sekund
        const intervalId = setInterval(fetchOnlineUsers, 5000);

        // Czyszczenie interwału po odmontowaniu komponentu
        return () => clearInterval(intervalId);
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/userData', {
                method: 'GET',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Nie udało się pobrać danych użytkownika');

            setUserExp(result.exp);
            setUserGold(result.money);
        } catch (error) {
            console.error('Błąd podczas pobierania danych użytkownika:', error.message);
        }
    };

    const fetchGuilds = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/userGuilds', {
                method: 'GET',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Nie udało się pobrać gildii');
            console.log('Odpowiedz z backendu:', result.guilds); 
            setGuilds(result.guilds || []);
        } catch (error) {
            console.error('Błąd podczas pobierania gildii:', error.message);
        }
    };

    const fetchOnlineUsers = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/onlineUsers", {
                method: "GET",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, 'Content-Type': 'application/json' }
            });
            const result = await response.json();
    
            console.log("Odpowiedź z backendu o online użytkownikach:", result.onlineUsers);
            setOnlineUsers(result.onlineUsers || []);
        } catch (error) {
            console.error("Błąd podczas pobierania użytkowników online:", error.message);
        }
    };

    const createGuild = async () => {
        try {
            if (!newGuildName || !newGuildGoal || !newGuildMaxMembers) {
                alert('Wszystkie pola są wymagane!');
                return;
            }
            const minBonus = userExp < 50 ? 1 : 10;
            const maxBonus = userExp < 50 ? 10 : 20;

            if (newGuildExpBonus < minBonus || newGuildExpBonus > maxBonus ||
                newGuildGoldBonus < minBonus || newGuildGoldBonus > maxBonus) {
                alert(`❌ Nieprawidłowe wartości bonusów. Dla Twojego poziomu EXP dozwolone są wartości między ${minBonus}% a ${maxBonus}%.`);
                return;
            }

            if (userGold < 50) {
                alert('⚠ Nie masz wystarczająco złota, aby stworzyć gildię, kwota - 20.');
                return;
            }
            const token = localStorage.getItem('token');
            const guildData = {
                name: newGuildName,
                goal: newGuildGoal,
                maxMembers: Number(newGuildMaxMembers),
                bonus_exp: newGuildExpBonus,
                bonus_gold: newGuildGoldBonus
            };
            console.log("🚀 Wysyłane dane do backendu:", guildData); // DEBUG
            const response = await fetch('http://localhost:8080/api/createGuild', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`,'Content-Type': 'application/json' },
                body: JSON.stringify(guildData),
            });

            const result = await response.json();
            

            if (!response.ok) {
                if (result.error.includes('Najpierw opuść swoją obecną gildię')) {
                    alert('⚠ Najpierw opuść swoją obecną gildię lub ją usuń, aby stworzyć nową.');
                } else {
                    alert(`❌ Nie udało się utworzyć gildii: ${result.error}`);
                }
                throw new Error(result.error || 'Nie udało się utworzyć gildii');
            }
            alert('Gildia została pomyślnie stworzona!');
            setNewGuildName('');
            setNewGuildGoal('');
            setNewGuildMaxMembers(10);
            setNewGuildExpBonus(minBonus);
            setNewGuildGoldBonus(minBonus);
            await fetchGuilds();
            await fetchUserData();
        } catch (error) {
            console.error('Błąd podczas tworzenia gildii:', error.message);
            alert('Nie udało się utworzyć gildii');
        }
    };
    const handleTezaSubmit = async () => {
        if (!userTezaInput.trim()) return; // Nie pozwalamy zapisać pustej tezy
    
        try {
            const response = await fetch('http://localhost:8080/api/setTeza', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ teza: userTezaInput })
            });
    
            if (!response.ok) {
                throw new Error("Nie udało się zapisać tezy.");
            }
    
            alert("Teza została zapisana i wygaśnie za 30 minut!");
            setUserTezaInput(""); // Reset inputa po zapisaniu
        } catch (error) {
            console.error("Błąd podczas zapisywania tezy:", error);
        }
    };

    const leaveGuild = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/leaveGuild', {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json'  },
            });
    
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Nie udało się opuścić gildii');
    
            alert('Opuściłeś gildię');
            await fetchGuilds();
        } catch (error) {
            console.error('Błąd podczas opuszczania gildii:', error.message);
            alert('Nie udało się opuścić gildii');
        }
    };

    const deleteGuild = async (guildId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/deleteGuild/${guildId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Nie udało się usunąć gildii');

            alert('Gildia została usunięta');
            await fetchGuilds();
        } catch (error) {
            console.error('Błąd podczas usuwania gildii:', error.message);
            alert('Nie udało się usunąć gildii');
        }
    };

    const userGuilds = guilds.filter((guild) =>
        guild.members.some((memberId) => memberId.toString() === userId)
    );

    if (selectedGuild) {
        return <GuildDetails guild={selectedGuild} goBack={() => setSelectedGuild(null)} />;
    }
    return (
        <div className="w-full h-screen justify-center bg-black flex flex-col p-5 justify-center">
            
            {/* Kontener główny - 3x3 układ */}
            <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-4">
                    
                {/* Twoja Gildia - (1 rząd, 2 kolumny szerokości) */}
                <div className="row-span-1  h-[23vh] col-span-2 bg-gradient-to-r from-black to-maincolor1 rounded-[30px] p-4 border-2">
                    <h2 className="text-white text-2xl font-bold">Twoja gildia</h2>
                    <ul className="space-y-4 mt-4">
                        {userGuilds.length > 0 ? userGuilds.map((guild) => (
                            <li key={guild._id} className="p-4 bg-gray-800 rounded-xl flex justify-between items-center hover:bg-maincolor1 cursor-pointer border-2 border-white"
                                onClick={() => setSelectedGuild(guild)}>
                                <div className="w-full flex justify-between items-center">
                                    <span className="text-white  text-lg font-bold">{guild.name}</span>
                                    <div className="flex items-center text-sm text-gray-300 space-x-6">
                                        <span>🎖 Bonus EXP: <span className="text-green-400">{guild.bonus_exp}%</span></span>
                                        <span className="flex items-center">
                                            💰 Bonus złota: <span className="text-yellow-400 ml-1">{guild.bonus_gold}%</span>
                                            <span className="w-5 h-5 ml-2" />
                                        </span>
                                        <span>👥 {guild.members.length}/{guild.maxMembers}</span>
                                    </div>
    
                                    {/* Przycisk akcji */}
                                    {guild.ownerId === userId ? (
                                        <button onClick={(e) => { e.stopPropagation(); deleteGuild(guild._id); }} 
                                            className="bg-maincolor2 text-white px-3 py-1 rounded">
                                            Usuń
                                        </button>
                                    ) : (
                                        <button onClick={(e) => { e.stopPropagation(); leaveGuild(); }} 
                                            className="bg-maincolor2 text-white px-3 py-1 rounded">
                                            Opuść
                                        </button>
                                    )}
                                </div>
                            </li>
                        )) : <li className="text-gray-400">Nie jesteś członkiem żadnej gildii</li>}
                    </ul>
                </div>
    {/* Użytkownicy Online - (2 rząd, 1 kolumna szerokości, zajmuje cały rząd) */}
    
    <div className="row-span-2 col-span-1 w-[49vh]  w-skreen  h-[95vh] bg-maincolor1 rounded-[30px]  w-skreen p-4 border-2 flex flex-col">
                    <h2 className="text-white text-xl font-bold">Użytkownicy online</h2>
                    <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                        <h3 className="text-white text-lg font-semibold mb-2">Dodaj swoją tezę</h3>
                        <input type="text" placeholder="Wpisz swoją myśl..." value={userTezaInput}
                            onChange={(e) => setUserTezaInput(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white" />
                        <button onClick={handleTezaSubmit} className="w-full mt-2 p-2 bg-gradient-to-r from-maincolor2 to-maincolor1 rounded text-white font-bold hover:bg-green-700">
                            Zapisz tezę 
                        </button>
                    </div>
    
                    {/* Lista użytkowników */}
                    <ul className="space-y-2 overflow-auto max-h-[50vh]">
                        {onlineUsers.length > 0 ? onlineUsers.map((user, index) => {
                            const funnyEmojis = ['⚔️', '🛡️', '🏹', '🧙‍♂️', '🐉', '🕵️‍♂️', '💀', '👹', '👾', '⚡', '🔥', '🌪️', '☠️', '🛠️', '🏰', '🎭', '💎', '🃏', '🔮', '🧛‍♂️', '🦸‍♂️', '🐺'];
                            const emoji = funnyEmojis[index % funnyEmojis.length];
    
                            return (
                                <li key={user._id} className="p-3 bg-gray-800 text-white rounded flex items-center space-x-3">
                                    <span className="text-xl">{emoji}</span>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-lg">{user.username}</span>
                                        {user.teza && user.teza.trim() !== "" && (
                                            <span className="text-gray-400 text-sm italic">„{user.teza}”</span>
                                        )}
                                        <span className="text-yellow-300 text-sm">EXP: {user.exp}</span>
                                    </div>
                                </li>
                            );
                        }) : <li className="text-gray-400">🚫 Brak użytkowników online... gdzie oni wszyscy poszli? 🧐</li>}
                    </ul>
                </div>
                {/* Stwórz Gildię - (2 rząd, 1 kolumna szerokości) */}
                <div className="row-span-2 h-[70vh] col-span-1 w-skreen mt-[-22vh] bg-maincolor1 rounded-[30px] p-4 border-2 flex flex-col">
                <h2 className="text-white text-xl font-bold">Stwórz gildię</h2>
                    <input
                        type="text"
                        placeholder="Nazwa gildii"
                        className="block w-full p-2 bg-gray-700 rounded mt-2"
                        value={newGuildName}
                        onChange={(e) => setNewGuildName(e.target.value)}
                    />
                    <textarea
                        placeholder="Opis gildii"
                        className="block w-full p-2 bg-gray-700 rounded mt-2"
                        value={newGuildGoal}
                        onChange={(e) => setNewGuildGoal(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Maksymalna liczba członków"
                        className="block text-white w-full p-2 bg-gray-700 rounded mt-2"
                        value={newGuildMaxMembers}
                        onChange={(e) => setNewGuildMaxMembers(Number(e.target.value))}
                    />
                    <label className="text-white block mt-2">Bonus EXP:</label>
                    <input
                        type="number"
                        min={userExp < 50 ? 1 : 10}
                        max={userExp < 50 ? 10 : 20}
                        className="text-white block w-full p-2 bg-gray-700 rounded"
                        value={newGuildExpBonus}
                        onChange={(e) => setNewGuildExpBonus(Number(e.target.value))}
                    />
                    <label className="text-white block mt-2">Bonus złota:</label>
                    <input
                        type="number"
                        min={userExp < 50 ? 1 : 10}
                        max={userExp < 50 ? 10 : 20}
                        className=" text-white block w-full p-2 bg-gray-700 rounded"
                        value={newGuildGoldBonus}
                        onChange={(e) => setNewGuildGoldBonus(Number(e.target.value))}
                    />
                    <button onClick={createGuild} className="w-full bg-gradient-to-r from-maincolor2 to-maincolor5 p-2 mt-3 rounded">
                        Stwórz Gildię
                    </button>
                </div>
                
                {/* Zaproszenia - (2 rząd, 1 kolumna szerokości) */}
                <div className="row-span-1 h-[70vh] col-span-1 w-skreen mt-[-22vh] bg-gray-900 rounded-[30px] p-4 border-2 flex flex-col">
               
                    
                    <GuildInvitations fetchGuilds={fetchGuilds} />
                </div>
    
                
            </div>
        </div>
    );
    
    
}

export default GuildView;