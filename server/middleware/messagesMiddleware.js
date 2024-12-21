export const setExpiresAt = function (next) {
    // Sprawdzenie, czy `expiresAt` nie zostało ustawione
    if (!this.expiresAt) {
        // Ustaw `expiresAt` na 7 dni od `createdAt`
        this.expiresAt = new Date(this.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
    next(); // Przejdź do następnej funkcji
};
