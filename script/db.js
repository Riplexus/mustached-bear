window.MS = window.MS || {};

document.addEventListener('deviceready', function() {

    window.MS.db = {
        obj: window.openDatabase("hmapp", "1.0", "hmapp", 1000000),
        isCreated: false
    };

    /*
     * Start table creation
     */
    MS.db.obj.transaction(function(tx) {

        var drop = true;

        // fach
        drop && tx.executeSql('DROP TABLE IF EXISTS fach');
        tx.executeSql('CREATE TABLE IF NOT EXISTS fach ('+
            'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
            'name VARCHAR(255), ' +
            'info LONGTEXT, ' +
            'last_update TIMESTAMP(8)' +
            ')');

        // fakultaet
        drop && tx.executeSql('DROP TABLE IF EXISTS fakultaet');
        tx.executeSql('CREATE TABLE IF NOT EXISTS fakultaet ('+
            'id INTEGER NOT NULL PRIMARY KEY, ' +
            'name VARCHAR(255), ' +
            'last_update TIMESTAMP(8)' +
            ')');

        // studiengang
        drop && tx.executeSql('DROP TABLE IF EXISTS studiengang');
        tx.executeSql('CREATE TABLE IF NOT EXISTS studiengang ('+
            'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
            'name VARCHAR(255), ' +
            'last_update TIMESTAMP(8)' +
            ')');

        // studiengruppe
        drop && tx.executeSql('DROP TABLE IF EXISTS studiengruppe');
        tx.executeSql('CREATE TABLE IF NOT EXISTS studiengruppe ('+
            'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
            'name VARCHAR(255), ' +
            'semester INTEGER, ' +
            'studiengang_id INTEGER, ' +
            'last_update TIMESTAMP(8)' +
            ')');

        // user
        drop && tx.executeSql('DROP TABLE IF EXISTS user');
        tx.executeSql('CREATE TABLE IF NOT EXISTS user ('+
            'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
            'email VARCHAR(255), ' +
            'password VARCHAR(255), ' +
            'last_update TIMESTAMP(8), ' +
            'validcookie VARCHAR(255)' +
            ')');

        // vorlesung
        drop && tx.executeSql('DROP TABLE IF EXISTS vorlesung');
        tx.executeSql('CREATE TABLE IF NOT EXISTS vorlesung ('+
            'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
            'type INTEGER, ' +
            'raum VARCHAR(255), ' +
            'dozent VARCHAR(255), ' +
            'end TIMESTAMP(8), ' +
            'start TIMESTAMP(8), ' +
            'last_update TIMESTAMP(8), ' +
            'fach_id INTEGER, ' +
            'studiengruppe_id INTEGER' +
            ')');

        // type
        drop && tx.executeSql('DROP TABLE IF EXISTS type');
        tx.executeSql('CREATE TABLE IF NOT EXISTS type ('+
            'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
            'name VARCHAR(255)' +
            ')');

        // nachrichten
        drop && tx.executeSql('DROP TABLE IF EXISTS nachrichten');
        tx.executeSql('CREATE TABLE IF NOT EXISTS nachrichten ('+
            'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
            'fakultaet_id INTEGER, ' +
            'title VARCHAR(4096), ' +
            'content TEXT, ' +
            'date TIMESTAMP, ' +
            'author VARCHAR(4096), ' +
            'msg_type VARCHAR(5), ' +
            'last_update TIMESTAMP(8)' +
            ')');

        // link fach <-> studiengang
        drop && tx.executeSql('DROP TABLE IF EXISTS fach_studiengang');
        tx.executeSql('CREATE TABLE IF NOT EXISTS fach_studiengang ('+
            'fach_id INTEGER NOT NULL, ' +
            'studiengang_id INTEGER NOT NULL, ' +
            'last_update TIMESTAMP(8)' +
            ')');

        // link fakultät <-> studiengang
        drop && tx.executeSql('DROP TABLE IF EXISTS fakultaet_studiengang');
        tx.executeSql('CREATE TABLE IF NOT EXISTS fakultaet_studiengang ('+
            'fakultaet_id INTEGER NOT NULL, ' +
            'studiengang_id INTEGER NOT NULL, ' +
            'last_update TIMESTAMP(8)' +
            ')');

        // link user <-> vorlesung
        drop && tx.executeSql('DROP TABLE IF EXISTS user_vorlesung');
        tx.executeSql('CREATE TABLE IF NOT EXISTS user_vorlesung ('+
            'user_id INTEGER NOT NULL, ' +
            'vorlesung_id INTEGER NOT NULL, ' +
            'last_update TIMESTAMP(8)' +
            ')');

    }, function(err) {
        log(err);
    }, function() {
        MS.db.isCreated = true;
        log('db success');
    });

    MS.db.obj.transaction(function(tx) {
        tx.executeSql('INSERT INTO type (id, name) VALUES (1, "vorlesung")');
        tx.executeSql('INSERT INTO type (id, name) VALUES (2, "praktikum")');
    }, function(err) {
        log('enum failed', err);
    }, function() {
        log('enum success');
    });

    /**
     *
     * @param table
     * @param values
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
     * ToDo: dont pass sql
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

});