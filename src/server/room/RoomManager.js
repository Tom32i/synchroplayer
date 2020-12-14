import Room from '@server/room/Room';

export default class RoomManager {
    constructor() {
        this.rooms = new Map();

        this.deleteRoom = this.deleteRoom.bind(this);
    }

    get length() {
        return this.rooms.size;
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
        const room = new Room(id, this.deleteRoom);

        this.rooms.set(id, room);

        console.info(`Room ${id} created.`);

        return room;
    }

    deleteRoom(room) {
        const { id } = room;

        this.rooms.delete(id);

        room.destroy();

        console.info(`Room ${id} destroyed.`);
    }
}
