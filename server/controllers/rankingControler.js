import UserModel from '../model/User.model.js'
import Species from '../model/Species.js';
import mongoose from 'mongoose';
const RankingTableGenerator = (rankTable, firstIndex) => {
    const rankingTable = [];

    for(let i = 0; i < 13; i++)
    {
        const { _id, ...userWithoutId } = rankTable[i]._doc;
            rankingTable.push({
                ...userWithoutId,
                position: firstIndex + i
            });
    }

    console.log(rankingTable);
    return rankingTable;
};

export async function RankingForUserById(req, res) {
    try {
        const userId = req.user.userId;
        const userFromDatabase = await UserModel.aggregate(
            [

                {
                  $setWindowFields: {
                    sortBy: { rankingPoints: -1 },
                    output: {
                      rank: { $documentNumber: {} }, 
                    }
                  }
                },
                { $match: {_id:  mongoose.Types.ObjectId(userId) } } 
              ]
        )
        //find({}, { username: 1, _id: 1, rankingPoints: 1 }).sort({ rankingPoints: -1 });

        //const userIndex = allUserNames.findIndex(user => user._id.toString() === userId);
        if (userFromDatabase.length === 0) {
            return res.status(404).json({ message: "Użytkownik nie znaleziony w rankingu" });
        }
        console.log(userFromDatabase);
        const userRank = userFromDatabase[0].rank;
        // if (userIndex === -1) {
        //     return res.status(404).json({ message: "Użytkownik nie znaleziony w rankingu" });
        // }
        //const ranking = RankingTableGenerator(allUserNames, userIndex);
        console.log(userRank, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        const a = await UserModel.count();
        let ranking;
        let finalRanking;
        if(userRank - 7 < 0)
        {
            ranking = await UserModel.find({}, { username: 1, _id: 1, rankingPoints: 1 }).sort({ rankingPoints: -1, _id: -1 }).limit(13).exec();
            finalRanking = RankingTableGenerator(ranking, 1);
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        }
        else if(userRank+7 > a )
        {
             ranking = await UserModel.find({}, { username: 1, _id: 1, rankingPoints: 1 }).sort({ rankingPoints: -1, _id: -1 }).skip(a - 13).limit(13).exec();
            finalRanking = RankingTableGenerator(ranking, a - 12);
             console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
            }
        else{
             ranking = await UserModel.find({}, { username: 1, _id: 1, rankingPoints: 1 }).sort({ rankingPoints: -1, _id: -1 }).skip(userRank - 7).limit(13).exec();
            finalRanking = RankingTableGenerator(ranking, a - 6);
             console.log("ccccccccccccccccccccccccccccccccc");
            }
        
        console.log(finalRanking,"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
        
        
        res.status(200).json({
            userRank: userRank,
            ranking: finalRanking
        });
    } catch (error) {
        console.error('Nie udało się pobrać rankingu:', error);
        res.status(500).json({ message: 'Błąd przy sprawdzaniu użytkowników', error: error.message });
    }
}


export async function RankingForUserByNumber(req, res) {
    try {
        let userRank = Number(req.query.userIndex);
        const a = await UserModel.count();
        if(userRank > a)
        {
            userRank = a;
        }
        if(userRank <= 0)
        {
            userRank = 1
        }
        const userFromDatabase = await UserModel.aggregate(
            [

                {
                  $setWindowFields: {
                    sortBy: { rankingPoints: -1 },
                    output: {
                      rank: { $documentNumber: {} }, 
                    }
                  }
                },
                { $match: {rank: userRank } } 
              ]
        )
        console.log(userFromDatabase);
        if (userFromDatabase.length === 0) {
            return res.status(404).json({ message: "Użytkownik nie znaleziony w rankingu" });
        }
        console.log(userFromDatabase);
        
        let ranking;
        let finalRanking;
        if(userRank - 7 < 0)
        {
            ranking = await UserModel.find({}, { username: 1, _id: 1, rankingPoints: 1 }).sort({ rankingPoints: -1, _id: -1 }).limit(13).exec();
            finalRanking = RankingTableGenerator(ranking, 1);
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        }
        else if(userRank+7 > a )
        {
             ranking = await UserModel.find({}, { username: 1, _id: 1, rankingPoints: 1 }).sort({ rankingPoints: -1, _id: -1 }).skip(a - 13).limit(13).exec();
            finalRanking = RankingTableGenerator(ranking, a - 12);
             console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
            }
        else{
             ranking = await UserModel.find({}, { username: 1, _id: 1, rankingPoints: 1 }).sort({ rankingPoints: -1, _id: -1 }).skip(userRank - 7).limit(13).exec();
            finalRanking = RankingTableGenerator(ranking, userRank - 6);
             console.log("ccccccccccccccccccccccccccccccccc");
            }
        
        console.log(finalRanking,"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
    //     const allUserNames = await UserModel.find({}, { username: 1, _id: 1, rankingPoints: 1 }).sort({ rankingPoints: -1 });
    //     console.log(userIndex);
    //     if(userIndex < 0)
    //     {
    //         userIndex = 0;
    //     }
    //    if(allUserNames.length < userIndex)
    //    {
    //         userIndex = allUserNames.length - 1;
    //    }

    //     const ranking = RankingTableGenerator(allUserNames, userIndex);

         res.status(200).json({
             userRank: userRank,
             ranking: finalRanking
         });
    } catch (error) {
        console.error('Nie udało się pobrać rankingu:', error);
        res.status(500).json({ message: 'Błąd przy sprawdzaniu użytkowników', error: error.message });
    }
}

export async function RankingForUserByName(req, res) {
    try {
        
        const username = req.query.UserName;
        const userFromDatabase = await UserModel.aggregate(
            [

                {
                  $setWindowFields: {
                    sortBy: { rankingPoints: -1 },
                    output: {
                      rank: { $documentNumber: {} }, 
                    }
                  }
                },
                { $match: {username: username } } 
              ]
        )
        //find({}, { username: 1, _id: 1, rankingPoints: 1 }).sort({ rankingPoints: -1 });

        //const userIndex = allUserNames.findIndex(user => user._id.toString() === userId);
        if (userFromDatabase.length === 0) {
            return res.status(404).json({ message: "Użytkownik nie znaleziony w rankingu" });
        }
        console.log(userFromDatabase);
        const userRank = userFromDatabase[0].rank;
        // if (userIndex === -1) {
        //     return res.status(404).json({ message: "Użytkownik nie znaleziony w rankingu" });
        // }
        //const ranking = RankingTableGenerator(allUserNames, userIndex);
        console.log(userRank, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        const a = await UserModel.count();
        let ranking;
        let finalRanking;
        if(userRank - 7 < 0)
        {
            ranking = await UserModel.find({}, { username: 1, _id: 1, rankingPoints: 1 }).sort({ rankingPoints: -1, _id: -1 }).limit(13).exec();
            finalRanking = RankingTableGenerator(ranking, 1);
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        }
        else if(userRank+7 > a )
        {
             ranking = await UserModel.find({}, { username: 1, _id: 1, rankingPoints: 1 }).sort({ rankingPoints: -1, _id: -1 }).skip(a - 13).limit(13).exec();
            finalRanking = RankingTableGenerator(ranking, a - 12);
             console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
            }
        else{
             ranking = await UserModel.find({}, { username: 1, _id: 1, rankingPoints: 1 }).sort({ rankingPoints: -1, _id: -1 }).skip(userRank - 7).limit(13).exec();
            finalRanking = RankingTableGenerator(ranking, a - 6);
             console.log("ccccccccccccccccccccccccccccccccc");
            }
        
        console.log(finalRanking,"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
        res.status(200).json({
            userRank: userRank,
            ranking: finalRanking
        });
    } catch (error) {
        console.error('Nie udało się pobrać rankingu:', error);
        res.status(500).json({ message: 'Błąd przy sprawdzaniu użytkowników', error: error.message });
    }
}

export async function UserDataForRanking(req, res) {
    try {
        console.log("aaaaaaaaaaaaaaaaaaaaaaa");
        const name = req.query.name; // Możesz to zamienić na req.query.username, jeśli chcesz dynamiczne wyszukiwanie

        const userData = await UserModel.findOne({ username: name });

        if (!userData) {
            return res.status(404).send({ error: 'Nie znaleziono użytkownika' });
        }

        const speciesData = [];
        const statsForCreature = [];
        const creaturesData = userData.creatures.map(({ name, level, staty, _id, items }) => ({
            name,
            level,
            staty,
            _id,
            items
        }));
        for (const creature of userData.creatures) {
            const species = await Species.findOne({ name: creature.species }).lean(); // lean() usuwa metadane Mongoose
            if (species) {
                const { _id, ...speciesWithoutId } = species; // Usuń _id z obiektu
                speciesData.push(speciesWithoutId);
            }
        }

        res.status(200).json({
            username: userData.username,
            creatures: creaturesData,
            creatureSpeciesData: speciesData,
        });

    } catch (error) {
        console.error('Nie udało się pobrać danych użytkownika:', error);
        res.status(500).json({ message: 'Błąd przy pobieraniu danych', error: error.message });
    }
}

export async function CreaturesToFight(req,res){
    try{
        const userId = req.user.userId;
        const user = await UserModel.findById(userId);
        const speciesPhotos = [];
        const idOfCretures = []
        for (const creature of user.creatures) {
            const species = await Species.findOne({ name: creature.species }).lean(); // lean() usuwa metadane Mongoose
            if (species) {
                speciesPhotos.push(species.photos);
                idOfCretures.push(creature._id);
            }
        }
        res.status(200).json({
            speciesPhotos: speciesPhotos,
            idOfCretures: idOfCretures
        })
    }catch (error) {
        console.error('Nie udało się pobrać danych użytkownika:', error);
        res.status(500).json({ message: 'Błąd przy pobieraniu danych', error: error.message });
    }
}