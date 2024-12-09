import create from 'zustand'; // Importujemy funkcję create z biblioteki zustand, która pozwala na tworzenie globalnego stanu

// Tworzymy globalny stan dla autentykacji użytkownika za pomocą zustand
export const useAuthStore = create((set) => ({
    auth: { // Stan przechowujący dane o użytkowniku
        username: '', // Przechowuje nazwę użytkownika
        active: false // Określa, czy użytkownik jest aktywny (np. zalogowany)
    },
    // Funkcja do aktualizacji nazwy użytkownika w stanie
    setUsername: (name) => set((state) => ({
        auth: { 
            ...state.auth, // Kopiujemy aktualny stan 'auth'
            username: name // Ustawiamy nową nazwę użytkownika
        }
    }))
}))
