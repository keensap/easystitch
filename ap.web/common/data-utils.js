'use strict';


var EasyStitch;
if (EasyStitch == 'undefined' || EasyStitch == null) EasyStitch = function () { };
if (EasyStitch.Common == 'undefined' || EasyStitch.Common == null) EasyStitch.Common = function () { };
if (EasyStitch.Common.Data == 'undefined' || EasyStitch.Common.Data == null) EasyStitch.Common.Data = {
    //Set Sort Icon
    getIcon: function (column, orderBy) {
        var sortDirectionClass = "";
        if (column != null && column != "") {
            var sortColumn = orderBy;
            if (sortColumn.indexOf("-") == 0) {
                sortColumn = sortColumn.replace(/^-/, '');
            }
            if (column == sortColumn) {
                if (orderBy.indexOf("-") == 0) {
                    sortDirectionClass = 'glyphicon-chevron-up';
                } else {
                    sortDirectionClass = 'glyphicon-chevron-down';
                }
            }
        }
        return sortDirectionClass;
    },

    //Sort
    changeSorting: function (column, orderBy) {
        var orderByString = "";
        if (column != null && column != "") {
            var sortColumn = column;
            if (sortColumn.indexOf("-") == 0) {
                sortColumn = sortColumn.replace(/^-/, '');
            }
            if (orderBy == sortColumn) {
                if (column.indexOf("-") == 0) {
                    column = sortColumn;
                } else {
                    column = "-" + column;
                }
            }
            orderByString = column;
        }
        return orderByString;
        
    }
};

