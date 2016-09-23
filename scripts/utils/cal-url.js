var _ = {
    each: require('lodash/each'),
    trimEnd: require('lodash/trimEnd')
};

var getBaseUrl = function () {
    return 'http://localhost:8080/api/';
};

var getDimensionDx = function (oriHead) {
    var dimension = "dimension=dx:";
    _.each(oriHead, function (head) {
        dimension += head.id + ';';
    });

    return _.trimEnd(dimension, ';');
};

var getDimensionOu = function (ous) {
    var dimension = "dimension=ou:";
    _.each(ous, function (ou) {
        dimension += ou + ';';
    });

    return _.trimEnd(dimension, ';');g
};

var getPeriod = function (period) {
    return "filter=pe:" + period;
};

module.exports = {
    getIdUrl: function() {
        return getBaseUrl() + 'dataElements';
    },

    getHeadUrl: function() {
        return getBaseUrl() + 'dataElementOperands';
    },

    getRowUrl: function (oriHead, ous, period) {
        var dx = getDimensionDx(oriHead);
        var ou = getDimensionOu(ous);
        var pe = getPeriod(period);

        return getBaseUrl() + 'analytics.json?' + dx + "&" + ou + "&" + pe;
    },

    getChildrenUrl: function(ouId) {
        return getBaseUrl() + '24/organisationUnits/' + ouId + '?paging=false&fields=children';
    },

    getRelatedOuList: function () {
        return getBaseUrl() + 'me?fields=organisationUnits'
    },

    getOuLevel: function (ou) {
        return getBaseUrl() + 'organisationUnits/' + ou + '?fields=level'
    }
};
