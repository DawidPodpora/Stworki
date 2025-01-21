import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Tłumaczenia zapisane w obiekcie zamiast w plikach JSON
const resources = {
    en: {
        translation: {
            "home": "Home",
            "myCreatures": "My Creatures",
            "shop": "Shop",
            "privateMessages": "Private messages",
            "market": "Market",
            "missions": "Missions",
            "guilds": "Guilds",
            "welcome": "Welcome",
            "loadingUser": "Loading user data...",
            "options": "Options",
            "logout": "Logout",
            "chooseLanguage": "Choose your language",
            "fetchError": "Error fetching notices: ",
            "titleAndContentRequired": "Title and content are required!",
            "addNoticeError": "Error adding notice!",
            "serverError": "Server error: ",
            "deleteNoticeError": "Error deleting notice!",
            "noticeBoard": "Notice Board",
            "addNotice": "Add Notice",
            "chat": "Chat",
            "addNewNotice": "Add New Notice",
            "title": "Title",
            "content": "Content",
            "cancel": "Cancel",
            "add": "Add",
            "typeMessage": "Type message...",
            "send": "Send",
            "fetchUserDataError": "Error fetching user data:",
            "noTokenWarning": "No token found in localStorage",
            "power": "POW",
            "vitality": "VIT",
            "strength": "STR",
            "dexterity": "DEX",
            "intelligence": "INT",
            "level": "Level:",
            "loading": "Loading...",
            "type": "TYPE:",
            "armor": "ARMOR",
            "element": "ELEMENT",
            "fetchShopError": "Error fetching shop:",
            "buyError": "Buy error:",
            "inventory": "Inventory",
            "newShop": "New Shop",
            "price": "Price:",
            "coins": "coins",
            "buyButton": "Buy item",
            "emptyInventory": "Your inventor is empty!",
            "sellValue": "Sell value:",
            "sellButton": "Sell item",
            "fetchMessagesError": "Error fetching messages:",
            "deleteMessagesError": "Error deleting messages",
            "titleAndContent": "Title and content are required!",
            "privateMessages": "Private messages",
            "refresh": "Refresh",
            "sendMessage": "Send message",
            "sendMessageToAll": "Send to all",
            "from": "From:",
            "unknownUser": "Unknown user",
            "delete": "Delete",
            "hide": "Hide",
            "show": "Show",
            "reply": "Reply",
            "noMessages": "No messages",
            "replyTo": "Reply to",
            "receiver": "Receiver",
            "fetchMarketError": "Error fetching market:",
            "fetchInventoryError": "Error fetching inventory:",
            "ended": "Ended",
            "tokenOrItemWarning": "No token or no item selected",
            "listingError": "Item listing error:",
            "itemListed": "Item has been listed!",
            "purchasingItemError": "Item purchase error:",
            "itemHasBeenPurchased": "The item has been purchased!",
            "biddingError": "Bidding error:",
            "offerSubmission": "Offer has been submitted!",
            "noItemsInTheMarket": "No items in the market.",
            "noName": "No name",
            "currentOffer": "Current offer:",
            "startingPrice": "Starting price:",
            "timeToEnd": "Time left:",
            "buy": "Buy",
            "bid": "Bid",
            "sellOrAuction": "Sell or auction",
            "duration": "Duration",
            "2h": "2 hours",
            "8h": "8 hours",
            "24h": "24 hours",
            "commission": "Commission",
            "creatureNotChoosed": "Creature not choosed",
            "missionNotChoosed": "Mission not choosed",
            "claim": "CLAIM",
            "minutes": "MINUTES",
            "accept": "ACCEPT",
            "isOnMission": "IS ON MISSION",
            "fetchGuildsError": "Error fetching guilds:",
            "fetchOnlineUsersError": "Error fetching online users:",
            "allFilesRequired": "All files are required!",
            "incorrectBonusValues": "Incorrect bonus values. Your EXP level allows values ​​between:",
            "notEnoughGoldToCreateGuil": "You do not have enough gold to create a guild, amount - 20.",
            "firstLeaveYourGuild": "First leave your current guild",
            "firstLeaveYourGuildOrDelete": "First, leave or delete your current guild to create a new one.",
            "failedToCreateGuild": "Failed to create guild",
            "guildCreated": "The guild has been successfully created!",
            "errorCreatinGuild": "Error creating guild:",
            "errorSavingThesis": "Error while saving thesis:",
            "thesisSaved": "Thesis has been saved and will expire in 30 minutes!",
            "leavingGuildError": "Couldn't leave the guild",
            "leavingGuild": "You left the guild",
            "deletingGuildError": "Guild deletion failed",
            "guildDeleted": "The guild has been deleted",
            "yourGuild": "Your guild",
            "expBonus": "🎖 EXP bonus:",
            "goldBonus": "💰 gold bonus:",
            "leave": "Leave",
            "notMember": "You are not a member of any guild",
            "usersOnline": "Users online",
            "addThesis": "Add your thesis",
            "saveThesis": "Save thesis",
            "noUsersOnline": "No users online... where did they all go?",
            "createGuild": "Create a guild",
            "guildName": "Guild name",
            "guildDescription": "Guild description",
            "maxNumberOfMembers": "Maximum number of members",
            "enterThesis": "Enter your thesis...",
            "invitations": "Invitations",
            "reject": "REJECT",
            "noInvitations": "No invitations",
            "fetchInvitationsError": "Error fetching invitations",
            "rejectedInvitation": "The invitation was declined.",
            "invitationHandlingError": "Error handling invitation:",
            "return": "Return",
            "members": "Members:",
            "membersLimit": "Users limit",
            "sendInvitation": "Send an invitation",
            "update": "Update",
            "getGuildMembersUsernamesError": "Error getting guild member usernames:",
            "onlyOwnerCanChangeUserLimit": "Only the guild owner can change the user limit.",
            "updateUserLimitError": "Failed to update limit",
            "updateUserLimit": "User limit has been updated",
            "onlyOwnerCanRemoveMembers": "Only the guild owner can remove members",
            "removingMemberError": "Error while kicking member",
            "memberRemoved": "The member was kicked out",
            "onlyOwnerCanSendInvitation": "Only the guild owner can send invitations",
            "enterUsername": "Enter your username",
            "sendingInvitationError": "Error sending invitation",
            "invitationSended": "Invitation sent to user {{username}}"
        }
    },
    pl: {
        translation: {
            "home": "Strona główna",
            "myCreatures": "Moje stworki",
            "shop": "Sklep",
            "privateMessages": "Wiadomości prywatne",
            "market": "Market",
            "missions": "Misje",
            "guilds": "Gildie",
            "welcome": "Witaj",
            "loadingUser": "Ładowanie danych użytkownika...",
            "options": "Opcje",
            "logout": "Wyloguj",
            "chooseLanguage": "Wybierz język",
            "fetchError": "Błąd podczas pobierania ogłoszeń: ",
            "titleAndContentRequired": "Tytuł i treść są wymagane!",
            "addNoticeError": "Błąd podczas dodawania ogłoszenia!",
            "serverError": "Błąd serwera: ",
            "deleteNoticeError": "Błąd podczas usuwania ogłoszenia!",
            "noticeBoard": "Tablica ogłoszeń",
            "addNotice": "Dodaj ogłoszenie",
            "chat": "Czat",
            "addNewNotice": "Dodaj nowe ogłoszenie",
            "title": "Tytuł",
            "content": "Treść",
            "cancel": "Anuluj",
            "add": "Dodaj",
            "typeMessage": "Wpisz swoją wiadomość...",
            "send": "Wyślij",
            "fetchUserDataError": "Błąd pobierania danych użytkownika:",
            "noTokenWarning": "Brak tokenu w localStorage",
            "power": "MOC",
            "vitality": "WIT",
            "strength": "SIŁ",
            "dexterity": "ZRĘ",
            "intelligence": "INT",
            "level": "Poziom:",
            "loading": "Ładowanie...",
            "type": "TYP:",
            "armor": "PANCERZ",
            "element": "ŻYWIOŁ",
            "fetchShopError": "Błąd pobierania sklepu:",
            "buyError": "Błąd kupna:",
            "inventory": "Ekwipunek",
            "newShop": "Nowy sklep",
            "price": "Cena:",
            "coins": "monet",
            "buyButton": "Kup przedmiot",
            "emptyInventory": "Twój ekwipunek jest pusty!",
            "sellValue": "Wartość sprzedaży:",
            "sellButton": "Sprzedaj",
            "fetchMessagesError": "Błąd podczas pobierania wiadomości",
            "deleteMessagesError": "Błąd podczas usuwania wiadomości",
            "titleAndContent": "Tytuł i treść są wymagane!",
            "privateMessages": "Wiadomości prywatne",
            "refresh": "Odśwież",
            "sendMessage": "Wyślij wiadomość",
            "sendMessageToAll": "Wiadomość do wszystkich",
            "from": "Od:",
            "unknownUser": "Nieznany użytkownik",
            "delete": "Usuń",
            "hide": "Zwiń",
            "show": "Zobacz szczegóły",
            "reply": "Odpowiedz",
            "noMessages": "Brak wiadomości",
            "replyTo": "Odpowiedź do",
            "receiver": "Odbiorca",
            "fetchMarketError": "Błąd pobierania przedmiotów na markecie:",
            "fetchInventoryError": "Błąd pobierania ekwipunku:",
            "ended": "Zakończono",
            "tokenOrItemWarning": "Brak tokenu lub nie wybrano przedmiotu",
            "listingError": "Błąd wystawiania przedmiotu:",
            "itemListed": "Przedmiot został wystawiony!",
            "purchasingItemError": "Błąd zakupu przedmiotu:",
            "itemHasBeenPurchased": "Przedmiot został kupiony!",
            "biddingError": "Błąd licytacji:",
            "offerSubmission": "Oferta została złożona!",
            "noItemsInTheMarket": "Brak przedmiotów na markecie.",
            "noName": "Brak nazwy",
            "currentOffer": "Aktualna oferta:",
            "startingPrice": "Cena startowa:",
            "timeToEnd": "Czas do końca:",
            "buy": "Kup",
            "bid": "Licytuj",
            "sellOrAuction": "Wystaw na sprzedaż lub licytację",
            "duration": "Czas trwania",
            "2h": "2 godziny",
            "8h": "8 godzin",
            "24h": "24 godziny",
            "commission": "Prowizja",
            "creatureNotChoosed": "Postać nie wybrana",
            "missionNotChoosed": "Misja nie wybrana",
            "claim": "ODBIERZ",
            "minutes": "MINUT",
            "accept": "AKCEPTUJ",
            "isOnMission": "JEST NA MISJI",
            "fetchGuildsError": "Błąd podczas pobierania gildii:",
            "fetchOnlineUsersError": "Błąd podczas pobieranie użytkowników online:",
            "allFilesRequired": "Wszystkie pola są wymagane!",
            "incorrectBonusValues": "Nieprawidłowe wartości bonusów. Dla Twojego poziomu EXP dozwolone są wartości między:",
            "notEnoughGoldToCreateGuil": "Nie masz wystarczająco złota, aby stworzyć gildię, kwota - 20.",
            "firstLeaveYourGuild": "Najpierw opuść swoją obecną gildię",
            "firstLeaveYourGuildOrDelete": "Najpierw opuść swoją obecną gildię lub ją usuń, aby stworzyć nową.",
            "failedToCreateGuild": "Nie udało się utworzyć gildii",
            "guildCreated": "Gildia została pomyślnie stworzona!",
            "errorCreatinGuild": "Błąd podczas tworzenia gildii:",
            "errorSavingThesis": "Błąd podczas zapisywania tezy:",
            "thesisSaved": "Teza została zapisana i wygaśnie za 30 minut!",
            "leavingGuildError": "Nie udało się opuścić gildii",
            "leavingGuild": "Opuściłeś gildię",
            "deletingGuildError": "Nie udało się usunąć gildii",
            "guildDeleted": "Gildia została usunięta",
            "yourGuild": "Twoja gildia",
            "expBonus": "🎖 Bonus EXP:",
            "goldBonus": "💰 Bonus złota:",
            "leave": "Opuść",
            "notMember": "Nie jesteś członkiem żadnej gildii",
            "usersOnline": "Użytkownicy online",
            "addThesis": "Dodaj swoją tezę",
            "saveThesis": "Zapisz tezę",
            "noUsersOnline": "Brak użytkowników online... gdzie oni wszyscy poszli?",
            "createGuild": "Stwórz gildię",
            "guildName": "Nazwa gildii",
            "guildDescription": "Opis gildii",
            "maxNumberOfMembers": "Maksymalna liczba człónków",
            "enterThesis": "Wpisz swoją tezę...",
            "invitations": "Zaproszenia",
            "reject": "ODRZUĆ",
            "noInvitations": "Brak zaproszeń",
            "fetchInvitationsError": "Błąd podczas pobierania zaproszeń",
            "rejectedInvitation": "Zaproszenie zostało odrzucone.",
            "invitationHandlingError": "Błąd podczas obsługi zaproszenia:",
            "return": "Powrót",
            "members": "Członkowie:",
            "membersLimit": "Limit użytkowników",
            "sendInvitation": "Wyślij zaproszenie",
            "update": "Zaktualizuj",
            "getGuildMembersUsernamesError": "Błąd podczas pobierania nazw użytkowników członków gildii:",
            "onlyOwnerCanChangeUserLimit": "Tylko właściciel gildii może zmieniać limit użytkowników",
            "updateUserLimitError": "Nie udało się zaktualizować limitu użytkowników",
            "updateUserLimit": "Limit użytkowników został zaktualizowany",
            "onlyOwnerCanRemoveMembers": "Tylko właściciel gildii może usuwać członków",
            "removingMemberError": "Błąd podczas wyrzucania członka",
            "memberRemoved": "Członek został usunięty",
            "onlyOwnerCanSendInvitation": "Tylko właściciel gildii może wysyłać zaproszenia",
            "enterUsername": "Wpisz nazwę użytkownika",
            "sendingInvitationError": "Błąd podczas wysyłania zaproszenia",
            "invitationSended": "Zaproszenie wysłane do użytkownika {{username}}"
        }
    },
    ua: {
        translation: {
            "home": "Головна",
            "myCreatures": "Мої створіння",
            "shop": "Магазин",
            "privateMessages": "Приватні повідомлення",
            "market": "Ринок",
            "missions": "Місії",
            "guilds": "Гільдії",
            "welcome": "Ласкаво просимо",
            "loadingUser": "Завантаження даних користувача...",
            "options": "Налаштування",
            "logout": "Вийти",
            "chooseLanguage": "Оберіть мову",
            "fetchError": "Помилка отримання даних",
            "titleAndContentRequired": "Заголовок і вміст обов'язкові",
            "addNoticeError": "Помилка додавання оголошення",
            "serverError": "Помилка сервера",
            "deleteNoticeError": "Помилка видалення оголошення",
            "noticeBoard": "Дошка оголошень",
            "addNotice": "Додати оголошення",
            "chat": "Чат",
            "addNewNotice": "Додати нове оголошення",
            "title": "Заголовок",
            "content": "Вміст",
            "cancel": "Скасувати",
            "add": "Додати",
            "typeMessage": "Напишіть повідомлення...",
            "send": "Надіслати",
            "fetchUserDataError": "Помилка отримання даних користувача:",
            "noTokenWarning": "Відсутній токен у localStorage",
            "power": "Сила",
            "vitality": "Живучість",
            "strength": "Міць",
            "dexterity": "Спритність",
            "intelligence": "Інтелект",
            "level": "Рівень",
            "loading": "Завантаження...",
            "type": "Тип",
            "armor": "Броня",
            "element": "Елемент",
            "fetchShopError": "Помилка отримання даних магазину",
            "buyError": "Помилка покупки",
            "inventory": "Інвентар",
            "newShop": "Новий магазин",
            "price": "Ціна",
            "coins": "Монети",
            "buyButton": "Купити",
            "emptyInventory": "Порожній інвентар",
            "sellValue": "Ціна продажу",
            "sellButton": "Продати",
            "fetchMessagesError": "Помилка отримання повідомлень",
            "deleteMessagesError": "Помилка видалення повідомлень",
            "titleAndContent": "Заголовок і вміст",
            "privateMessages": "Приватні повідомлення",
            "refresh": "Оновити",
            "sendMessage": "Надіслати повідомлення",
            "sendMessageToAll": "Надіслати всім",
            "from": "Від",
            "unknownUser": "Невідомий користувач",
            "delete": "Видалити",
            "hide": "Приховати",
            "show": "Показати",
            "reply": "Відповісти",
            "noMessages": "Немає повідомлень",
            "replyTo": "Відповісти",
            "receiver": "Отримувач",
            "fetchMarketError": "Помилка отримання даних ринку",
            "fetchInventoryError": "Помилка отримання інвентарю",
            "ended": "Закінчено",
            "tokenOrItemWarning": "Попередження: відсутній токен або предмет",
            "listingError": "Помилка виставлення",
            "itemListed": "Предмет виставлено",
            "purchasingItemError": "Помилка купівлі предмета",
            "itemHasBeenPurchased": "Предмет придбано",
            "biddingError": "Помилка ставки",
            "offerSubmission": "Пропозиція надіслана",
            "noItemsInTheMarket": "Немає предметів на ринку",
            "noName": "Без назви",
            "currentOffer": "Поточна пропозиція",
            "startingPrice": "Початкова ціна",
            "timeToEnd": "Час до завершення",
            "buy": "Купити",
            "bid": "Ставка",
            "sellOrAuction": "Продати або виставити на аукціон",
            "duration": "Тривалість",
            "2h": "2 години",
            "8h": "8 годин",
            "24h": "24 години",
            "commission": "Комісія",
            "creatureNotChoosed": "Створіння не вибрано",
       "missionNotChoosed": "Місію не вибрано",
    "claim": "Отримати",
    "minutes": "Хвилини",
    "accept": "Прийняти",
    "isOnMission": "На місії",
    "fetchGuildsError": "Помилка завантаження гільдій",
    "fetchOnlineUsersError": "Помилка завантаження онлайн-користувачів",
    "allFilesRequired": "Потрібні всі файли",
    "incorrectBonusValues": "Неправильні значення бонусів",
    "notEnoughGoldToCreateGuil": "Недостатньо золота для створення гільдії",
    "firstLeaveYourGuild": "Спочатку залиште свою гільдію",
    "firstLeaveYourGuildOrDelete": "Спочатку залиште свою гільдію або видаліть її",
    "failedToCreateGuild": "Не вдалося створити гільдію",
    "guildCreated": "Гільдію створено",
    "errorCreatinGuild": "Помилка створення гільдії",
    "errorSavingThesis": "Помилка збереження тези",
    "thesisSaved": "Тезу збережено",
    "leavingGuildError": "Помилка виходу з гільдії",
    "leavingGuild": "Вихід з гільдії",
    "deletingGuildError": "Помилка видалення гільдії",
    "guildDeleted": "Гільдію видалено",
    "yourGuild": "Ваша гільдія",
    "expBonus": "🎖Бонус досвіду",
    "goldBonus": "💰Бонус золота",
    "leave": "Вийти",
    "notMember": "Не є учасником",
    "usersOnline": "Користувачі онлайн",
    "addThesis": "Додати тези",
    "saveThesis": "Зберегти тези",
    "noUsersOnline": "Немає користувачів онлайн",
    "createGuild": "Створити гільдію",
    "guildName": "Назва гільдії",
    "guildDescription": "Опис гільдії",
    "maxNumberOfMembers": "Максимальна кількість учасників",
    "enterThesis": "Введіть тези",
    "invitations": "Запрошення",
    "reject": "Відхилити",
    "noInvitations": "Немає запрошень",
    "fetchInvitationsError": "Помилка завантаження запрошень",
    "rejectedInvitation": "Запрошення відхилено",
    "invitationHandlingError": "Помилка обробки запрошення",
    "return": "Повернутися",
    "members": "Учасники",
    "membersLimit": "Ліміт учасників",
    "sendInvitation": "Надіслати запрошення",
    "update": "Оновити",
    "getGuildMembersUsernamesError": "Помилка отримання імен користувачів гільдії",
    "onlyOwnerCanChangeUserLimit": "Тільки власник може змінювати ліміт учасників",
    "updateUserLimitError": "Помилка оновлення ліміту учасників",
    "updateUserLimit": "Оновити ліміт учасників",
    "onlyOwnerCanRemoveMembers": "Тільки власник може видаляти учасників",
    "removingMemberError": "Помилка видалення учасника",
    "memberRemoved": "Учасника видалено",
    "onlyOwnerCanSendInvitation": "Тільки власник може надсилати запрошення",
    "enterUsername": "Введіть ім'я користувача",
    "sendingInvitationError": "Помилка надсилання запрошення",
    "invitationSended": "Запрошення надіслано {{username}}"
        }
    },ru: {
        translation: {
            "home": "Главная",
            "myCreatures": "Мои существа",
            "shop": "Магазин",
            "privateMessages": "Личные сообщения",
            "market": "Рынок",
            "missions": "Миссии",
            "guilds": "Гильдии",
            "welcome": "Добро пожаловать",
            "loadingUser": "Загрузка данных пользователя...",
            "options": "Настройки",
            "logout": "Выход",
            "chooseLanguage": "Выберите язык",
            "fetchError": "Ошибка загрузки данных",
            "titleAndContentRequired": "Требуются заголовок и содержание",
            "addNoticeError": "Ошибка добавления объявления",
            "serverError": "Ошибка сервера",
            "deleteNoticeError": "Ошибка удаления объявления",
            "noticeBoard": "Доска объявлений",
            "addNotice": "Добавить объявление",
            "chat": "Чат",
            "addNewNotice": "Добавить новое объявление",
            "title": "Заголовок",
            "content": "Содержание",
            "cancel": "Отмена",
            "add": "Добавить",
            "typeMessage": "Напишите сообщение...",
            "send": "Отправить",
            "fetchUserDataError": "Ошибка загрузки данных пользователя:",
            "noTokenWarning": "Отсутствует токен в localStorage",
            "power": "Сила",
            "vitality": "Живучесть",
            "strength": "Мощь",
            "dexterity": "Ловкость",
            "intelligence": "Интеллект",
            "level": "Уровень",
            "loading": "Загрузка...",
            "type": "Тип",
            "armor": "Броня",
            "element": "Элемент",
            "fetchShopError": "Ошибка загрузки магазина",
            "buyError": "Ошибка покупки",
            "inventory": "Инвентарь",
            "newShop": "Новый магазин",
            "price": "Цена",
            "coins": "Монеты",
            "buyButton": "Купить",
            "emptyInventory": "Пустой инвентарь",
            "sellValue": "Стоимость продажи",
            "sellButton": "Продать",
            "fetchMessagesError": "Ошибка загрузки сообщений",
            "deleteMessagesError": "Ошибка удаления сообщений",
            "titleAndContent": "Заголовок и содержание",
            "privateMessages": "Личные сообщения",
            "refresh": "Обновить",
            "sendMessage": "Отправить сообщение",
            "sendMessageToAll": "Отправить всем",
            "from": "От",
            "unknownUser": "Неизвестный пользователь",
            "delete": "Удалить",
            "hide": "Скрыть",
            "show": "Показать",
            "reply": "Ответить",
            "noMessages": "Нет сообщений",
            "replyTo": "Ответить",
            "receiver": "Получатель",
            "fetchMarketError": "Ошибка загрузки рынка",
            "fetchInventoryError": "Ошибка загрузки инвентаря",
            "ended": "Завершено",
            "tokenOrItemWarning": "Предупреждение: отсутствует токен или предмет",
            "listingError": "Ошибка размещения",
            "itemListed": "Предмет размещен",
            "purchasingItemError": "Ошибка покупки предмета",
            "itemHasBeenPurchased": "Предмет куплен",
            "biddingError": "Ошибка ставки",
            "offerSubmission": "Предложение отправлено",
            "noItemsInTheMarket": "Нет предметов на рынке",
            "noName": "Без названия",
            "currentOffer": "Текущая ставка",
            "startingPrice": "Начальная цена",
            "timeToEnd": "Время до завершения",
            "buy": "Купить",
            "bid": "Ставка",
            "sellOrAuction": "Продать или выставить на аукцион",
            "duration": "Длительность",
            "2h": "2 часа",
            "8h": "8 часов",
            "24h": "24 часа",
            "commission": "Комиссия",
            "creatureNotChoosed": "Существо не выбрано",
            "missionNotChoosed": "Миссия не выбрана",
            "claim": "Получить",
            "minutes": "Минуты",
            "accept": "Принять",
            "isOnMission": "На миссии",
            "fetchGuildsError": "Ошибка загрузки гильдий",
            "fetchOnlineUsersError": "Ошибка загрузки онлайн-пользователей",
            "allFilesRequired": "Все файлы обязательны",
            "incorrectBonusValues": "Некорректные значения бонусов",
            "notEnoughGoldToCreateGuil": "Недостаточно золота для создания гильдии",
            "firstLeaveYourGuild": "Сначала покиньте свою гильдию",
            "firstLeaveYourGuildOrDelete": "Сначала покиньте свою гильдию или удалите её",
            "failedToCreateGuild": "Не удалось создать гильдию",
            "guildCreated": "Гильдия создана",
            "errorCreatinGuild": "Ошибка создания гильдии",
            "errorSavingThesis": "Ошибка сохранения тезиса",
            "thesisSaved": "Тезис сохранён",
            "leavingGuildError": "Ошибка выхода из гильдии",
            "leavingGuild": "Выход из гильдии",
            "deletingGuildError": "Ошибка удаления гильдии",
            "guildDeleted": "Гильдия удалена",
            "yourGuild": "Ваша гильдия",
            "expBonus": "🎖 Бонус опыта",
            "goldBonus": "💰Бонус золота",
            "leave": "Выйти",
            "notMember": "Не является участником",
            "usersOnline": "Пользователи онлайн",
            "addThesis": "Добавить тезис",
            "saveThesis": "Сохранить тезис",
            "noUsersOnline": "Нет пользователей онлайн",
            "createGuild": "Создать гильдию",
            "guildName": "Название гильдии",
            "guildDescription": "Описание гильдии",
            "maxNumberOfMembers": "Максимальное количество участников",
            "enterThesis": "Введите тезис",
            "invitations": "Приглашения",
            "reject": "Отклонить",
            "noInvitations": "Нет приглашений",
            "fetchInvitationsError": "Ошибка загрузки приглашений",
            "rejectedInvitation": "Приглашение отклонено",
            "invitationHandlingError": "Ошибка обработки приглашения",
            "return": "Вернуться",
            "members": "Участники",
            "membersLimit": "Лимит участников",
            "sendInvitation": "Отправить приглашение",
            "update": "Обновить",
            "getGuildMembersUsernamesError": "Ошибка получения имён пользователей гильдии",
            "onlyOwnerCanChangeUserLimit": "Только владелец может изменять лимит участников",
            "updateUserLimitError": "Ошибка обновления лимита участников",
            "updateUserLimit": "Обновить лимит участников",
            "onlyOwnerCanRemoveMembers": "Только владелец может удалять участников",
            "removingMemberError": "Ошибка удаления участника",
            "memberRemoved": "Участник удалён",
            "onlyOwnerCanSendInvitation": "Только владелец может отправлять приглашения",
            "enterUsername": "Введите имя пользователя",
            "sendingInvitationError": "Ошибка отправки приглашения",
            "invitationSended": "Приглашение отправлено {{username}}"
        }
    }
    
};

i18n
    .use(initReactI18next) // Integracja z React
    .init({
    resources, // Używamy tłumaczeń zapisanych w kodzie
    lng: localStorage.getItem('language') || 'en', // Domyślny język
    fallbackLng: 'en',
    debug: true,
    interpolation: {
        escapeValue: false,
    }
    });

export default i18n;
