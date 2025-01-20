import UserModel from '../model/User.model.js'
import Species from '../model/Species.js';
const RankingTableGenerator = (allUserNames, userIndex) => {
    const rankingTable = [];

    if (userIndex - 6 < 0) {
        for (let i = 0; i < Math.min(13, allUserNames.length); i++) {
            const { _id, ...userWithoutId } = allUserNames[i]._doc;
            rankingTable.push({
                ...userWithoutId,
                position: i + 1
            });
            console.log("dla góry rankingu");
        }
    } else if (allUserNames.length - userIndex < 7) {
        for (let i = Math.max(0, allUserNames.length - 13); i < allUserNames.length; i++) {
            const { _id, ...userWithoutId } = allUserNames[i]._doc;
            rankingTable.push({
                ...userWithoutId,
                position: i + 1
            });
            console.log("dla dołu rankingu");
        }
    } else {
        for (let i = userIndex - 6; i < userIndex + 7; i++) {
            const { _id, ...userWithoutId } = allUserNames[i]._doc;
            rankingTable.push({
                ...userWithoutId,
                position: i + 1
            });
            console.log("dla środka tabeli");
        }
    }

    console.log(rankingTable);
    return rankingTable;
};

export async function RankingForUserById(req, res) {
    try {
        const userId = req.user.userId;
        const allUserNames = await UserModel.find({}, { username: 1, _id: 1, rankingPoints: 1 }).sort({ rankingPoints: -1 });

        const userIndex = allUserNames.findIndex(user => user._id.toString() === userId);

        if (userIndex === -1) {
            return res.status(404).json({ message: "Użytkownik nie znaleziony w rankingu" });
        }

        const ranking = RankingTableGenerator(allUserNames, userIndex);

        res.status(200).json({
            userRank: userIndex + 1,
            ranking
        });
    } catch (error) {
        console.error('Nie udało się pobrać rankingu:', error);
        res.status(500).json({ message: 'Błąd przy sprawdzaniu użytkowników', error: error.message });
    }
}


export async function RankingForUserByNumber(req, res) {
    try {
    
        const allUserNames = await UserModel.find({}, { username: 1, _id: 1, rankingPoints: 1 }).sort({ rankingPoints: -1 });

        let userIndex = parseInt(req.query.userIndex);
        console.log(userIndex);
        if(userIndex < 0)
        {
            userIndex = 0;
        }
       if(allUserNames.length < userIndex)
       {
            userIndex = allUserNames.length - 1;
       }

        const ranking = RankingTableGenerator(allUserNames, userIndex);

        res.status(200).json({
            userRank: userIndex + 1,
            ranking
        });
    } catch (error) {
        console.error('Nie udało się pobrać rankingu:', error);
        res.status(500).json({ message: 'Błąd przy sprawdzaniu użytkowników', error: error.message });
    }
}

export async function RankingForUserByName(req, res) {
    try {
        
        const username = req.query.UserName;
        console.log("AAAAAAAAAAAAAAAAAAAA");
        const allUserNames = await UserModel.find({}, { username: 1, _id: 1, rankingPoints: 1 }).sort({ rankingPoints: -1 });

        const userIndex = allUserNames.findIndex(user => user.username === username);
        if (userIndex === -1) {
            return res.status(404).json({ message: "Użytkownik nie znaleziony w rankingu" });
        }
        if(userIndex <= 0)
        {
            
            return res.status(404).send({ error: 'nie znaleziono'}); 
        }
       if(allUserNames.length <= userIndex)
       {
        
        return res.status(404).send({ error: 'nie znaleziono'});
       }

        const ranking = RankingTableGenerator(allUserNames, userIndex);

        res.status(200).json({
            userRank: userIndex + 1,
            ranking
        });
    } catch (error) {
        console.error('Nie udało się pobrać rankingu:', error);
        res.status(500).json({ message: 'Błąd przy sprawdzaniu użytkowników', error: error.message });
    }
}

export async function UserDataForRanking(req, res) {
    try {
        const name = "qwer4"; // Możesz to zamienić na req.query.username, jeśli chcesz dynamiczne wyszukiwanie

        const userData = await UserModel.findOne({ username: name });

        if (!userData) {
            return res.status(404).send({ error: 'Nie znaleziono użytkownika' });
        }

        const photosForCreature = [];
        
        // Używamy for...of dla prawidłowego await
        for (const creature of userData.creatures) {
            const speciesPhoto = await Species.findOne({ name: creature.species });
            photosForCreature.push(speciesPhoto.photos);
        }

        console.log(photosForCreature);

        res.status(200).json({
            username: userData.username,
            creaturesPhotos: photosForCreature,
        });

    } catch (error) {
        console.error('Nie udało się pobrać danych użytkownika:', error);
        res.status(500).json({ message: 'Błąd przy pobieraniu danych', error: error.message });
    }
}