import TestButton2 from './ContentComponents/TestButton2.js'; // Import komponentu TestButton2
import TestButton3 from './ContentComponents/TestButton3.js'; // Import komponentu TestButton3
import StartPage from './ContentComponents/StartPage.js'; // Import komponentu StartPage

// Komponent odpowiedzialny za wyświetlanie zawartości w zależności od wybranego przycisku
function Content({ selectedButton }) {
  let ComponentToRender; // Zmienna przechowująca referencję do komponentu, który ma być renderowany

  // Logika wyboru komponentu na podstawie wartości `selectedButton`
  switch (selectedButton) {
    case 1:
      ComponentToRender = StartPage; // Wybrany komponent: StartPage
      console.log(selectedButton); // Debug: wyświetlenie numeru wybranego przycisku
      break;
    case 2:
      ComponentToRender = TestButton2; // Wybrany komponent: TestButton2
      break;
    case 3:
      ComponentToRender = TestButton3; // Wybrany komponent: TestButton3
      break;
    default:
      // Domyślny przypadek, gdy `selectedButton` nie pasuje do żadnej wartości
      ComponentToRender = () => <div>Brak komponentu do renderowania</div>;
      break;
  }

  // Wygląd sekcji zawartości
  return (
    <div className="absolute w-4/5 bg-black1 h-screen right-0">
      {/* Renderowanie wybranego komponentu */}
      <ComponentToRender />
    </div>
  );
}

export default Content; // Eksport komponentu Content
