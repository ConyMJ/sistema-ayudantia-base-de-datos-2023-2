function crearreserva(req,res){
    res.render('acciones/crearreserva');
}

function misreservas(req,res) {
    req.getConnection((err,conn) => {
        conn.query('SELECT * FROM vuelos', (err,acciones)=>{
        if(err){
            res.json(err);
        }
        res.render('acciones/misreservas', {acciones});
    });
});
}

function store(req, res) {
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('INSERT INTO vuelos SET ?', [data], (err,rows)=> {
            res.redirect('/misreservas'); 
        });
    });
}

function destroy(req, res) {
    const id_vuelo = req.body.id_vuelo;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al obtener la conexión a la base de datos:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        conn.query('DELETE FROM vuelos WHERE id_vuelo = ?', [id_vuelo], (err, result) => {
            if (err) {
                console.error('Error al eliminar el registro de la base de datos:', err);
                res.status(500).send('Error interno del servidor');
                return;
            }

            console.log('Registro eliminado con éxito:', result);
            res.redirect('/misreservas');
        });
    });
}



//crear funciones update y edit, hacer lo mismo que en misreservas pero en vez de que te deje crear reservas, los datos del cliente ya esten mostrados en la web


function midata(req, res) {
    if (req.session.loggedin) {
        if (req.method === 'POST') {
            const updatedData = req.body;
            const rut = req.session.rut;

            req.getConnection((err, conn) => {
                if (err) {
                    console.error('Error al obtener la conexión a la base de datos:', err);
                    return res.status(500).json(err);
                }

                // Verificar si hay cambios en los datos
                conn.query('SELECT * FROM users WHERE rut = ?', [rut], (err, currentData) => {
                    if (err) {
                        console.error('Error al obtener datos actuales del usuario:', err);
                        return res.status(500).json(err);
                    }

                    if (!currentData || currentData.length === 0) {
                        console.error('No se encontraron datos para el usuario:', rut);
                        return res.status(404).send('Usuario no encontrado');
                    }

                    // Verificar si hay cambios en los datos
                    const hasChanges = Object.keys(updatedData).some(key => {
                        return updatedData[key] !== currentData[0][key];
                    });

                    // Si no hay cambios, redirigir sin realizar la actualización
                    if (!hasChanges) {
                        console.log('No hay cambios en los datos del usuario');
                        return res.redirect('/midata?message=No hay cambios en los datos del usuario');
                    }

                    // Realizar la actualización solo si hay cambios
                    conn.query('UPDATE users SET ? WHERE rut = ?', [updatedData, rut], (err, result) => {
                        if (err) {
                            console.error('Error al actualizar datos del usuario:', err);
                            return res.status(500).json(err);
                        }

                        console.log('Datos del usuario actualizados con éxito:', result);
                        res.redirect('/midata?message=Datos actualizados exitosamente');
                    });
                });
            });
        } else {
            const rut = req.session.rut;

            req.getConnection((err, conn) => {
                if (err) {
                    console.error('Error al obtener la conexión a la base de datos:', err);
                    return res.status(500).json(err);
                }

                // Obtener los datos actuales del usuario
                conn.query('SELECT * FROM users WHERE rut = ?', [rut], (err, userData) => {
                    if (err) {
                        console.error('Error al obtener datos del usuario:', err);
                        return res.status(500).json(err);
                    }

                    // Puedes usar el mensaje proporcionado en la URL para mostrar mensajes en la página
                    const message = req.query.message;

                    res.render('acciones/midata', { userData: userData[0], message: message });
                });
            });
        }
    } else {
        res.redirect('/login');
    }
}




module.exports= {
    crearreserva:crearreserva,
    midata:midata,
    misreservas:misreservas,
    store:store,
    destroy:destroy,

}