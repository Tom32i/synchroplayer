import GetRequest from '@client/http/GetRequest';

/**
 * HTTP GET Json Request
 */
export default class JsonRequest extends GetRequest {
    getContent() {
        return JSON.parse(super.getContent());
    }
}
