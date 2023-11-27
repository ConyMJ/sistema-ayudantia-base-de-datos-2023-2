function login(req, res) {
    if(req.session.loggedin != true) {
        res.render('login/index');
    }
    else {
        res.redirect('/');

    }

}


function auth(req, res) {
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            return res.status(500).send('Error interno del servidor');
        }

        conn.query('SELECT * FROM users WHERE rut = ?', [data.rut], (err, userdata) => {
            if (err) {
                console.error('Error al realizar la consulta a la base de datos:', err);
                return res.status(500).send('Error interno del servidor');
            }

            if (userdata.length > 0) {
                const user = userdata[0]; 

                
                if (data.password === user.password) {
                    req.session.loggedin = true;
                    req.session.name = user.name;
                    res.redirect('/');
                } else {
                    res.render('login/index', { error: 'Error: clave incorrecta!!!!!' });
                }
            } else {
                res.render('login/index', { error: 'Error: El usuario no existe!!!!!' });
            }
        });
    });
}



function register(req, res) {
    if(req.session.loggedin != true) {
        res.render('login/register');
    }
    else {
        res.redirect('/');

    }
}

function storeUser(req, res) {
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            return res.status(500).send('Error interno del servidor');
        }

        conn.query('SELECT * FROM users WHERE rut = ?', [data.rut], (err, userdata) => {
            if (err) {
                console.error('Error al realizar la consulta a la base de datos:', err);
                return res.status(500).send('Error interno del servidor');
            }

            if (userdata.length > 0) {
                res.render('login/register', {error:'Error:El usuario ya existe!!!!!' });
            } else {
                conn.query('INSERT INTO users SET ?', [data], (err, rows) => {
                    if (err) {
                        console.error('Error al insertar usuario en la base de datos:', err);
                        return res.status(500).send('Error interno del servidor');
                    }

                    req.session.loggedin= true;
                    req.session.name = data.name;

                    return res.redirect('/');
                });
            }
        });
    });
}

function logout (req,res){
    if (req.session.loggedin == true) {
        req.session.destroy();
    }
    res.redirect('/login');
}



module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout,
};