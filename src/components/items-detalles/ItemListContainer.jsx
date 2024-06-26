import { useEffect, useState } from 'react';
import { ItemList } from './ItemList';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export const ItemListContainer = ({greeting}) => {

    let { categoryId } = useParams();
    let [productos, setProductos] = useState([]);
    let [titulo, setTitulo] = useState("Productos");

    useEffect(() => {
        const productosRef = collection(db, "productos");
        const q = categoryId ? query(productosRef, where("categoria.id", "==", categoryId)) : productosRef;

        const categoriasRef = collection(db, "categorias");
        let catQuery = categoryId && query(categoriasRef, where("id", "==", categoryId));

        getDocs(q)
            .then((res) => {
                setProductos(
                    res.docs.map((doc) => {
                        return { ...doc.data(), id: doc.id }
                    })
                )
            });

        if (catQuery) {
            getDocs(catQuery)
                .then((res) => {
                    if (res.docs.length > 0) {
                        setTitulo(res.docs[1].data().nombre);
                    } else {
                        setTitulo("Gorritas baratitas");
                    }
                });
        } else {
            setTitulo("Las mejores gorras!");
        }
    }, [categoryId]);
  

  return (
    <div className="item-list-container">
      <h1>{titulo}</h1>
      <ItemList productos={productos} />
    </div>
  )
}