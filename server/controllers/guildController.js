import mongoose from 'mongoose';
import UserModel from '../model/User.model.js' 
import GuildModel from '../model/Guild.model.js';


export async function getUserGuilds(req, res) {
    try {
        const userId = req.user.userId; // Pobierz userId z tokena
    
        // Upewnijmy się, że userId jest poprawnym ObjectId
        const objectId = mongoose.Types.ObjectId(userId);
        console.log('Pobieram gildie dla userId:', userId);
        // Ustawiamy nagłówek, aby wyłączyć cache
        res.set('Cache-Control', 'no-store');
    
        // Pobieramy wszystkie gildie, w których dany użytkownik jest członkiem
        const userGuilds = await GuildModel.find({ members: objectId }).exec();
        console.log('Pobrane gildie:', userGuilds);
        
        // Zwracamy listę gildii
        res.status(200).json({ guilds: userGuilds });
    } catch (error) {
        console.error('Błąd podczas pobierania gildii użytkownika:', error.message);
        res.status(500).json({ error: 'Nie udało się pobrać gildii' });
    }
    

}export async function getGuildMembersUsernames(req, res) {
    try {
        const { guildId } = req.params;

        // Pobieramy gildię na podstawie jej ID
        const guild = await GuildModel.findById(guildId).exec();
        if (!guild) {
            return res.status(404).json({ error: 'Gildia nie została znaleziona' });
        }

        // Pobieramy dane użytkowników na podstawie ich ObjectId
        const membersWithUsernames = await Promise.all(guild.members.map(async (memberId) => {
            const user = await UserModel.findById(memberId).select('username');
            return { 
                _id: memberId, 
                username: user ? user.username : 'Unknown',
                isOwner: guild.ownerId.toString() === memberId.toString() // Sprawdzamy, czy jest właścicielem
            };
        }));

        // Zwracamy listę nazw użytkowników
        res.status(200).json({ members: membersWithUsernames });
    } catch (error) {
        console.error('Błąd podczas pobierania nazw użytkowników członków gildii:', error.message);
        res.status(500).json({ error: 'Nie udało się pobrać nazw użytkowników członków gildii' });
    }
}





export async function createGuild(req, res) {
    try {
        console.log('Otrzymane dane:', req.body); // Dane z frontendu
        console.log('Użytkownik z tokena:', req.user); // Użytkownik z tokena

        const { name, goal, maxMembers } = req.body;
        const userId = req.user.userId;

        if (!userId) {
            console.log('Brak userId w tokenie!');
            return res.status(400).json({ error: 'Nieprawidłowy token użytkownika' });
        }

        if (!name || typeof name !== 'string') {
            console.log('Nieprawidłowa nazwa gildii:', name);
            return res.status(400).json({ error: 'Nazwa gildii jest wymagana' });
        }

        if (!goal || typeof goal !== 'string') {
            console.log('Nieprawidłowy opis gildii:', goal);
            return res.status(400).json({ error: 'Opis gildii jest wymagany' });
        }

        if (!maxMembers || typeof maxMembers !== 'number' || maxMembers <= 0) {
            console.log('Nieprawidłowa liczba członków:', maxMembers);
            return res.status(400).json({ error: 'Nieprawidłowa maksymalna liczba członków' });
        }

        // Sprawdzenie, czy użytkownik już należy do gildii
        const user = await UserModel.findById(userId);
        if (!user) {
            console.log('Nie znaleziono użytkownika z ID:', userId);
            return res.status(404).json({ error: 'Użytkownik nie istnieje' });
        }

        if (user.isInGuild) {
            console.log('Użytkownik jest już w gildii i nie może stworzyć nowej');
            return res.status(400).json({ error: 'Najpierw opuść swoją obecną gildię, aby stworzyć nową' });
        }

        // Tworzenie nowej gildii
        const newGuild = new GuildModel({
            name,
            goal,
            maxMembers,
            members: [mongoose.Types.ObjectId(userId)],
            ownerId: mongoose.Types.ObjectId(userId),
        });

        await newGuild.save();

        console.log('Gildia została utworzona:', newGuild);

        // Aktualizacja danych użytkownika
        user.isInGuild = true;
        user.guildId = newGuild._id;

        await user.save();

        res.status(201).json({ message: 'Gildia została pomyślnie utworzona' });
    } catch (error) {
        console.error('Błąd podczas tworzenia gildii:', error); // Szczegóły błędu
        res.status(500).json({ error: 'Nie udało się utworzyć gildii' });
    }
}

export async function getOnlineUsers(req, res) {
    try {
        const onlineUsers = await UserModel.find({ isOnline: true }).select('username');
        res.status(200).json({ onlineUsers });
    } catch (error) {
        console.error('Błąd podczas pobierania użytkowników online:', error.message);
        res.status(500).json({ error: 'Nie udało się pobrać użytkowników online' });
    }
}


export async function logout(req, res) {
try {
    const userId = req.user.userId; // Pobierz ID użytkownika z middleware
    const user = await UserModel.findById(userId); // Znajdź użytkownika w bazie danych

    if (!user) return res.status(404).json({ error: "Nie znaleziono użytkownika" });

    // Ustaw isOnline na false
    user.isOnline = false;
    await user.save();

    res.status(200).json({ message: "Wylogowano pomyślnie" });
} catch (error) {
    res.status(500).json({ error: "Błąd serwera podczas wylogowywania" });
}
}export async function leaveGuild(req, res) {
try {
    const userId = req.user.userId;
    console.log(`🔍 Sprawdzanie użytkownika ${userId} przed opuszczeniem gildii...`);

    // Pobranie użytkownika z bazy
    const user = await UserModel.findById(userId);
    if (!user) {
        console.log(`❌ Nie znaleziono użytkownika ${userId}`);
        return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }

    // Sprawdzenie, czy użytkownik ma ustawione isInGuild
    if (!user.isInGuild) {
        console.log(`⚠️ Użytkownik ${userId} nie jest w żadnej gildii`);
        return res.status(400).json({ error: 'Nie jesteś w żadnej gildii' });
    }

    // Pobranie gildii, w której użytkownik jest członkiem
    const guild = await GuildModel.findOne({ members: userId });
    if (!guild) {
        console.log(`⚠️ Użytkownik ${userId} jest oznaczony jako członek gildii, ale nie znaleziono takiej gildii.`);
        
        // Resetowanie statusu użytkownika
        user.isInGuild = false;
        user.guildId = null;
        await user.save();
        
        return res.status(200).json({ message: 'Opuściłeś gildię' });
    }

    console.log(`🏰 Znaleziono gildię: ${guild.name} (${guild._id})`);

    // Sprawdzenie, czy użytkownik jest właścicielem tej gildii
    if (guild.ownerId.toString() === userId) {
        console.log(`🚨 Użytkownik ${userId} próbował opuścić swoją własną gildię!`);
        return res.status(400).json({ error: 'Nie możesz opuścić gildii, ponieważ jesteś jej właścicielem. Usuń gildię.' });
    }

    // Usunięcie użytkownika z gildii
    guild.members = guild.members.filter((member) => member.toString() !== userId);
    await guild.save();

    console.log(`✅ Użytkownik ${userId} został usunięty z gildii: ${guild._id}`);

    // Aktualizacja użytkownika - usunięcie informacji o gildii
    user.isInGuild = false;
    user.guildId = null;
    await user.save();

    console.log(`✅ Użytkownik ${userId} pomyślnie opuścił gildię ${guild._id}`);
    res.status(200).json({ message: 'Opuściłeś gildię' });
} catch (error) {
    console.error('❌ Błąd podczas opuszczania gildii:', error);
    res.status(500).json({ error: 'Błąd serwera podczas opuszczania gildii' });
}
}


export async function inviteToGuild(req, res) {
console.log('Użytkownik wykonujący zaproszenie:', req.user);
console.log('guildId:', req.user.guildId);

try {
    const { username } = req.body;
    const userId = req.user.userId;
    const guildId = req.user.guildId;

    if (!guildId) {
        return res.status(400).json({ error: 'Nie należysz do żadnej gildii' });
    }

    const guild = await GuildModel.findById(guildId);
    if (!guild) {
        return res.status(404).json({ error: 'Gildia nie została znaleziona' });
    }

    // Sprawdzenie, czy użytkownik jest właścicielem gildii
    if (guild.ownerId.toString() !== userId) {
        return res.status(403).json({ error: 'Nie masz uprawnień do tej akcji' });
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
        return res.status(404).json({ error: 'Nie znaleziono użytkownika' });
    }
    

    if (user.invitations.some((inv) => inv.guildId.toString() === guildId)) {
        return res.status(400).json({ error: 'Użytkownik już został zaproszony do tej gildii' });
    }

    // Dodanie zaproszenia, nawet jeśli użytkownik jest w innej gildii
    user.invitations.push({ guildId });
    await user.save();

    res.status(200).json({ message: 'Zaproszenie zostało wysłane' });
} catch (error) {
    console.error('Błąd podczas wysyłania zaproszenia:', error);
    res.status(500).json({ error: 'Nie udało się wysłać zaproszenia' });
}
}

export async function handleGuildInvitation(req, res) {
const { guildId, action } = req.body;
const userId = req.user.userId;

try {
    const user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }

    const guild = await GuildModel.findById(guildId);
    if (!guild) {
        return res.status(404).json({ error: 'Gildia nie została znaleziona' });
    }

    // Sprawdzenie, czy użytkownik posiada własną gildię
    const ownedGuild = await GuildModel.findOne({ ownerId: userId });
    if (action === 'accept' && ownedGuild) {
        return res.status(400).json({ error: 'Najpierw usuń swoją gildię, aby dołączyć do nowej.' });
    }

    // Jeśli użytkownik już należy do innej gildii, nie może zaakceptować zaproszenia
    if (action === 'accept' && user.isInGuild) {
        return res.status(400).json({ error: 'Najpierw opuść swoją obecną gildię, aby dołączyć do nowej.' });
    }

    if (action === 'accept') {
        user.isInGuild = true;
        user.guildId = guildId;
        guild.members.push(user._id);
        user.invitations = user.invitations.filter(inv => inv.guildId.toString() !== guildId);

        await user.save();
        await guild.save();

        return res.status(200).json({ message: 'Dołączyłeś do gildii' });
    } else if (action === 'reject') {
        user.invitations = user.invitations.filter(inv => inv.guildId.toString() !== guildId);
        await user.save();

        return res.status(200).json({ message: 'Zaproszenie zostało odrzucone' });
    } else {
        return res.status(400).json({ error: 'Nieprawidłowa akcja' });
    }
} catch (error) {
    console.error('❌ Błąd podczas obsługi zaproszenia:', error);
    return res.status(500).json({ error: 'Błąd serwera podczas obsługi zaproszenia' });
}
}

export async function getUserInvitations(req, res) {
try {
    const user = await UserModel.findById(req.user.userId).populate('invitations.guildId', 'name');
    if (!user) {
        return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }

    const pendingInvitations = user.invitations.filter(inv => inv.status === 'pending' && inv.guildId);
    const invitations = pendingInvitations.map(inv => ({
        guildId: inv.guildId._id,
        guildName: inv.guildId.name,
    }));

    return res.status(200).json({ invitations });
} catch (error) {
    console.error('Błąd podczas pobierania zaproszeń:', error);
    return res.status(500).json({ error: 'Błąd serwera podczas pobierania zaproszeń' });
}
}


export async function removeMember(req, res) {
try {
    const { guildId } = req.params; 
    const { memberId } = req.body; 
    const userId = req.user.userId;

    // Znajdź gildię
    const guild = await GuildModel.findById(guildId);
    if (!guild) {
        return res.status(404).json({ error: 'Gildia nie została znaleziona' });
    }

    // Sprawdź, czy użytkownik wykonujący żądanie jest właścicielem gildii
    if (guild.ownerId.toString() !== userId) {
        return res.status(403).json({ error: 'Nie masz uprawnień do usuwania członków z tej gildii' });
    }

    // Sprawdź, czy użytkownik do usunięcia jest członkiem gildii
    if (!guild.members.includes(memberId)) {
        return res.status(400).json({ error: 'Użytkownik nie jest członkiem tej gildii' });
    }

    // Usuń użytkownika z gildii
    guild.members = guild.members.filter((member) => member.toString() !== memberId);
    await guild.save();

    // Zaktualizuj dane użytkownika
    const user = await UserModel.findById(memberId);
    if (user) {
        user.isInGuild = false;
        user.guildId = null;
        await user.save();
    }

    res.status(200).json({ message: 'Członek został usunięty z gildii' });
} catch (error) {
    console.error('Błąd podczas usuwania członka gildii:', error);
    res.status(500).json({ error: 'Nie udało się usunąć członka gildii' });
}
}
export async function updateMaxMembers(req, res) {
try {
    const { guildId } = req.params; 
    const { maxMembers } = req.body; 
    const userId = req.user.userId; 

    // Znajdź gildię
    const guild = await GuildModel.findById(guildId);
    if (!guild) {
        return res.status(404).json({ error: 'Gildia nie została znaleziona' });
    }

    // Sprawdź, czy użytkownik wykonujący żądanie jest właścicielem gildii
    if (guild.ownerId.toString() !== userId) {
        return res.status(403).json({ error: 'Nie masz uprawnień do zmiany limitu członków w tej gildii' });
    }

    // Walidacja nowego limitu liczby członków
    if (typeof maxMembers !== 'number' || maxMembers <= 0) {
        return res.status(400).json({ error: 'Nieprawidłowy limit liczby członków' });
    }

    // Sprawdź, czy nowy limit jest większy lub równy liczbie aktualnych członków
    if (maxMembers < guild.members.length) {
        return res.status(400).json({
            error: `Limit nie może być mniejszy niż aktualna liczba członków (${guild.members.length})`,
        });
    }

    // Zaktualizuj limit liczby członków
    guild.maxMembers = maxMembers;
    await guild.save();

    res.status(200).json({ message: 'Limit liczby członków został zaktualizowany', maxMembers });
} catch (error) {
    console.error('Błąd podczas aktualizacji limitu członków:', error);
    res.status(500).json({ error: 'Nie udało się zaktualizować limitu członków' });
}
}

export async function deleteGuild(req, res) {
try {
    const { guildId } = req.params;
    const userId = req.user.userId;

    const guild = await GuildModel.findById(guildId);
    if (!guild) {
        return res.status(404).json({ error: 'Gildia nie została znaleziona' });
    }

    if (guild.ownerId.toString() !== userId) {
        return res.status(403).json({ error: 'Nie masz uprawnień do usunięcia tej gildii' });
    }

    await GuildModel.findByIdAndDelete(guildId);

    // Usuwanie gildii z użytkowników
    const members = await UserModel.updateMany(
        { guildId },
        { $set: { guildId: null, isInGuild: false } }
    );

    res.status(200).json({ message: 'Gildia została usunięta' });
} catch (error) {
    console.error('Błąd podczas usuwania gildii:', error);
    res.status(500).json({ error: 'Nie udało się usunąć gildii' });
}
}
