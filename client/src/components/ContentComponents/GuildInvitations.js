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
            console.log("📥 Odpowiedź API (zaproszenia):", result); // LOGOWANIE API
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
        <div className="absolutli  w full row-span-1 h-[9vh] col-span-1   flex flex-col">
            <h2 className="text-white text-xl font-bold mb-4">Zaproszenia</h2>

            {/* Wyświetlanie komunikatów */}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}

            <ul className="space-y-4">
                {invitations.length > 0 ? (
                    invitations.map((inv) => (
                        <li key={inv.guildId} className="p-4 bg-gray-800 rounded-xl flex flex-col hover:bg-maincolor1 border-2 border-white">
                            {/* Nazwa Gildii */}
                            <div className="flex justify-between items-center">
                                <span className="text-white font-bold">{inv.guildName}</span>
                                <div className="space-x-2">
                                    <button
                                        className="bg-gradient-to-r from-maincolor2 to-maincolor5 text-white px-4 py-2 rounded hover:bg-green-400 transition-all"
                                        onClick={() => handleInvitation(inv.guildId, 'accept')}
                                    >
                                        Akceptuj
                                    </button>
                                    <button
                                        className="bg-gradient-to-r from-maincolor2 to-maincolor5 text-white px-4 py-2 rounded hover:bg-red-400 transition-all"
                                        onClick={() => handleInvitation(inv.guildId, 'reject')}
                                    >
                                        Odrzuć
                                    </button>
                                </div>
                            </div>

                            {/* Bonusy EXP i Gold */}
                            {inv.bonusExp !== undefined && inv.bonusGold !== undefined && (
                                <div className="mt-2 flex justify-between text-sm text-gray-300">
                                    <span>Bonus EXP: <span className="text-green-400">{inv.bonusExp}%</span></span>
                                    <span>Bonus złota: <span className="text-yellow-400">{inv.bonusGold}%</span></span>
                                </div>
                            )}
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
