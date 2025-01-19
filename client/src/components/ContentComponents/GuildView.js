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

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            console.error('userId jest null! Użytkownik musi być zalogowany.');
            console.log('Dostępne wartości localStorage:', localStorage);
            console.log('Token:', localStorage.getItem('token'));
            console.log('UserId:', localStorage.getItem('userId'));
            return;
        }
        console.log('userId w localStorage:', userId); 
        fetchGuilds();
        fetchOnlineUsers();

        // Ustawienie interwału do odświeżania listy użytkowników online co 5 sekund
        const intervalId = setInterval(fetchOnlineUsers, 5000);

        // Czyszczenie interwału po odmontowaniu komponentu
        return () => clearInterval(intervalId);
    }, []);

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
            const response = await fetch('http://localhost:8080/api/onlineUsers', {
                method: 'GET',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Nie udało się pobrać użytkowników online');
            console.log('Odpowiedz z backendu o online użytkownikach:', result.onlineUsers); 
            setOnlineUsers(result.onlineUsers || []);
        } catch (error) {
            console.error('Błąd podczas pobierania użytkowników online:', error.message);
        }
    };

    const createGuild = async () => {
        try {
            if (!newGuildName || !newGuildGoal || !newGuildMaxMembers) {
                alert('Wszystkie pola są wymagane!');
                return;
            }

            const token = localStorage.getItem('token');
            const guildData = {
                name: newGuildName,
                goal: newGuildGoal,
                maxMembers: Number(newGuildMaxMembers),
            };

            const response = await fetch('http://localhost:8080/api/createGuild', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
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
            await fetchGuilds();
        } catch (error) {
            console.error('Błąd podczas tworzenia gildii:', error.message);
            alert('Nie udało się utworzyć gildii');
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
        <div className="absolute w-full bg-black1 h-screen text-maincolor4">
            <div className="w-full h-full flex p-5">
                {/* Sekcja gildii */}
                <div className="w-[55vw] bg-gradient-to-r from-black to-maincolor1 h-skreen rounded-3xl m-[1.0vh]  p-[1vh] border-2 ">
                <h2 className="text-white text-2xl font-bold mb-4 ml-4">Twoje gildie</h2>

                    <ul className="space-y-4">
                        {userGuilds.length > 0 ? userGuilds.map((guild) => (
                            <li
                                key={guild._id}
                                className="p-4 bg-gray-800 rounded-xl flex justify-between items-center hover:bg-blue-900 cursor-pointer border-2 border-white"
                                onClick={() => setSelectedGuild(guild)}
                            >
                                <span>{guild.name}</span>
                                <span>{guild.members.length}/{guild.maxMembers}</span>
                                {guild.ownerId === userId ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteGuild(guild._id);
                                        }}
                                        className="bg-maincolor2 text-white px-2 py-1 rounded"
                                    >
                                        Usuń
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            leaveGuild();
                                        }}
                                        className="bg-maincolor2 text-white px-2 py-1 rounded"
                                    >
                                        Opuść
                                    </button>
                                )}
                            </li>
                        )) : <li className="text-gray-400">Nie jesteś członkiem żadnej gildii</li>}
                    </ul>

                    <GuildInvitations fetchGuilds={fetchGuilds} />
                </div>

                {/* Sekcja użytkowników online */}
                <div className="w-[22vw] bg-maincolor1 h-skreen rounded-3xl m-[1.0vh]  p-[1vh] border-2 ">
                    <h2 className="text-white text-2xl font-bold mb-4">Użytkownicy online</h2>
                    <ul className="space-y-2">
                        {onlineUsers.length > 0 ? onlineUsers.map((user) => (
                            <li key={user._id} className="p-2 bg-gray-700 text-white rounded">
                                {user.username}
                            </li>
                        )) : <li className="text-gray-400">Brak użytkowników online</li>}
                    </ul>
                </div>

                {/* Sekcja tworzenia gildii */}
                <div className="w-[22vw] bg-maincolor1 h-skreen  rounded-3xl m-[1.0vh]  p-[1vh] border-2 ">
                    <h2 className="text-white text-2xl font-bold mb-4">Stwórz Gildię</h2>
                    <input
                        type="text"
                        placeholder="Nazwa gildii"
                        className="block w-full p-2 bg-gray-700 text-white rounded mb-4"
                        value={newGuildName}
                        onChange={(e) => setNewGuildName(e.target.value)}
                    />
                    <textarea
                        placeholder="Opis gildii"
                        className="block w-full p-2 bg-gray-700 text-white rounded mb-4"
                        value={newGuildGoal}
                        onChange={(e) => setNewGuildGoal(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Maksymalna liczba członków"
                        className="block w-full p-2 bg-gray-700 text-white rounded mb-4"
                        value={newGuildMaxMembers}
                        onChange={(e) => setNewGuildMaxMembers(Number(e.target.value))}
                    />
                    <button
                        onClick={createGuild}
                        className="w-full bg-gradient-to-r from-blue-900 to-maincolor2 text-black font-bold py-2 rounded-xl hover:text-maincolor4"
                    >
                        Stwórz Gildię
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GuildView;