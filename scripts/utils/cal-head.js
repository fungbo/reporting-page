var _ = {
    each: require('lodash/each'),
    trim: require('lodash/trim'),
    trimEnd: require('lodash/trimEnd'),
    uniqBy: require('lodash/uniqBy')
};

var getMappings = function (elements) {
    var mappings = {};
    _.each(elements, function (element) {
        mappings[element["id"]] = element["displayName"];
    });

    return mappings;
};

module.exports = {
    getHead: function (data, mapping) {
        var elements = data['dataElementOperands'];
        var mappings = getMappings(mapping);

        var heads = [];
        _.each(elements, function (element) {
            var id = element['id'];
            var displayName = element['displayName'];

            var headName = _.trim(_.trimEnd(_.trimEnd(_.trimEnd(displayName, 'C'), 'O'), ', '));
            var diseaseName = mappings[id.split('.')[0]];

            heads.push({'name': headName.replace(diseaseName + ' ', diseaseName + '_').replace(', ', '_')});

        });

        return _.uniqBy(heads, 'name');
    },

    getSidebarFilter: function (data, mapping) {
        var elements = data['dataElementOperands'];
        var mappings = getMappings(mapping);

        var datas = [];
        _.each(mappings, function (value) {
            datas.push({'text': value, 'nodes': []});
        })
        _.each(elements, function (element) {
            var id = element['id'];
            var displayName = element['displayName'];

            var diseaseName = mappings[id.split('.')[0]];
            var filterName = _.trim(_.trimEnd(_.trimEnd(_.trimEnd(displayName.replace(diseaseName, ''), 'C'), 'O'), ', '));

            if (filterName) {
                _.each(datas, function (element) {
                    var value = {'text': filterName};
                    if (diseaseName == element.text) {
                        element.nodes.push(value);
                        element.nodes = _.uniqBy(element.nodes, 'text')
                    };
                });
            };
        });

        return _.uniqBy(datas, 'text')
    }
};
