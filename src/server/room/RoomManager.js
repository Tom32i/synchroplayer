import Room from '@server/room/Room';

export default class RoomManager {
    constructor() {
        this.rooms = new Map();
    }

    findOrCreate(id) {
        return this.find(id) || this.createRoom(id);
    }

    /**
     * Find room
     *
     * @param {String} id
     *
     * @return {Room}
     */
    find(id) {
        return this.rooms.get(id);
    }

    /**
     * @param {String} id
     *
     * @return {Room}
     */
    createRoom(id) {
        const room = new Room(id);

        this.rooms.set(id, room);

        console.info(`Room ${id} created.`);

        return room;
    }
}
