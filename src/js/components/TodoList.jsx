import React, { useEffect, useState } from "react";

const TodoList = () => {
    const [tarea, setTarea] = useState([]);
    const [nuevaTarea, setNuevaTarea] = useState("");
    const username = "Moises"



    const obtenerTareas = async () => {
        try {
            const resp = await fetch("https://playground.4geeks.com/todo/users/" + username)
            if (!resp.ok) throw new Error(resp.status)
            const data = await resp.json()
            setTarea(data.todos)


        } catch (error) {
            console.log(error)
            crearNuevoUsuario()

        }


    }

    const crearNuevoUsuario = async () => {
        try {
            const resp = await fetch("https://playground.4geeks.com/todo/users/" + username, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST"
            });
            if (!resp.ok) throw new Error("error creando usario" + resp.status)
            return obtenerTareas()
        } catch (error) {
            console.log(error)

        }
    }

    const handleChange = async (e) =>{
       setNuevaTarea(e.target.value)
    }


    useEffect(() => {
        obtenerTareas()
    }, [])

    const crearNuevaTarea = async () => {

        if (nuevaTarea.trim() === "") {
            alert("la tarea no puede estar vacia");
            return;
        }

        try {
            const resp = await fetch("https://playground.4geeks.com/todo/todos/" + username, {
                method: "POST",
                body: JSON.stringify({ label: nuevaTarea, is_done: false }),
                headers: { "Content-Type": "application/json" }
            });
            if (!resp.ok) throw new Error("Error en crear la tarea")
            setNuevaTarea("");
            obtenerTareas();

        } catch (error) {
            console.log("error añadiendo tarea", error)

        }
    }

    const handleEliminarTarea = async (id) => {
        try {
            const resp = await fetch("https://playground.4geeks.com/todo/todos/" + id, {
                method: "DELETE"
            });
            if (!resp.ok) throw new Error("Error eliminando tarea")
            let aux = [...tarea]
            aux = aux.filter(el => el.id != id)
            setTarea(aux)

        } catch (error) {
            console.log(error)

        }

    }


    const handleSubmit = e => {
        e.preventDefault();
        crearNuevaTarea();
        setNuevaTarea('');
    }
const handleCompletado =async(label,id) =>{
    try {
        const resp = await fetch("https://playground.4geeks.com/todo/todos/" + id,{
            method:"PUT",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({is_done:true})
        })
        if(!resp.ok) throw new Error("Error al completar tarea")
            const data = await resp.json()

        const aux = [...tarea]
        const index= aux.findIndex(el=> el.id ==id)
        aux[index]=data 
        setTarea(aux)
    } catch (error) {
        console.log(error)
    }

}


return (
    <div className="container text-center">
        <h1>TodoList</h1>
        <form className="form-control my-5 mx-auto" 
        onSubmit={handleSubmit}>
            <div className="input-group w-50 mx-auto">
                <input type="text"
                className="form-control-input"
                placeholder="What needs to do?"
                value={nuevaTarea} 
                onChange={handleChange}/>
                <button className="boton" type="submit" id="submit">
                    New Task
                </button>
            </div>

        </form>
        <ul className="lista">
            {tarea?.map(el=><li className={el.is_done ? 'bg-success' : 'bg-secondary-subtle'} key={el.id}>{el.label}
             <span className= "icono fa-solid fa-delete-left" onClick={()=>handleEliminarTarea(el.id)}></span>
             <span className="completo fa-solid fa-check-double" onClick={()=>handleCompletado(el.label, el.id)}></span>
            </li>
            )}
        </ul>
    </div>

)
}
export default TodoList