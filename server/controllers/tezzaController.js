import UserModel from '../model/User.model.js';

/**
 * Ustawienie tezy użytkownika na 30 minut.
 */
export async function setTeza(req, res) {
    try {
        const userId = req.user.userId; // Pobranie ID użytkownika z tokena
        const { teza } = req.body;

        if (!teza || teza.trim() === "") {
            return res.status(400).json({ error: "Teza nie może być pusta." });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Użytkownik nie znaleziony." });
        }

        // Zapisanie tezy wraz z timestampem
        user.teza = teza;
        user.tezaTimestamp = new Date();
        await user.save();

        res.status(200).json({ message: "Teza zapisana na 30 minut." });
    } catch (error) {
        console.error("Błąd podczas zapisywania tezy:", error);
        res.status(500).json({ error: "Błąd serwera." });
    }
}
