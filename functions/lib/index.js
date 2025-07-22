"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recalculateTopPlayed = exports.updateTopPlayedOnHistoryChange = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Initialize Firebase Admin
admin.initializeApp();
// Database reference
const db = admin.database();
/**
 * Cloud Function that triggers when a song is added to history
 * This function aggregates all history items to create/update the topPlayed collection
 * based on unique combinations of artist and title (not path)
 */
exports.updateTopPlayedOnHistoryChange = functions.database
    .ref('/controllers/{controllerName}/history/{historyId}')
    .onCreate(async (snapshot, context) => {
    const { controllerName } = context.params;
    console.log(`TopPlayed update triggered for controller: ${controllerName}`);
    try {
        // Get the controller reference
        const controllerRef = db.ref(`/controllers/${controllerName}`);
        // Get all history items for this controller
        const historySnapshot = await controllerRef.child('history').once('value');
        const historyData = historySnapshot.val();
        if (!historyData) {
            console.log('No history data found, skipping TopPlayed update');
            return;
        }
        // Aggregate history items by path
        const aggregation = {};
        Object.values(historyData).forEach((song) => {
            const historySong = song;
            if (historySong && historySong.path) {
                const path = historySong.path;
                if (aggregation[path]) {
                    aggregation[path].count += historySong.count || 1;
                }
                else {
                    aggregation[path] = {
                        artist: historySong.artist,
                        title: historySong.title,
                        path: historySong.path,
                        count: historySong.count || 1
                    };
                }
            }
        });
        // Convert aggregation to array, sort by count (descending), and take top 100
        const sortedSongs = Object.entries(aggregation)
            .map(([, songData]) => ({
            artist: songData.artist,
            title: songData.title,
            path: songData.path,
            count: songData.count
        }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 100);
        // Write as an array so Firebase uses numeric keys
        await controllerRef.child('topPlayed').set(sortedSongs);
        console.log(`Successfully updated TopPlayed for controller ${controllerName} with ${sortedSongs.length} unique songs (by path)`);
    }
    catch (error) {
        console.error('Error updating TopPlayed:', error);
        throw error;
    }
});
/**
 * Alternative function that can be called manually to recalculate TopPlayed
 * This is useful for initial setup or data migration
 */
exports.recalculateTopPlayed = functions.https.onCall(async (data) => {
    const { controllerName } = data;
    if (!controllerName) {
        throw new functions.https.HttpsError('invalid-argument', 'controllerName is required');
    }
    console.log(`Manual TopPlayed recalculation requested for controller: ${controllerName}`);
    try {
        // Get the controller reference
        const controllerRef = db.ref(`/controllers/${controllerName}`);
        // Get all history items for this controller
        const historySnapshot = await controllerRef.child('history').once('value');
        const historyData = historySnapshot.val();
        if (!historyData) {
            console.log('No history data found, returning empty TopPlayed');
            await controllerRef.child('topPlayed').set({});
            return { success: true, message: 'No history data found, TopPlayed cleared' };
        }
        // Aggregate history items by path
        const aggregation = {};
        Object.values(historyData).forEach((song) => {
            const historySong = song;
            if (historySong && historySong.path) {
                const path = historySong.path;
                if (aggregation[path]) {
                    aggregation[path].count += historySong.count || 1;
                }
                else {
                    aggregation[path] = {
                        artist: historySong.artist,
                        title: historySong.title,
                        path: historySong.path,
                        count: historySong.count || 1
                    };
                }
            }
        });
        // Convert aggregation to array, sort by count (descending), and take top 100
        const sortedSongs = Object.entries(aggregation)
            .map(([, songData]) => ({
            artist: songData.artist,
            title: songData.title,
            path: songData.path,
            count: songData.count
        }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 100);
        // Write as an array so Firebase uses numeric keys
        await controllerRef.child('topPlayed').set(sortedSongs);
        console.log(`Successfully recalculated TopPlayed for controller ${controllerName} with ${sortedSongs.length} unique songs (by path)`);
        return {
            success: true,
            message: `TopPlayed recalculated successfully`,
            songCount: sortedSongs.length
        };
    }
    catch (error) {
        console.error('Error recalculating TopPlayed:', error);
        throw new functions.https.HttpsError('internal', 'Failed to recalculate TopPlayed');
    }
});
//# sourceMappingURL=index.js.map