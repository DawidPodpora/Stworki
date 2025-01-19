import UserModel from '../model/User.model.js'; // Model użytkownika
import GuildModel from '../model/Guild.model.js'; // Model gildii

export async function enhanceUserWithGuildData(req, res, next) {
    try {
        // Sprawdzenie, czy użytkownik jest zalogowany
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: 'Nieprawidłowe dane użytkownika' });
        }

        // Pobierz użytkownika z bazy danych
        const user = await UserModel.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
        }

        // Pobranie gildii, której użytkownik jest właścicielem
        const ownedGuild = await GuildModel.findOne({ ownerId: user._id });

        // Dodanie `guildId` i `role` do `req.user`
        req.user.guildId = ownedGuild ? ownedGuild._id.toString() : null;
        req.user.role = ownedGuild ? 'owner' : 'user';

        console.log('Użytkownik zaktualizowany w middleware:', req.user);

        // Przekazanie do kolejnego middleware lub trasy
        next();
    } catch (error) {
        console.error('Błąd w middleware enhanceUserWithGuildData:', error);
        res.status(500).json({ error: 'Błąd serwera podczas pobierania danych użytkownika' });
    }
}
