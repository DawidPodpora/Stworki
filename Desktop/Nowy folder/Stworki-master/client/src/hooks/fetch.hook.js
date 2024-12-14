import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../helper/helper'

// Ustawienie domyślnego URL dla axios zdefiniowanego w zmiennych środowiskowych
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** Niestandardowy hook do pobierania danych z API */
export default function useFetch(query){
    // Stan do przechowywania danych z API, informacji o ładowaniu oraz błędach
    const [getData, setData] = useState({ 
        isLoading: false,   // Flaga informująca, czy dane są w trakcie ładowania
        apiData: undefined, // Przechowywanie danych z API
        status: null,       // Status odpowiedzi z API
        serverError: null   // Przechowywanie błędów serwera (jeśli wystąpiły)
    });

    // Efekt uruchamiany po każdej zmianie zapytania 'query'
    useEffect(() => {

        // Funkcja do pobierania danych z API
        const fetchData = async () => {
            try {
                // Ustawienie flagi isLoading na true, aby zasygnalizować rozpoczęcie ładowania
                setData(prev => ({ ...prev, isLoading: true}));

                // Jeśli zapytanie 'query' jest puste, pobieramy dane na podstawie nazwy użytkownika
                const { username } = !query ? await getUsername() : '';

                // Pobieranie danych z API. Jeśli 'query' nie jest puste, używamy tego zapytania,
                // w przeciwnym przypadku pobieramy dane użytkownika na podstawie 'username'
                const { data, status } = !query ? 
                    await axios.get(`/api/user/${username}`) : 
                    await axios.get(`/api/${query}`);

                // Jeśli odpowiedź z serwera ma status 201 (sukces), aktualizujemy stan
                if(status === 201){
                    setData(prev => ({ ...prev, isLoading: false }));
                    setData(prev => ({ ...prev, apiData: data, status: status }));
                }

                // Jeśli status nie wynosi 201, to nadal wyłączamy ładowanie, ale nie zmieniamy danych
                setData(prev => ({ ...prev, isLoading: false }));
            } catch (error) {
                // W przypadku błędu ustawiamy flagę ładowania na false oraz zapisujemy błąd serwera
                setData(prev => ({ ...prev, isLoading: false, serverError: error }));
            }
        };

        // Wywołanie funkcji fetchData w celu pobrania danych
        fetchData();

    }, [query]);  // Zależność od zmiennej 'query', efekt uruchomi się, gdy 'query' ulegnie zmianie

    // Zwracamy stan z danymi i funkcję do ich zmiany
    return [getData, setData];
}
