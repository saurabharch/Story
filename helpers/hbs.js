const moment = require('moment');

module.exports = {
    truncate: function (str, len) {
        if(str.length > len && str.length > 0) {
            var new_str = str + " ";
            new_str = str.substr(0, len);
            new_str = str.substr(0, new_str.lastIndexOf(" "));
            new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
            return new_str +'....';
        }
        return str;
    },
     math: function (lvalue, operator, rvalue) {
         lvalue = parseFloat(lvalue);
         rvalue = parseFloat(rvalue);
         return {
             "+": lvalue + rvalue,
             "-": lvalue - rvalue,
             "*": lvalue * rvalue,
             "/": lvalue / rvalue,
             "%": lvalue % rvalue
         }[operator];
     },
     totalcount: function (str) {
        if (str.length > 0) {
            var new_str = str.length;
            return new_str;
        }
     },
    stripTags: function(input) {
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },
    formateDate: function (date, format) {
        return moment(date).format(format);
    },
    select: function(selected, options){
        return options.fn(this).replace(new RegExp(' value=\"'+ selected + '\"'), '$&selected="selected"').replace(new RegExp('>' +selected+ '</option>'), 'selected="selected"$&');
    },
    categoryType: function (selected, option) {
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"').replace(new RegExp('>' + selected + '</option>'), 'selected="selected"$&');
    },
    editIcon: function (storyUser, loggedUser, storyId, floating = true) {
        if (storyUser == loggedUser) {
            if (floating) {
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab red"><i class="fas fa-pencil-alt"></i></a>`;
            } else {
                return `<a href="/stories/edit/${storyId}"><i class="fas fa-pencil-alt"></i></a>`;
            }
        } else {
            return '';
        }
    },
    ratingIcon: function (storyUser, loggedUser, storyId, floating = true) {
        if (storyId) {
            if (floating && loggedUser) {
                return `<a href="/stories/rate/${storyId}" style="color:#666;height:46px;padding-top:5px;letter-spacing: 1.5px;"> <div class="stars-outer">
                                            <div class="stars-inner"></div>
                                        </div>
                                        <span class="number-rating"></span></a>`;
            } else {
                return `<a href="#" style="color:#666;height:46px;padding-top:5px;letter-spacing: 1.5px;"> <div class="stars-outer">
                                            <div class="stars-inner"></div>
                                        </div>
                                        <span class="number-rating"></span></a>`;
            }
        } else {
            return '';
        }
    },
}