export default class Route {
    constructor(name, format, parameters = {}) {
        this.name = name;
        this.format = format;
        this.matcher = this.constructor.getMatcher(format, parameters);
        this.parameters = Object.keys(parameters);
    }

    static getMatcher(format, parameters) {
        let regexFormat = format;

        Object.keys(parameters).forEach(parameter => {
            regexFormat = regexFormat.replace(`{${parameter}}`, `(${parameters[parameter]})`);
        });

        return new RegExp(`^${regexFormat}$`);
    }

    /**
     * Does the route match the given url?
     *
     * @param  {String} url
     *
     * @return {Boolean}
     */
    match(url) {
        return this.matcher.test(url);
    }

    /**
     * Get parameters from url
     *
     * @param {String} url
     *
     * @return {Object}
     */
    getParameters(url) {
        const match = this.matcher.exec(url).slice(1);
        const parameters = {};

        this.parameters.forEach((parameter, index) => {
            parameters[parameter] = match[index];
        });

        return parameters;
    }

    /**
     * Get url from parameters
     *
     * @param {Object} parameters
     *
     * @return {String}
     */
    getUrl(parameters = {}) {
        let url = this.format;

        this.parameters.forEach(parameter => {
            url = url.replace(`{${parameter}}`, `${parameters[parameter]}`);
        });

        return url;
    }
}
