const moment = require('moment');

module.exports = {
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
            var new_str = str + " ";
            new_str = str.substr(0, len);
            new_str = str.substr(0, new_str.lastIndexOf(" "));
            new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
            return new_str + '....';
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
            "%": lvalue % rvalue,
            "=": lavalue = rvalue
        } [operator];
    },
    checkNew: function (data) {
        var data = Date.parse(data);
        var currentdate = parseInt(Date.now());
        // console.log(currentdate);
        //  console.log(data);
        // var result = parseInt(parseInt(date) - parseInt(currentdate)) >=week 604800; month 2592000000; 15 days 1296000000
        var result = (currentdate - data);
        //  console.log(result/60);
        if (result < 2592000000) {
            return 'new badge green';
        } else {
            return ``;
        }
    },
    totalcount: function (str) {
        if (str.length > 0) {
            var num = str.length;

            function nFormatter(num, digits) {
                var si = [{
                        value: 1,
                        symbol: ""
                    },
                    {
                        value: 1E3,
                        symbol: "k"
                    },
                    {
                        value: 1E6,
                        symbol: "M"
                    },
                    {
                        value: 1E9,
                        symbol: "G"
                    },
                    {
                        value: 1E12,
                        symbol: "T"
                    },
                    {
                        value: 1E15,
                        symbol: "P"
                    },
                    {
                        value: 1E18,
                        symbol: "E"
                    }
                ];
                var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
                var i;
                for (i = si.length - 1; i > 0; i--) {
                    if (num >= si[i].value) {
                        break;
                    }
                }
                return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
            }
            return nFormatter(num);
        } else {
            return num = 0;
        }
    },
    viewcounting: function (counting) {
        if (counting > 0) {
            function nFormatter(counting, digits) {
                var si = [{
                        value: 1,
                        symbol: ""
                    },
                    {
                        value: 1E3,
                        symbol: "k"
                    },
                    {
                        value: 1E6,
                        symbol: "M"
                    },
                    {
                        value: 1E9,
                        symbol: "G"
                    },
                    {
                        value: 1E12,
                        symbol: "T"
                    },
                    {
                        value: 1E15,
                        symbol: "P"
                    },
                    {
                        value: 1E18,
                        symbol: "E"
                    }
                ];
                var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
                var i;
                for (i = si.length - 1; i > 0; i--) {
                    if (counting >= si[i].value) {
                        break;
                    }
                }
                return (counting / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
            }
            return nFormatter(counting);
        } else {
            return counting = 0;
        }
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },
    formateDate: function (date, format) {
        return moment(date).format(format);
    },
    select: function (selected, options) {
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"').replace(new RegExp('>' + selected + '</option>'), 'selected="selected"$&');
    },
    categoryType: function (selected, option) {
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"').replace(new RegExp('>' + selected + '</option>'), 'selected="selected"$&');
    },
    editIcon: function (storyUser, loggedUser, storyId, floating = true) {
        if (storyUser == loggedUser) {
            if (floating) {
                return `<a href="/stories/edit/${storyId}" class="btn-floating btn-small halfway-fab red"><i class="fas fa-pencil-alt" style="font-size:.8rem;"></i></a>`;
            } else {
                return `<a href="/stories/edit/${storyId}"><i class="fas btn-small fa-pencil-alt" style="font-size:.8rem;"></i></a>`;
            }
        } else {
            return '';
        }
    },
    moderateComments: function (storyUser, loggedUser, storyId, floating = true) {
        if (storyUser == loggedUser) {
            if (floating) { //add form post method on api request
                return ` <div class="card-title right" style="padding-right:1rem;padding-top:.5rem;"><i style="color:#999;font-size:1.2rem;" class="material-icons right">close</i></div>`;
            } else {
                return ` <div class="card-title right" style="padding-right:1rem;padding-top:.5rem;"><i style="color:#999;font-size:1.2rem;" class="material-icons right">close</i></div>`;
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