var _ = require('lodash');

var getRow = function (rows, head, ouId) {
    var row = {};
    var values = [];
    _.each(head, function (disease) {
        var id = disease.id;
        var hasValue = false;
        _.each(rows, function (row) {
            if (row[0] === id && row[1] === ouId) {
                hasValue = true;
                values.push(row[2].replace('.0', ''));
            }
        });

        if (!hasValue) {
            values.push(0);
        }
    });

    row['id'] = ouId;
    row['values'] = values;

    return row;
};

module.exports = {
    getRows: function (data, head) {
        var names = data.metaData.names;

        var res = [];
        _.each(data.metaData.ou, function (ou) {
            var row = getRow(data.rows, head, ou);
            row['name'] = names[ou];

            res.push(row);
        });

        return res;
    },

    appendChildren: function (rows, id, children) {
        _.each(rows, function(row) {
            if (row['id'] === id) {
                row['children'] = children;
                return rows;
            } else {
                if (row['children']) {
                    this.appendChildren(row['children'], id, children);
                }
            }
        }.bind(this));

        return rows;
    }
};