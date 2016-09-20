var _ = {
    each: require('lodash/each'),
    trimEnd: require('lodash/trimEnd')
};

var getBaseUrl = function () {
    return 'http://52.32.36.132/api/';
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

    return _.trimEnd(dimension, ';');
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
        return getBaseUrl() + '24/organisationUnits/' + ouId;
    }
};
