import React from 'react'; // Importujemy bibliotekę React.

function Notice({ title, content }) { // Destrukturyzacja propsów: title (tytuł) i content (treść).
  return (
    <div className="bg-gray-700 p-4 mb-4 rounded-lg">  {/* Kontener div z tłem, paddingiem i zaokrąglonymi rogami */}
      <h3 className="text-xl font-bold text-white">{title}</h3> {/* Tytuł powiadomienia - biały tekst, pogrubiony */}
      <p className="text-white">{content}</p> {/* Treść powiadomienia - biały tekst */}
    </div>
  );
}

export default Notice; // Eksportujemy komponent, aby można go było używać w innych częściach aplikacji.
