import { Client, Databases, ID, Query } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// Getting access to appwrite functionalities
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // pointing to appwrite servers
    .setProject(PROJECT_ID); // your project ID

// Using the database functionality of appwrite
const database = new Databases(client);



export const updateSearchCount = async(searchTerm, movie) => {
    // 1. Use Appwrite SDK (or API) to check if the search term exists in the database
    try {
        // It only returns documents where the field searchTerm equals the value in the searchTerm variable.
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm),
        ])

        // It returns an object that looks like this:
        // {
        // total: 2, // how many documents matched
        // documents: [
        //     { $id: 'abc123', searchTerm: 'car', ...otherFields },
        //     { $id: 'xyz789', searchTerm: 'car', ...otherFields }
        // ]
        // }
        
        // 2. If it does, update the count
        if(result.documents.length > 0){
            const doc = result.documents[0]; 
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, 
            {count: doc.count + 1,
            })
        // 3. If it doesn't, create a new document with the search term and count set as 1
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm: searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            })
        }
    } catch (error) {
        console.error(error)
        
    }

}

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count')
        ])
        return result.documents;

    } catch (error) {
        console.error(error)
    }
}