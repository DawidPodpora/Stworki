import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function GuildDetails({ guild, goBack }) {
    const [inviteLink] = useState('');
    const [newMaxMembers, setNewMaxMembers] = useState(guild.maxMembers);
    const [inviteUsername, setInviteUsername] = useState('');
    const [inviteStatus, setInviteStatus] = useState('');
    const userId = localStorage.getItem('userId'); 
    const isOwner = guild.ownerId === userId;
    const [guildMembersUsernames, setGuildMembersUsernames] = useState([]);
    const { t } = useTranslation();

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
            if (!response.ok) throw new Error(result.error || t('getGuildMembersUsernamesError'));
            setGuildMembersUsernames(result.members || []);
        } catch (error) {
            console.error(t('getGuildMembersUsernamesError'), error.message);
        }
    };

    const updateMaxMembers = async () => {

        if (!isOwner) {
            alert(t('onlyOwnerCanChangeUserLimit'));
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
            if (!response.ok) throw new Error(result.error || t('updateUserLimitError'));
            alert(t('updateUserLimit'));
        } catch (error) {
            console.error(t('updateUserLimitError'), error.message);
        }
    };

    const removeMember = async (memberId) => {
        if (!isOwner) {
            alert(t('onlyOwnerCanRemoveMembers'));
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
            if (!response.ok) throw new Error(result.error || t('removingMemberError'));
            alert(t('memberRemoved'));
            fetchGuildMembersUsernames(guild._id); 
        } catch (error) {
            console.error(t('removingMemberError'), error.message);
        }
    };

    const sendInvite = async () => {
        if (!isOwner) {
            alert(t('onlyOwnerCanSendInvitation'));
            return;
        }
        try {
            if (!inviteUsername) {
                alert(t('enterUsername'));
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
            if (!response.ok) throw new Error(result.error || t('sendingInvitationError'));

            setInviteStatus(t('invitationSended', {username: inviteUsername}));
            setInviteUsername('');
        } catch (error) {
            console.error(t('sendingInvitationError'), error.message);
            setInviteStatus(error.message);
        }
    };

    return (
        <div className="absolute w-full  bg-black1 mt-[-1vh] text-maincolor4 flex justify-center items-center">
            <div className="w-[85vw] h-[80vh] bg-gradient-to-r from-black to-maincolor1 flex flex-col p-4 rounded-3xl shadow-lg  border-gray-700">
                
                {/* Powrót */}
                <button
                    onClick={goBack}
                    className="bg-gray-800 text-white px-5 py-2 rounded-lg mb-4 hover:bg-maincolor2 transition-all font-bold border-2 border-white"
                >
                    ⬅ {t('return')}
                </button>
    
                {/* Informacje o gildii */}
                <div className="bg-gray-900 p-4 rounded-xl border-2 border-gray-600 shadow-md">
                    <h2 className="text-white text-3xl font-extrabold">{guild.name}</h2>
                    <p className="text-maincolor4 text-md mt-1">🎯 {t('guildDescription')}: <span className="text-white">{guild.goal}</span></p>
                </div>
    
                {/* Lista członków */}
                <div className="mt-4">
                    <h3 className="text-maincolor4 text-xl font-semibold mb-3">👥 {t('members')}</h3>
                    <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 max-h-[40vh] overflow-auto">
                        {guildMembersUsernames.map((member) => (
                            <li key={member._id} className="p-3 bg-gray-800 rounded-xl flex justify-between items-center hover:bg-black transition-all border-2 border-white shadow-md">
                                <span className="text-white text-md font-semibold">
                                    {member.username} {member.isOwner && "👑 (Lider)"}
                                </span>
                                {!member.isOwner && isOwner && (
                                    <button
                                        className="bg-maincolor2 text-white px-3 py-1 rounded-lg hover:bg-red-500 transition-all"
                                        onClick={() => removeMember(member._id)}
                                    >
                                        ❌ Usuń
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
    
                <div className="border-t-2 border-gray-600 my-3"></div>
    
                {/* Panel właściciela */}
                {isOwner && (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
                        
                        {/* Zmiana limitu użytkowników */}
                        <div className="mt-2">
                            <h3 className="text-maincolor4 text-lg font-semibold mb-1">⚙️ {t('membersLimit')}</h3>
                            <input
                                type="number"
                                className="block w-full p-2 bg-gray-700 text-white rounded-lg border-2 border-gray-500 focus:ring-2 focus:ring-blue-500"
                                value={newMaxMembers}
                                onChange={(e) => setNewMaxMembers(Number(e.target.value))}
                            />
                            <button
                                onClick={updateMaxMembers}
                                className="w-full mt-2 bg-gradient-to-r from-blue-900 to-maincolor2 text-black font-bold py-2 px-4 rounded-lg hover:text-maincolor4 transition-all"
                            >
                                ✅ {t('update')}
                            </button>
                        </div>
    
                        {/* Wysyłanie zaproszeń */}
                        <div className="mt-2">
                            <h3 className="text-maincolor4 text-lg font-semibold mb-1">📩 {t('sendInvitation')}</h3>
                            <input
                                type="text"
                                placeholder="Nazwa użytkownika"
                                className="block w-full p-2 bg-gray-700 text-white rounded-lg border-2 border-gray-500 focus:ring-2 focus:ring-blue-500"
                                value={inviteUsername}
                                onChange={(e) => setInviteUsername(e.target.value)}
                            />
                            <button
                                onClick={sendInvite}
                                className="w-full mt-2 bg-gradient-to-r from-blue-900 to-maincolor2 text-black font-bold py-2 px-4 rounded-lg hover:text-maincolor4 transition-all"
                            >
                                ✉ {t('send')}
                            </button>
                            {inviteStatus && (
                                <p className="text-gray-300 mt-1">{inviteStatus}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GuildDetails;