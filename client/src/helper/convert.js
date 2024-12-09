/** image onto base64 */
export default function convertToBase64(file){
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();  // Tworzymy nowy obiekt FileReader, który pozwala na odczyt plików
        fileReader.readAsDataURL(file);  // Odczytujemy plik jako URL w formacie base64

        fileReader.onload = () => {  // Funkcja wywoływana, gdy odczyt pliku zakończy się sukcesem
            resolve(fileReader.result)  // Zwracamy wynik odczytu (base64 URL) poprzez Promise
        }

        fileReader.onerror = (error) => {  // Funkcja wywoływana, gdy wystąpi błąd podczas odczytu
            reject(error)  // Odrzucamy Promise z błędem
        }
    })
}
