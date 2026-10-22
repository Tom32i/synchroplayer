import { MapClientDirectory } from 'netcode/server';

/**
 * Netcode 3 numbers clients from 0, but user id 0 means "nobody"
 * on the wire (see user:streaming), so keep numbering from 1 like netcode 2.
 */
export default class ClientDirectory extends MapClientDirectory {
    generateId() {
        for (let id = 1; id < this.max; id++) {
            if (!this.clients.has(id)) {
                return id;
            }
        }

        throw new Error(`Max clients reached ${this.max}.`);
    }
}
