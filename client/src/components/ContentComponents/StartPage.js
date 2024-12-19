import React from 'react';
import Chat from './Chat';
import Notice from './Notice'; // Komponent do wyświetlania ogłoszeń

function StartPage({data}) {
  // Treści ogłoszeń
  const notices = [
    {
      title: "Wielka Bitwa nadchodzi!",
      content: "Nadchodzi nowa wielka bitwa z potężnymi przeciwnikami. Zbieraj drużynę, aby stawić im czoła!"
    },
    {
      title: "Mityczna Arena: Turniej Władców",
      content: "Zgłoś się do nowego turnieju w Mitycznej Arenie! Zwycięzca zdobędzie tytuł Władcy i unikalne nagrody."
    },
    {
      title: "Aktualizacja systemu rankingowego",
      content: "Nasz system rankingowy zostanie zaktualizowany, aby dostarczyć dokładniejsze wyniki. Czas przerwy: 2 godziny, w poniedziałek, 9 grudnia."
    },
    {
      title: "Nowa Istota do Zrekrutowania",
      content: "Uwolniliśmy nową mityczną istotę: Feniksa! Zdobądź go, by zyskać przewagę w nadchodzących bitwach."
    },
    {
      title: "Nowy Rekord na Liście Rankingowej!",
      content: "Wielki wojownik, Drakon, pobił rekord punktów w rankingach! Czy dasz radę go pokonać?"
    },
    {
      title: "Przygotowanie do Bitwy",
      content: "Wszystkie istoty muszą być gotowe do nadchodzącej bitwy. Upewnij się, że Twój zespół jest pełny przed startem!"
    }
  ];

  return (
    <div className="flex h-full">
      {/* Tablica Ogłoszeń */}
      <div className="w-2/3 bg-gray-800 p-4">
        <h2 className="text-2xl font-bold text-white mb-4">Tablica Ogłoszeń</h2>
        
        {/* Dynamicznie renderowanie ogłoszeń */}
        {notices.map((notice, index) => (
          <Notice key={index} title={notice.title} content={notice.content} />
        ))}
      </div>

      {/* Sekcja czatu */}
      <div className="w-1/3 flex flex-col justify-between bg-gray-900 p-4 border-l border-gray-700">
        <h2 className="text-2xl font-bold text-white">Czat</h2>
        <Chat data={data} />
      </div>
    </div>
  );
}

export default StartPage;
