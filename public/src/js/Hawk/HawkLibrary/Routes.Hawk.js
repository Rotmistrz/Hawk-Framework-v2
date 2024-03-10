import Hawk from './Core.Hawk';

const Routes = {
    routes: {},

    path: Hawk.getPath(),
    regexp: new RegExp(""),

    is: function(route) {
      this.regexp = new RegExp(route);

      return this.regexp.test(Hawk.getPath());
    },

    contains: function(parameterName) {
        var regexp = new RegExp('/' + parameterName + '/');
        var endRegexp = new RegExp('/' + parameterName + '$');

        return regexp.test(Hawk.getPath()) || endRegexp.test(Hawk.getPath());
    },

    getParameterValue: function(parameterString) {
        var parts = parameterString.split('/');

        if (parts.length > 2) {
            return parts[2];
        } else {
            return null;
        }
    },

    get: function(parameterName) {
        if (this.contains(parameterName)) {
            var pattern = '/' + parameterName + '/([0-9a-zA-Z\-]+)';

            var regexp = new RegExp(pattern + '/');
            var endRegexp = new RegExp(pattern + '$');

            var results = regexp.exec(Hawk.getPath());

            if (results != null) {
                return this.getParameterValue(results[0]);
            } else {
                results = endRegexp.exec(Hawk.getPath());

                if (results != null) {
                    return this.getParameterValue(results[0]);
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
    }
}

export default Routes;