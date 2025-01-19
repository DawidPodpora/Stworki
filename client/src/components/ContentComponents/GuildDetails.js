import React, { useState, useEffect } from 'react';

function GuildDetails({ guild, goBack }) {
    const [inviteLink] = useState('');
    const [newMaxMembers, setNewMaxMembers] = useState(guild.maxMembers);
    const [inviteUsername, setInviteUsername] = useState('');
    const [inviteStatus, setInviteStatus] = useState('');
    const userId = localStorage.getItem('userId'); 
    const isOwner = guild.ownerId === userId;
    const [guildMembersUsernames, setGuildMembersUsernames] = useState([]);

    useEffect(() => {
        fetchGuildMembersUsernames(guild._id);
    }, [guild._id]);

    const fetchGuildMembersUsernames = async (guildId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/guilds/${guildId}/members`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Nie udało się pobrać nazw użytkowników członków gildii');
            setGuildMembersUsernames(result.members || []);
        } catch (error) {
            console.error('Błąd podczas pobierania nazw użytkowników członków gildii:', error.message);
        }
    };

    const updateMaxMembers = async () => {

        if (!isOwner) {
            alert('Tylko właściciel gildii może zmieniać limit użytkowników');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/updateMaxMembers/${guild._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ maxMembers: newMaxMembers }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Nie udało się zaktualizować limitu');
            alert('Limit użytkowników został zaktualizowany');
        } catch (error) {
            console.error('Błąd:', error.message);
        }
    };

    const removeMember = async (memberId) => {
        if (!isOwner) {
            alert('Tylko właściciel gildii może usuwać członków');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/removeMember/${guild._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ memberId }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Nie udało się usunąć członka');
            alert('Członek został usunięty');
            fetchGuildMembersUsernames(guild._id); 
        } catch (error) {
            console.error('Błąd:', error.message);
        }
    };

    const sendInvite = async () => {
        if (!isOwner) {
            alert('Tylko właściciel gildii może wysyłać zaproszenia');
            return;
        }
        try {
            if (!inviteUsername) {
                alert('Wpisz nazwę użytkownika');
                return;
            }
            const response = await fetch('http://localhost:8080/api/inviteToGuild', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ username: inviteUsername }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Błąd podczas wysyłania zaproszenia');

            setInviteStatus(`Zaproszenie wysłane do użytkownika ${inviteUsername}`);
            setInviteUsername('');
        } catch (error) {
            console.error('Błąd podczas wysyłania zaproszenia:', error.message);
            setInviteStatus(error.message);
        }
    };

    return (
        <div className="absolute w-full bg-black1 h-screen text-maincolor4">
        <div className="w-full h-full flex p-5">
            {/* Sekcja gildii */}
            <div className="w-[100vw] bg-maincolor1 h-skreen rounded-3xl m-[1.0vh]  p-[1vh] border-2 ">
            <button
                onClick={goBack}
                className="bg-gray-800 text-white px-4 py-2 rounded-xl mb-4 hover:bg-blue-900 transition-all font-bold border-2 border-white"
            >
                Powrót
            </button>
    
            {/* Informacje o gildii */}
            <h2 className="text-white text-3xl font-bold mb-4">{guild.name}</h2>
            <p className="text-maincolor4 text-lg mb-4">Opis gildii: <span className="text-white">{guild.goal}</span></p>
    
          {/* Lista członków */}
         <h3 className="text-maincolor4 text-2xl font-semibold mb-2">Członkowie:</h3>
        <ul className="space-y-3">
    {guildMembersUsernames.map((member) => (
        <li key={member._id}
            className="flex justify-between items-center p-3 bg-gray-800 rounded-xl hover:bg-black transition-all border-2 border-white"
        >
            {/* Oznaczenie właściciela */}
            <span className="text-white">
                {member.username} {member.isOwner && "(Owner)"}
            </span>

            {/* Przycisk "Usuń" tylko dla nie-właścicieli */}
            {!member.isOwner && isOwner && (
                <button
                    className="bg-blue-900 text-white px-3 py-1 rounded-xl hover:bg-red-400 transition-all"
                    onClick={() => removeMember(member._id)}
                >
                    Usuń
                </button>
            )}
        </li>
    ))}
</ul>


            <div className="border-t-2 border-gray-600 my-4"></div>
    
            {/* Sekcja właściciela */}
            {isOwner && (
                <>
                    {/* Zmiana limitu użytkowników */}
                    <div className="mt-6">
                        <h3 className="text-maincolor4 text-2xl font-semibold mb-2">Limit użytkowników</h3>
                        <input
                            type="number"
                            className="block w-full p-3 bg-gray-700 text-white rounded-xl mb-4"
                            value={newMaxMembers}
                            onChange={(e) => setNewMaxMembers(Number(e.target.value))}
                        />
                        <button
                            onClick={updateMaxMembers}
                            className="bg-gradient-to-r from-blue-900 to-maincolor2 text-black font-bold py-2 px-6 rounded-xl hover:text-maincolor4"
                        >
                            Zaktualizuj limit
                        </button>
                    </div>
    
                    {/* Wysyłanie zaproszeń */}
                    <div className="mt-6">
                        <h3 className="text-maincolor4 text-2xl font-semibold mb-2">Wyślij zaproszenie do gildii</h3>
                        <input
                            type="text"
                            placeholder="Nazwa użytkownika"
                            className="block w-full p-3 bg-gray-700 text-white rounded-xl mb-4"
                            value={inviteUsername}
                            onChange={(e) => setInviteUsername(e.target.value)}
                        />
                        <button
                            onClick={sendInvite}
                            className="bg-gradient-to-r from-blue-900 to-maincolor2 text-black font-bold py-2 px-6 rounded-xl hover:text-maincolor4"
                        >
                            Wyślij zaproszenie
                        </button>
                        {inviteStatus && (
                            <p className="text-gray-300 mt-2">{inviteStatus}</p>
                        )}
                    </div>
                </>
            )}
        </div>
        </div>
        </div>
    );
}

export default GuildDetails;