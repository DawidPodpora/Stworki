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
        console.log('Otrzymane dane:', req.body);
        console.log('Użytkownik z tokena:', req.user);

        const { name, goal, maxMembers, bonus_exp, bonus_gold } = req.body;
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({ error: 'Nieprawidłowy token użytkownika' });
        }

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Nazwa gildii jest wymagana' });
        }

        if (!goal || typeof goal !== 'string') {
            return res.status(400).json({ error: 'Opis gildii jest wymagany' });
        }

        if (!maxMembers || typeof maxMembers !== 'number' || maxMembers <= 0) {
            return res.status(400).json({ error: 'Nieprawidłowa maksymalna liczba członków' });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Użytkownik nie istnieje' });
        }

        if (user.isInGuild) {
            return res.status(400).json({ error: 'Najpierw opuść swoją obecną gildię, aby stworzyć nową' });
        }

        // Sprawdzenie, czy użytkownik ma wystarczająco złota
        if (user.money < 50) {
            return res.status(400).json({ error: 'Nie masz wystarczająco złota, aby stworzyć gildię.' });
        }

        if (user.exp < 50) {
            if (bonus_exp < 1 || bonus_exp > 10 || bonus_gold < 1 || bonus_gold > 10) {
                return res.status(400).json({ error: `Bonusy muszą być w zakresie 1-10%. Podano: EXP ${bonus_exp}%, Gold ${bonus_gold}%` });
            }
        } else {
            if (bonus_exp < 10 || bonus_exp > 20 || bonus_gold < 10 || bonus_gold > 20) {
                return res.status(400).json({ error: `Bonusy muszą być w zakresie 10-20%. Podano: EXP ${bonus_exp}%, Gold ${bonus_gold}%` });
            }
        }
        

        // Tworzenie nowej gildii
        const newGuild = new GuildModel({
            name,
            goal,
            maxMembers,
            members: [mongoose.Types.ObjectId(userId)],
            ownerId: mongoose.Types.ObjectId(userId),
            bonus_exp,
            bonus_gold
        });

        await newGuild.save();

        // Odejmowanie złota za założenie gildii
        user.money -= 50;
        user.isInGuild = true;
        user.guildId = newGuild._id;
        await user.save();

        res.status(201).json({ message: 'Gildia została pomyślnie utworzona', guild: newGuild });
    } catch (error) {
        console.error('Błąd podczas tworzenia gildii:', error);
        res.status(500).json({ error: 'Nie udało się utworzyć gildii' });
    }
}





export async function getOnlineUsers(req, res) {
    try {
        const now = new Date();
       

        // Pobierz użytkowników online
        const onlineUsers = await UserModel.find({
            isOnline: true, // Użytkownik jest online
        }).select("username exp teza tezaTimestamp");

        console.log("Online Users Data:", onlineUsers); // Debugowanie

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
        const user = await UserModel.findById(req.user.userId)
            .populate({
                path: 'invitations.guildId',
                select: 'name bonus_exp bonus_gold'
            });

        if (!user) {
            return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
        }

        console.log("📥 Pobieranie zaproszeń z gildii:", user.invitations);

        // Sprawdzenie, czy dane są poprawnie pobierane
        const invitations = user.invitations
            .filter(inv => inv.guildId) // Filtrujemy null/undefined
            .map(inv => ({
                guildId: inv.guildId._id.toString(), // Konwersja na string
                guildName: inv.guildId.name,
                bonusExp: inv.guildId.bonus_exp ?? 0,  // Pobranie bonusu EXP
                bonusGold: inv.guildId.bonus_gold ?? 0 // Pobranie bonusu GOLD
            }));

        console.log("📤 API zwraca zaproszenia:", invitations); // Debugowanie

        return res.status(200).json({ invitations });
    } catch (error) {
        console.error('❌ Błąd podczas pobierania zaproszeń:', error);
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
