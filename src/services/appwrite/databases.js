import { Client, Databases, ID, Query } from "appwrite";
import { config } from "../../config/config";

const client = new Client();

client
  .setEndpoint(config.appwrite_api_endpoint)
  .setProject(config.appwrite_project_id);

const databases = new Databases(client);

export const playlistService = {
  savePlaylist: async function ({
    playlistId,
    userId,
    title,
    thumbnail,
    description,
  }) {
    return await databases.createDocument(
      config.appwrite_database_id,
      config.appwrite_playlists_collection_id,
      ID.unique(),
      { playlistId, userId, title, thumbnail, description },
    );
  },
  getUserPlaylists: async function (userId) {
    return await databases.listDocuments(
      config.appwrite_database_id,
      config.appwrite_playlists_collection_id,
      [Query.equal("userId", userId)],
    );
  },
  updatePlaylist: async function (documentId, data) {
    return await databases.updateDocument(
      config.appwrite_database_id,
      config.appwrite_playlists_collection_id,
      documentId,
      data,
    );
  },
  deletePlaylist: async function (documentId) {
    return await databases.deleteDocument(
      config.appwrite_database_id,
      config.appwrite_playlists_collection_id,
      documentId,
    );
  },
};
