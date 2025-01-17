import React, { useState, useEffect } from 'react';

function GuildInvitations({ fetchGuilds }) {
    const [invitations, setInvitations] = useState([]);
    const [error, setError] = useState(null); 
    const [successMessage, setSuccessMessage] = useState(null); 

    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/invitations', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Nie udało się pobrać zaproszeń');
            }

            const result = await response.json();
            setInvitations(result.invitations || []);
        } catch (error) {
            setError('Błąd podczas pobierania zaproszeń: ' + error.message);
        }
    };

    const handleInvitation = async (guildId, action) => {
        try {
           
            setError(null);
            setSuccessMessage(null);

            const response = await fetch('http://localhost:8080/api/handleInvitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ guildId, action }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error);
            }

            if (action === 'accept') {
                if (result.message === 'Najpierw opuść swoją obecną gildię, aby dołączyć do nowej') {
                    setError('Musisz opuścić swoją obecną gildię, aby dołączyć do nowej.');
                } else {
                    setSuccessMessage(result.message);
                    
                    setInvitations((prev) => prev.filter((inv) => inv.guildId !== guildId));
                    
                    fetchGuilds();
                }
            } else if (action === 'reject') {
                setSuccessMessage('Zaproszenie zostało odrzucone.');
                
                setInvitations((prev) => prev.filter((inv) => inv.guildId !== guildId));
            }
            await fetchGuilds();
        } catch (error) {
            setError('Błąd podczas obsługi zaproszenia: ' + error.message);
        }
    };

    return (
        <div className="w-[40vw] bg-gradient-to-r from-black to-maincolor1 h-skreen m-[1.0vh]  p-[1vh] ">
            <h2 className="text-white text-2xl font-bold mb-4">Zaproszenia do gildii</h2>
            
            {/* Wyświetlanie komunikatów */}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}

            <ul className="space-y-4">
                {invitations.length > 0 ? (
                    invitations.map((inv) => (
                        <li
                            key={inv.guildId}
                            className="p-4 bg-gray-800 rounded-xl flex justify-between items-center hover:bg-green-400 border-2 border-white"
                        >
                            <span className="text-white">{inv.guildName}</span>
                            <div className="space-x-2">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 transition-all"
                                    onClick={() => handleInvitation(inv.guildId, 'accept')}
                                >
                                    Akceptuj
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition-all"
                                    onClick={() => handleInvitation(inv.guildId, 'reject')}
                                >
                                    Odrzuć
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-400">Brak zaproszeń</li>
                )}
            </ul>
        </div>
    );
}

export default GuildInvitations;