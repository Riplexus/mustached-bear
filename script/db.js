window.MS = window.MS || {};

document.addEventListener('deviceready', function() {

    window.MS.db = {
        obj: window.openDatabase("hmapp", "1.0", "hmapp", 1000000),
        isCreated: false
    };

    /**
     *
     * @param name
     * @param json
     * @param drop
     * @param callback
     */
    MS.db.createTable = function createTable(name, json, drop, callback) {
        var sql, columns, key;

        sql = 'CREATE TABLE IF NOT EXISTS '+name+' (';
        columns = [];
        for (key in json) {
            columns.push(key+' '+json[key]);
        }
        sql += columns.join(', ')+')';

        MS.db.obj.transaction(function(tx) {

            drop && tx.executeSql('DROP TABLE IF EXISTS '+name);
            tx.executeSql(sql);

        }, function(err) {
            if (typeof callback === 'function') {
                callback(err);
            }

        }, function() {
            if (typeof callback === 'function') {
                callback();
            }
        });
    };

    /**
     *
     * @param name
     * @param callback
     */
    MS.db.loadDbConfig = function loadDbConfig(name, callback) {

        $.ajax({
            url: './config/db/'+name+'.json',
            success: function(json) {
                if (typeof callback === 'function') {
                    callback(undefined, {
                        name: name,
                        table: JSON.parse(json)
                    });
                }
            },
            error: function(err) {
                if (typeof callback === 'function') {
                    callback(err);
                }
            }
        });
    };

    /**
     *
     * @param drop
     */
    MS.db.createTables = function createTables(drop, callback) {
        var tables, i, group;

        tables = [
            'fach',
            'fach_studiengang',
            'fakultaet',
            'fakultaet_studiengang',
            'nachrichten',
            'studiengang',
            'studiengruppe',
            'type',
            'user',
            'usercalendar',
            'user_vorlesung',
            'vorlesung',
            'sync'
        ];

        Step(
            function getConfigFiles() {
                group = this.group();
                for (i=tables.length; i--;) {
                    MS.db.loadDbConfig(tables[i], group());
                }
            },
            function createTables(err, data) {
                if (err) {
                    MS.tools.toast.long(err);
                    return;
                }

                group = this.group();
                for (i=data.length; i--;) {
                    MS.db.createTable(data[i].name, data[i].table, drop, group());
                }
            },
            function done(err) {
                MS.db.isCreated = true;
                if (typeof callback === 'function') {
                    callback();
                }
            }
        );
    };

    /**
     *
     * @param table
     * @param keys
     * @param values
     * @param callback
     */
    MS.db.insert = function insert(table, keys, values, callback) {
        MS.db.obj.transaction(function(tx) {
            tx.executeSql('INSERT INTO '+table+' ('+keys.join()+') VALUES ("'+values.join('", "')+'")');
        }, function(err) {
            callback(err);
        }, function() {
            callback(undefined);
        });
    };

    /**
     * Simple wrapper to execute sql statements.
     * Used in dummy data insertion.
     *
     * @param sql
     * @param {function} [callback]
     */
    MS.db.sql = function sql(sql, callback) {
        sql = $.isArray(sql)? sql : [sql];
        callback = callback || function() {};

        MS.db.obj.transaction(function(tx) {
            var i, l;
            for (i=0, l=sql.length; i<l; i++) {
                tx.executeSql(sql[i]);
            }
        }, function(err) {
            callback(err);
        }, function() {
            callback();
        });
    };

    /**
     * ToDo: make where argument gscheit.
     *
     * @param table
     * @param keys
     * @param values
     * @param where
     * @param callback
     */
    MS.db.set = function set(table, keys, values, where, callback) {
        MS.db.obj.transaction(function(tx) {
            var sets, sql;

            sets = [];
            for (var i=keys.length; i--;) {

                if (typeof values[i] === 'number') {
                    sets.push(keys[i]+'='+values[i]+'');
                } else {
                    sets.push(keys[i]+'="'+values[i]+'"');
                }

            }

            sql = 'UPDATE '+table+' SET '+sets.join(',')+' WHERE '+where;

            tx.executeSql(sql);
        }, function(err) {
            callback(err);
        }, function() {
            callback();
        });
    };

    /**
     * ToDo: don't pass sql
     *
     * @param sql
     * @param callback
     */
    MS.db.get = function get(sql, callback) {
        MS.db.obj.transaction(function(tx) {

            tx.executeSql(sql, [], function(tx, results) {
                var i, l, data = [];
                for (i=0, l=results.rows.length; i<l; i++) {
                    data.push(results.rows.item(i));
                }

                callback(undefined, data);
            });

        }, function(err) {
            callback(err);
        });
    };

    /**
     *
     * @param str
     * @returns {string}
     */
    MS.db.escape = function escape(str) {
        if (typeof str !== 'string') { return str; }
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\"+char; // prepends a backslash to backslash, percent,
                // and double/single quotes
            }
        });
    };

    /*
     * Initialize database
     */

    MS.db.createTables();
});